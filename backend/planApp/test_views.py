from django.test import TestCase
from rest_framework.test import APIClient

# Import your views and serializers
from .views import (
    set_strategic_goal, get_strategic_goals, delete_strategic_goal, update_strategic_goal,
    # ... other view functions
)
from .models import StrategicGoal
from .serializers import StrategicGoalSerializer


class TestStrategicGoalViewSet(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.data = {'name': 'Test Strategic Goal'}

    def test_create_strategic_goal(self):
        response = self.client.post('/strategic-goals/', self.data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(StrategicGoal.objects.count(), 1)
        self.assertEqual(response.data['name'], self.data['name'])

    def test_create_strategic_goal_with_invalid_data(self):
        self.data = {}
        response = self.client.post('/strategic-goals/', self.data, format='json')
        self.assertEqual(response.status_code, 400)  # Bad request
        self.assertEqual(StrategicGoal.objects.count(), 0)
        
    def test_get_strategic_goals(self):
        # Create a few strategic goals before the test
        StrategicGoal.objects.create(name='Goal 1')
        StrategicGoal.objects.create(name='Goal 2')

        response = self.client.get('/strategic-goals/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)  # Number of created goals
