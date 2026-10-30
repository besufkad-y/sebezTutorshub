from django.urls import path
from .views import SessionListCreateView, SessionStatusUpdateView

urlpatterns = [
    path('sessions/', SessionListCreateView.as_view(), name='sessions-list-create'),
    path('sessions/update-status/', SessionStatusUpdateView.as_view(), name='session-update-status'),
]
