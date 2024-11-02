from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register', RegisterUserView.as_view(), name='register'),
    path('access-token', TokenObtainPairView.as_view(), name='access-token'),
    path('refresh-token', TokenRefreshView.as_view(), name='refresh-refresh'),
    path("add-post", AddPostView.as_view(), name="add-post"),
    path("rud-post/<int:post_id>", RUDPostView.as_view(), name="rud-post"),
    path("get-all-posts", GetAllPosts.as_view(), name="get-all-posts"),
    path("add-like/<int:post_id>", AddLike.as_view(), name="add-like"),
    path("dislike/<int:post_id>",Dislike.as_view(), name="dislike"),
    path("get-post-info/<int:post_id>", GetPostInfo.as_view(), name="get-post-info"),
    path("get-user/<str:username>", GetUserProfile.as_view(), name="get-user"),
    path("add-follow/<str:username>", AddFollow.as_view(), name="add-follow"),
    path("unfollow/<str:username>", Unfollow.as_view(), name="unfollow"),
    path("followings", GetFollowedUsersPosts.as_view(), name="followings")
]