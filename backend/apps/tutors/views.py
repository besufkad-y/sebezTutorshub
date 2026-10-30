import json
import os
from django.conf import settings
from django.core.files.storage import default_storage
from django.db.models import F
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.models import User
from apps.accounts.serializers import UserSerializer
from .models import Subject, TutorProfile, RatingsSummary, TutorSubject
from .serializers import SubjectSerializer, TutorDetailSerializer

class SubjectListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        subjects = Subject.objects.all().order_by('name')
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

class TutorListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        tutor_id = request.query_params.get('tutor_id')
        if tutor_id:
            try:
                user = User.objects.select_related('tutor_profile', 'ratings_summary').prefetch_related('tutor_subjects__subject').get(id=tutor_id, role='tutor')
                return Response(TutorDetailSerializer(user).data)
            except User.DoesNotExist:
                return Response({'success': False, 'message': 'Tutor not found.'}, status=status.HTTP_404_NOT_FOUND)

        queryset = User.objects.filter(role='tutor').select_related('tutor_profile', 'ratings_summary').prefetch_related('tutor_subjects__subject')

        subject_id = request.query_params.get('subject')
        if subject_id:
            queryset = queryset.filter(tutor_subjects__subject_id=subject_id).distinct()

        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(tutor_profile__bio__icontains=search)
            ).distinct()

        top_rated = request.query_params.get('top_rated')
        if top_rated and top_rated in ['1', 'true', True]:
            queryset = queryset.order_by(
                F('ratings_summary__average_rating').desc(nulls_last=True),
                F('ratings_summary__total_reviews').desc(nulls_last=True)
            )[:3]
        else:
            queryset = queryset.order_by('-created_at')

        serializer = TutorDetailSerializer(queryset, many=True)
        return Response(serializer.data)

class TutorDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            tutor = User.objects.select_related('tutor_profile', 'ratings_summary').prefetch_related('tutor_subjects__subject').get(id=pk, role='tutor')
            return Response(TutorDetailSerializer(tutor).data)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'Tutor not found.'}, status=status.HTTP_404_NOT_FOUND)

class TutorSubjectsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            tutor = User.objects.get(id=pk, role='tutor')
            subjects = list(tutor.tutor_subjects.values_list('subject_id', flat=True))
            return Response({'success': True, 'subjects': subjects})
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'Tutor not found.'}, status=status.HTTP_404_NOT_FOUND)

class TutorProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != 'tutor':
            return Response({'success': False, 'message': 'Only tutors can edit their profile.'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        first_name = data.get('first_name', user.first_name)
        last_name = data.get('last_name', user.last_name)
        phone_number = data.get('phone_number', user.phone_number)
        address = data.get('address', user.address)

        bio = data.get('bio')
        education = data.get('education')
        hourly_rate = data.get('hourly_rate')
        availability = data.get('availability')

        # Parse subjects
        raw_subjects = data.get('subjects')
        subject_ids = []
        if raw_subjects:
            if isinstance(raw_subjects, str):
                try:
                    subject_ids = json.loads(raw_subjects)
                except json.JSONDecodeError:
                    subject_ids = [s.strip() for s in raw_subjects.split(',') if s.strip()]
            elif isinstance(raw_subjects, list):
                subject_ids = raw_subjects

        if len(subject_ids) > 7:
            return Response({
                'success': False,
                'message': 'Maximum limit of 7 subjects exceeded. Please select up to 7 subjects.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Handle image upload
        if 'profile_image' in request.FILES:
            file = request.FILES['profile_image']
            filename = f"user_{user.id}_{int(os.times().system)}_{file.name}"
            saved_path = default_storage.save(f"users/{filename}", file)
            user.profile_picture_url = f"/media/{saved_path}"
        elif data.get('profile_picture_url'):
            user.profile_picture_url = data.get('profile_picture_url')

        user.first_name = first_name
        user.last_name = last_name
        user.phone_number = phone_number
        user.address = address
        user.save()

        # Update or create TutorProfile
        profile, _ = TutorProfile.objects.get_or_create(tutor=user)
        if bio is not None:
            profile.bio = bio
        if education is not None:
            profile.education = education
        if hourly_rate is not None and hourly_rate != '':
            try:
                profile.hourly_rate = float(hourly_rate)
            except ValueError:
                pass
        if availability is not None:
            profile.availability = availability
        profile.save()

        # Update subjects
        if raw_subjects is not None:
            TutorSubject.objects.filter(tutor=user).delete()
            for s_id in subject_ids:
                try:
                    sub = Subject.objects.get(subject_id=s_id)
                    TutorSubject.objects.create(tutor=user, subject=sub)
                except (Subject.DoesNotExist, ValueError):
                    pass

        return Response({
            'success': True,
            'message': 'Profile updated successfully!',
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
