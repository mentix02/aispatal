from django.contrib import admin

from apps.article.models import Article


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title', 'timestamp', 'category', 'author')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('author')
