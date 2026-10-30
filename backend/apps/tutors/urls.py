from django.urls import path
from .views import SubjectListView, TutorListView, TutorDetailView, TutorSubjectsView, TutorProfileUpdateView

urlpatterns = [
    path('subjects/', SubjectListView.as_view(), name='subjects-list'),
    path('tutors/', TutorListView.as_view(), name='tutors-list'),
    path('tutors/<int:pk>/', TutorDetailView.as_view(), name='tutor-detail'),
    path('tutors/<int:pk>/subjects/', TutorSubjectsView.as_view(), name='tutor-subjects'),
    path('tutors/update-profile/', TutorProfileUpdateView.as_view(), name='tutor-update-profile'),
]
