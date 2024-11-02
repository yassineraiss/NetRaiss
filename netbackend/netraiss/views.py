from django.contrib.auth.models import User
from .serializers import UserSerializer, PostSerializer
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied


class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class AddPostView(generics.CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RUDPostView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        post_id  = self.kwargs.get('post_id')
        try:
            post = Post.objects.get(id=post_id)
            if self.request.user == post.user:
                return post
            else:
                raise PermissionDenied('Request not allowed')
        except Post.DoesNotExist:
            raise NotFound(f'Post with code {post_id} does not exist')
    
class GetAllPosts(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.all().order_by('-created_at')  # Retrieves posts in reverse chronological order
        return Response({"posts": [post.serialize() for post in posts]}, status=status.HTTP_200_OK)
    
class GetFollowedUsersPosts(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        posts = []
        
        followings = Follow.objects.filter(user=user)
        for following in followings:
            followed_user = following.friend  
            followed_user_posts = followed_user.posts.all()
            posts.extend(followed_user_posts)

        posts = sorted(posts, key=lambda post: post.created_at, reverse=True)
        return Response({"posts": [post.serialize() for post in posts]}, status=status.HTTP_200_OK)

class AddFollow(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user = request.user
        
        try:
            friend = User.objects.get(username=username)
            if Follow.objects.filter(user=user, friend=friend).exists():
                return Response({"error": "You are already following this friend."}, status=status.HTTP_400_BAD_REQUEST)
            
            follow = Follow(user=user, friend=friend)
            follow.save()
            return Response({"message": "Friend added."}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"error": "Friend not found."}, status=status.HTTP_404_NOT_FOUND)
    
class Unfollow(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, username):
        user = request.user
        
        try:
            friend = User.objects.get(username=username)
            follow = Follow.objects.filter(user=user, friend=friend)
            if follow.exists():
                follow.delete()
                return Response({"message": "Friend unfollowed."}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"error": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)
                
        except User.DoesNotExist:
            return Response({"error": "Friend not found."}, status=status.HTTP_404_NOT_FOUND)

class AddLike(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        
        try:
            post = Post.objects.get(id=post_id)
            if Like.objects.filter(user=user, post=post).exists():
                return Response({"error": "You already liked this post."}, status=status.HTTP_400_BAD_REQUEST)
            
            like = Like(user=user, post=post)
            like.save()
            return Response({"message": "Like added."}, status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
    
class Dislike(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        user = request.user
        
        try:
            post = Post.objects.get(id=post_id)
            like = Like.objects.filter(user=user, post=post)
            if like.exists():
                like.delete()
                return Response({'message': 'Like deleted successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Post was not liked in the first place.'}, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
    
class GetUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user = request.user
        follow = False
        same_user = True
        
        try:
            user_profile = User.objects.get(username=username)
            user_posts = Post.objects.filter(user=user_profile).order_by('-created_at')
            followings = user_profile.followings.count()
            followers = user_profile.followers.count()
            if user != user_profile:
                same_user = False
                if Follow.objects.filter(user=user, friend=user_profile).exists():
                    follow = True

            return Response({
                'posts': [post.serialize() for post in user_posts],
                'following': followings,
                'followers': followers,
                'follow': follow,
                'same_user': same_user
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class GetPostInfo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        user = request.user
        edit = False
        like = False

        try:
            post = Post.objects.get(id=post_id)
            likes = Like.objects.filter(post=post).count()
            if Like.objects.filter(post=post, user=user).exists():
                like = True
            if user == post.user:
                edit = True

            return Response({
                "likes": likes,
                "edit": edit,
                "like": like
            }, status=status.HTTP_200_OK)

        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
