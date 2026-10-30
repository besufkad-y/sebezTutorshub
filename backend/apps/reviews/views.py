from django.db import transaction
from django.db.models import Avg, Count
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.models import User
from apps.tutors.models import RatingsSummary
from .models import TutorReview, WebsiteReview, ContactMessage
from .serializers import TutorReviewSerializer, WebsiteReviewSerializer, ContactMessageSerializer

class TutorReviewListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request, tutor_id):
        reviews = TutorReview.objects.filter(tutor_id=tutor_id).select_related('student').order_by('-created_at')
        serializer = TutorReviewSerializer(reviews, many=True)
        return Response({'success': True, 'reviews': serializer.data})

    def post(self, request):
        user = request.user
        data = request.data
        tutor_id = data.get('tutor_id')
        rating = data.get('rating')
        comment = data.get('comment', '').strip()

        if not tutor_id or not rating:
            return Response({'success': False, 'message': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rating_val = int(rating)
            if rating_val < 1 or rating_val > 5:
                return Response({'success': False, 'message': 'Rating must be between 1 and 5.'}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({'success': False, 'message': 'Invalid rating.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tutor = User.objects.get(id=tutor_id, role='tutor')
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'Tutor not found.'}, status=status.HTTP_404_NOT_FOUND)

        if TutorReview.objects.filter(tutor=tutor, student=user).exists():
            return Response({'success': False, 'message': 'You have already reviewed this tutor.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            review = TutorReview.objects.create(
                tutor=tutor,
                student=user,
                rating=rating_val,
                comment=comment
            )

            # Recalculate summary
            agg = TutorReview.objects.filter(tutor=tutor).aggregate(
                avg_rating=Avg('rating'),
                total=Count('id')
            )
            avg = round(agg['avg_rating'] or 0.0, 2)
            total = agg['total'] or 0

            summary, _ = RatingsSummary.objects.get_or_create(tutor=tutor)
            summary.average_rating = avg
            summary.total_reviews = total
            summary.save()

        return Response({
            'success': True,
            'message': 'Review submitted successfully!',
            'review': TutorReviewSerializer(review).data
        }, status=status.HTTP_201_CREATED)

class WebsiteReviewView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request):
        reviews = WebsiteReview.objects.select_related('user').order_by('-created_at')[:10]
        serializer = WebsiteReviewSerializer(reviews, many=True)
        return Response({'success': True, 'reviews': serializer.data})

    def post(self, request):
        user = request.user
        data = request.data
        rating = data.get('rating')
        review_text = (data.get('review_text') or '').strip()

        if not rating or not review_text:
            return Response({'success': False, 'message': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rating_val = int(rating)
            if rating_val < 1 or rating_val > 5:
                return Response({'success': False, 'message': 'Rating must be between 1 and 5.'}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({'success': False, 'message': 'Invalid rating.'}, status=status.HTTP_400_BAD_REQUEST)

        review, _ = WebsiteReview.objects.update_or_create(
            user=user,
            defaults={'rating': rating_val, 'review_text': review_text}
        )

        return Response({'success': True, 'message': 'Review submitted successfully!', 'review': WebsiteReviewSerializer(review).data})

class ContactUsView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'message': 'All fields are required.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response({'success': True, 'message': 'Message sent successfully!'}, status=status.HTTP_201_CREATED)
