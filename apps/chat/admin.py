from django.contrib import admin

from apps.chat.models import Chat, Message


class MessageInline(admin.TabularInline):
    extra = 0
    model = Message
    can_delete = False
    readonly_fields = ('content', 'role', 'timestamp')


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    inlines = [MessageInline]
    list_filter = ('model', 'timestamp')
    readonly_fields = ('skey', 'timestamp')
    list_display = ('skey', 'user', 'title', 'model', 'timestamp')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.select_related('user')
        return queryset
