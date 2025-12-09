from django.contrib import admin

from apps.document.models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    ordering = ('-timestamp',)
    list_display = ('skey', 'name', 'timestamp', 'uploaded_by')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.select_related('uploaded_by')
        return queryset
