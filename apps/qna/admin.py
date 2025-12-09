from django.contrib import admin

from apps.qna.models import Question, Answer


class AnswerInline(admin.TabularInline):
    extra = 0
    model = Answer
    readonly_fields = ('skey', 'text', 'user', 'timestamp')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]
    ordering = ('-timestamp',)
    search_fields = ('skey', 'text')
    list_display = ('skey', 'text', 'timestamp')
