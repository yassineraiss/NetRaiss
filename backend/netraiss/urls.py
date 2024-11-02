from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('create-user/', RegisterUserView.as_view(), name='create-user'),
    path('access-token/', TokenObtainPairView.as_view(), name='token'),
    path('refresh-token/', TokenRefreshView.as_view(), name='refresh'),         
    path('add-list-post/', ListCreatePost.as_view(), name='add-post'),
    path('rud-post/<int:post_id>/', RetrieveUpdateDestroyPost.as_view(), name='rud-post'),
    path('follow/<str:username>/', AddFollow.as_view(), name='follow'),
    path('unfollow/<str:username>/', DeleteFollow.as_view(), name='unfollow'),
    path('add-like/<int:post_id>/', AddLike.as_view(), name='add-like'),
    path('dislike/<int:post_id>/', DeleteLike.as_view(), name='dislike'),
    path("get-post-info/<int:post_id>/", GetPostInfo, name="get-post-info"),
]