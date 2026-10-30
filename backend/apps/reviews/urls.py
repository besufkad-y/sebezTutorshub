from django.urls import path
from .views import TutorReviewListCreateView, WebsiteReviewView, ContactUsView

urlpatterns = [
    path('reviews/tutor/', TutorReviewListCreateView.as_view(), name='tutor-review-create'),
    path('reviews/tutor/<int:tutor_id>/', TutorReviewListCreateView.as_view(), name='tutor-review-list'),
    path('reviews/website/', WebsiteReviewView.as_view(), name='website-review'),
    path('contact/', ContactUsView.as_view(), name='contact-us'),
]
