from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.user.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ('name',)
    list_filter = ('email_verified',)
    search_fields = ('name', 'email')
    list_display = ('email', 'name', 'is_staff', 'last_login')
    readonly_fields = ('skey', 'created_at', 'updated_at', 'last_login')

    def avatar(self, obj: User) -> str:
        if obj.image:
            return format_html('<img src="{src}" style="width: 250px; height: 250px;" />', src=obj.image)
        return format_html('<span style="color: red;">{text}</span>', text=_('No avatar'))

    avatar.short_description = _('Avatar')

    add_fieldsets = (
        (
            None,
            {'classes': ('wide',), 'fields': ('email', 'usable_password', 'password1', 'password2')},
        ),
    )

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Image'), {'fields': ('avatar',)}),
        (_('Personal info'), {'fields': ('name', 'image')}),
        (_('Important dates'), {'fields': ('last_login', 'created_at', 'updated_at')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
