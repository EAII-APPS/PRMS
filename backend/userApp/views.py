from django.shortcuts import render, redirect
from .models import Permission,UserPermission,Role,RolePermission,UserRole
from django.http import JsonResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .models import *
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode 
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserPermission
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *  # Ensure correct import path
from rest_framework.views import APIView
import requests







# Create your views here.

@api_view(['GET'])
def getRoutes(request):
    routes = {

        "drf_endpoints": [
            {
            "url": "/users/",
            "methods": ["GET", "POST"],
            "description": "List all users or create a new user."
            },
            {
            "url": "/users/<pk>/",
            "methods": ["GET", "PUT", "PATCH", "DELETE"],
            "description": "Retrieve, update, or delete a user by their unique identifier (primary key)."
            },
            {
            "url": "/userprofiles/",
            "methods": ["GET", "POST"],
            "description": "List all user profiles or create a new profile."
            },
            {
            "url": "/userprofiles/my_profile/<pk>/",
            "methods": ["GET", "PUT", "PATCH", "DELETE"],
            "description": "Retrieve, update, or delete a user profile by its unique identifier (primary key)."
            },
            {
            "url": "/monitoring/",
            "methods": ["GET", "POST"],
            "description": "List all monitoring entries or create a new one."
            },
            {
            "url": "/monitoring/<pk>/",
            "methods": ["GET", "PUT", "PATCH", "DELETE"],
            "description": "Retrieve, update, or delete a monitoring entry by its unique identifier (primary key)."
            },
            {
            "url": "/sector/",
            "methods": ["GET", "POST"],
            "description": "List all sectors or create a new sector."
            },
            {
            "url": "/sector/<pk>/",
            "methods": ["GET", "PUT", "PATCH", "DELETE"],
            "description": "Retrieve, update, or delete a sector by its unique identifier (primary key)."
            },
            {
            "url": "/division/",
            "methods": ["GET", "POST"],
            "description": "List all divisions or create a new division."
            },
            {
            "url": "/division/<pk>/",
            "methods": ["GET", "PUT", "PATCH", "DELETE"],
            "description": "Retrieve, update, or delete a division by its unique identifier (primary key)."
            }
        ],
        "custom_endpoints": [
            {
            "url": "/endpoints",
            "method": "GET",
            "description": "Retrieve a list of all available API endpoints."
            },
            {
            "url": "/token/",
            "method": "POST",
            "description": "Obtain a JWT token for authentication."
            },
            {
            "url": "/token/refresh/",
            "method": "POST",
            "description": "Refresh an existing JWT token."
            },
            {
            "url": "/login",
            "method": "POST",
            "description": "Authenticate a user and log them in."
            },
            {
            "url": "/logout",
            "method": "POST",
            "description": "Log out a user."
            },
            {
            "url": "/change_password",
            "method": "POST",
            "description": "Change the password for the currently authenticated user."
            },
            {
            "url": "/forget_password",
            "method": "POST",
            "description": "Initiate the password reset process for a user."
            },
            {
            "url": "/reset_password",
            "method": "POST",
            "description": "Reset a user's password using a reset token or code."
            }
        ]
    }
    return JsonResponse(routes)


""" class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
 """

@api_view(['POST'])
def user_login(request):
    if request.method != "POST":
        return Response({"detail": "This view only handles POST requests."}, status=status.HTTP_400_BAD_REQUEST)

    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response("Email and/or Password are Incorrect", status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    print(user)
    if user is not None and user.is_active and user.is_deleted != True:
        login(request, user)

        # Here, we use our CustomTokenObtainPairSerializer to handle token creation
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        
        # Validate the serializer to trigger our custom token generation logic
        if serializer.is_valid():
            # Serializer is now using the overridden validate method, so it returns our custom response
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail": "Invalid login credentials."}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['GET']) # Ensures that this view can only be accessed via a POST request for security
def logout_view(request):
    logout(request)
    return Response({'message': 'logged out successfully.'}, status=status.HTTP_200_OK)


#change password function
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    data = request.data
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return Response({'error': 'Both old and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the old password is correct
    if not user.check_password(old_password):
        return Response({'error': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        # Set the new password
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)

#forget password function  
@api_view(['POST'])
def forget_password(request):
    if request.method == "POST":
        headers = request.data

        print(headers)
        email = headers.get('email')  # Assuming the key is 'email' in the received data

        try:
            user = User.objects.get(username=email)
            #user_profile = UserProfile.objects.get(user=user)
            if user is not None and user.is_active and user.is_deleted != True:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                password_reset_url = f"http://localhost:3000/changepassword/{uid}/{token}"
                
                print(password_reset_url)
                send_mail(
                    'Password Reset Request',
                    f'Please click on the link to reset your password: {password_reset_url}',
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                )

                return Response({'message': 'Password reset link sent to your email'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Only POST method is allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
def reset_password(request):
    uidb64 = request.data.get("userId")
    token = request.data.get("token")
    
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)

        if default_token_generator.check_token(user, token):
            # Assuming new password is sent in request.data
            new_password = request.data.get('newPassword')
            user.set_password(new_password)
            user.save()
            print("doneeeeeeeeeeeeeeee")
            return Response({'message': 'Password has been reset.'})
        else:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def me(request):
    user = request.user
    
    if not user.is_authenticated:
        return Response({'detail': 'Not authenticated'}, status=403)
    
    monitoring_id = user.monitoring_id.id if user.monitoring_id else None  # Assuming monitoring_id is a ForeignKey
    sector_id = user.sector_id.id if user.sector_id else None  # Assuming sector_id is a ForeignKey
    division_id = user.division_id.id if user.division_id else None  # Assuming division_id is a ForeignKey

    return Response({
        'username': user.first_name,
        'email': user.email,
        'monitoring_id': monitoring_id,
        'sector_id': sector_id,
        'division_id': division_id,
    })
    
    
    
    




def get_tokens_for_user(user):
    """
    Generate JWT tokens (access and refresh) for the authenticated user.
    """
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

@api_view(["POST"])
def key_clock_login(request):
    
    # access_token = request.GET.get("access_token")  # Get the `access_token` from query parameters
    # return Response({"data": access_token})
    try:
        # Construct the Keycloak introspection endpoint URL
        keycloak_url = f"{settings.KEYCLOAK_BASE_URL}realms/{settings.KEYCLOAK_REALM}/protocol/openid-connect/token/introspect"
        
        # Prepare payload for the introspection request
        print(keycloak_url)
        payload = {
            "token": request.GET.get("access_token"),
            "client_id": settings.KEYCLOAK_CLIENT_ID,
            "client_secret": settings.KEYCLOAK_CLIENT_SECRET,
        }
        
        # Make the request to Keycloak
        response = requests.post(keycloak_url, data=payload)
        print(response.json())
        if response.status_code == 200:
            response_data = response.json()
            

            # Check if the token is active
            if response_data["active"]:
                email = response_data["email"]  # Keycloak should return email in the response
                print(email)
                
                # Find the user by email in the database
                try:
                    this_user = User.objects.get(email=email)
                except User.DoesNotExist:
                    return Response({"message": "User with this email is not found on this system!!"}, status=217)
                
                # Authenticate and login the user
                user = authenticate(request, email=this_user.email)  # Ensure your auth backend supports email authentication
                if user:
                    # Generate JWT tokens for the user
                    tokens = get_tokens_for_user(user)
                    return Response(tokens, status=201)
                
                return Response({"message": "Authentication failed."}, status=217)

        return Response({"message": "Failed to authenticate!!"}, status=217)
    
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
