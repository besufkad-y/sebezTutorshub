import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User
from apps.tutors.models import Subject, TutorProfile, RatingsSummary, TutorSubject
from apps.reviews.models import TutorReview, WebsiteReview

def seed():
    print("Applying migrations...")
    from django.core.management import call_command
    call_command('migrate')

    print("Seeding subjects...")
    subjects_data = [
        "Mathematics",
        "Science",
        "Physics",
        "Chemistry",
        "Biology",
        "Languages",
        "English",
        "Spanish",
        "French",
        "Computer Science",
        "Test Preparation",
        "Business & Economics",
        "History"
    ]
    created_subjects = {}
    for name in subjects_data:
        subj, _ = Subject.objects.get_or_create(name=name)
        created_subjects[name] = subj

    print("Seeding tutors...")
    tutors_data = [
        {
            "first_name": "Eleanor",
            "last_name": "Vance",
            "email": "eleanor@tutors.org",
            "role": "tutor",
            "profile_picture_url": "/images/users/1.jpg",
            "phone_number": "+1 (555) 234-5678",
            "address": "San Francisco, CA",
            "bio": "PhD in Mathematics with 8+ years experience tutoring AP Calculus, Linear Algebra, and SAT prep.",
            "education": "PhD in Applied Mathematics, Stanford University",
            "hourly_rate": 65.00,
            "availability": "Mon, Wed, Fri (Afternoons)",
            "rating": 4.9,
            "reviews_count": 28,
            "subjects": ["Mathematics", "Physics", "Test Preparation"]
        },
        {
            "first_name": "David",
            "last_name": "Chen",
            "email": "david@tutors.org",
            "role": "tutor",
            "profile_picture_url": "/images/users/2.jpg",
            "phone_number": "+1 (555) 345-6789",
            "address": "Seattle, WA",
            "bio": "Senior Software Engineer passionate about teaching Python, Full-stack Web Development, and Algorithms.",
            "education": "MS in Computer Science, University of Washington",
            "hourly_rate": 75.00,
            "availability": "Tue, Thu, Sat (Evenings)",
            "rating": 4.95,
            "reviews_count": 34,
            "subjects": ["Computer Science", "Mathematics"]
        },
        {
            "first_name": "Sophia",
            "last_name": "Martinez",
            "email": "sophia@tutors.org",
            "role": "tutor",
            "profile_picture_url": "/images/users/3.jpg",
            "phone_number": "+1 (555) 456-7890",
            "address": "Austin, TX",
            "bio": "Bilingual educator specializing in Spanish, French, and academic writing for high school and university students.",
            "education": "MA in Romance Linguistics, Columbia University",
            "hourly_rate": 50.00,
            "availability": "Mon - Fri (Mornings & Afternoons)",
            "rating": 4.85,
            "reviews_count": 19,
            "subjects": ["Languages", "Spanish", "French", "English"]
        },
        {
            "first_name": "Marcus",
            "last_name": "Sterling",
            "email": "marcus@tutors.org",
            "role": "tutor",
            "profile_picture_url": "/images/users/4.jpg",
            "phone_number": "+1 (555) 567-8901",
            "address": "Chicago, IL",
            "bio": "Biochemist and pre-med advisor helping students master General Chemistry, Organic Chemistry, and Biology.",
            "education": "BS Biochemistry, Northwestern; MD Candidate",
            "hourly_rate": 60.00,
            "availability": "Weekends & Evening",
            "rating": 4.75,
            "reviews_count": 15,
            "subjects": ["Chemistry", "Biology", "Science"]
        },
        {
            "first_name": "Clara",
            "last_name": "Oswald",
            "email": "clara@tutors.org",
            "role": "tutor",
            "profile_picture_url": "/images/users/5.jpg",
            "phone_number": "+1 (555) 678-9012",
            "address": "Boston, MA",
            "bio": "History and literature specialist with a focus on IB History, AP European History, and essay coaching.",
            "education": "MA in History, Oxford University",
            "hourly_rate": 55.00,
            "availability": "Mon, Tue, Thu (Afternoons)",
            "rating": 4.80,
            "reviews_count": 12,
            "subjects": ["History", "English"]
        },
        {
            "first_name": "Lucas",
            "last_name": "Ahn",
            "email": "lucas@tutors.org",
            "role": "tutor",
            "profile_picture_url": "/images/users/6.jpg",
            "phone_number": "+1 (555) 789-0123",
            "address": "New York, NY",
            "bio": "Former Wall Street analyst teaching Microeconomics, Macroeconomics, Corporate Finance, and MBA prep.",
            "education": "MBA, Wharton School of Business",
            "hourly_rate": 80.00,
            "availability": "Flexible schedule",
            "rating": 4.70,
            "reviews_count": 10,
            "subjects": ["Business & Economics", "Mathematics"]
        }
    ]

    for tdata in tutors_data:
        user = User.objects.filter(email=tdata["email"]).first()
        if not user:
            user = User.objects.create_user(
                email=tdata["email"],
                password="password123",
                first_name=tdata["first_name"],
                last_name=tdata["last_name"],
                role="tutor",
                profile_picture_url=tdata["profile_picture_url"],
                phone_number=tdata["phone_number"],
                address=tdata["address"]
            )

        profile, _ = TutorProfile.objects.get_or_create(
            tutor=user,
            defaults={
                "bio": tdata["bio"],
                "education": tdata["education"],
                "hourly_rate": tdata["hourly_rate"],
                "availability": tdata["availability"],
            }
        )

        RatingsSummary.objects.get_or_create(
            tutor=user,
            defaults={
                "average_rating": tdata["rating"],
                "total_reviews": tdata["reviews_count"]
            }
        )

        # Subjects
        for s_name in tdata["subjects"]:
            if s_name in created_subjects:
                TutorSubject.objects.get_or_create(tutor=user, subject=created_subjects[s_name])

    # Create sample student and parent accounts for testing
    student = User.objects.filter(email="student@example.com").first()
    if not student:
        student = User.objects.create_user(
            email="student@example.com",
            password="password123",
            first_name="Alex",
            last_name="Student",
            role="student",
            phone_number="+1 (555) 111-2222",
            address="San Jose, CA"
        )

    parent = User.objects.filter(email="parent@example.com").first()
    if not parent:
        parent = User.objects.create_user(
            email="parent@example.com",
            password="password123",
            first_name="Sarah",
            last_name="Parent",
            role="parent",
            phone_number="+1 (555) 333-4444",
            address="San Jose, CA"
        )

    # Seed sample reviews
    tutor1 = User.objects.get(email="eleanor@tutors.org")
    TutorReview.objects.get_or_create(
        tutor=tutor1,
        student=student,
        defaults={
            "rating": 5,
            "comment": "Eleanor is fantastic! She broke down Calculus concepts that my school teacher struggled to explain."
        }
    )

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
