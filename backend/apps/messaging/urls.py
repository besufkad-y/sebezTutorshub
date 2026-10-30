from django.urls import path
from .views import MessageCreateView, MessageThreadView, ConversationListView

urlpatterns = [
    path('messages/', MessageCreateView.as_view(), name='message-create'),
    path('messages/conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('messages/<int:partner_id>/', MessageThreadView.as_view(), name='message-thread'),
]
