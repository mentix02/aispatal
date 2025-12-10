from typing import Optional

from rest_framework.request import Request
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import BaseAuthentication, get_authorization_header

from apps.user.models import User


class AccessTokenAuthentication(BaseAuthentication):

    header = 'Access'

    def authenticate(self, request: Request) -> Optional[tuple[User, str]]:
        auth = get_authorization_header(request).split()

        if not auth or auth[0].lower() != self.header.lower().encode():
            return None

        if len(auth) == 1:
            msg = _('Invalid token header. No credentials provided.')
            raise AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _('Invalid token header. Token string should not contain spaces.')
            raise AuthenticationFailed(msg)

        try:
            token = auth[1].decode()
        except UnicodeError:
            msg = _('Invalid token header. Token string should not contain invalid characters.')
            raise AuthenticationFailed(msg)

        return self.authenticate_credentials(token)

    @staticmethod
    def authenticate_credentials(key: str) -> tuple[User, str]:

        try:
            user = User.objects.get(access_key=key)
        except User.DoesNotExist:
            raise AuthenticationFailed(_('Invalid access key.'))

        if not user.is_active:
            raise AuthenticationFailed(_('User inactive or deleted.'))

        return user, user.access_key

    def authenticate_header(self, request: Request) -> str:
        return self.header
