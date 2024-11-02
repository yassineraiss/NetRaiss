from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .serializers import *
from rest_framework.exceptions import NotFound

# Create your views here.

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ListCreatePost(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Post.objects.all().order_by('-created_at')
    
class RetrieveUpdateDestroyPost(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        post_id = self.kwargs.get('post_id')
        try:
            return Post.objects.get(code=post_id)
        except Post.DoesNotExist:
            raise NotFound(f'Room with code {post_id} does not exist')
        
class AddFollow(generics.CreateAPIView):
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        username = self.kwargs.get('username')
        try:
            friend = User.objects.get(username=username)
            serializer.save(user=self.request.user, friend=friend)
        except User.DoesNotExist:
            raise NotFound('User does not exist')
        
class DeleteFollow(generics.DestroyAPIView):
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        username = self.kwargs.get('username')
        try:
            friend = User.objects.get(username=username)
            try:
                return Follow.objects.get(user=user, friend=friend)
            except Follow.DoesNotExist:
                raise NotFound('Follow relationship does not exist')
        except User.DoesNotExist:
            raise NotFound('User does not exist')
        
class AddLike(generics.CreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        try:
            post = Post.objects.get(id=post_id)
            serializer.save(user=self.request.user, post=post)
        except Post.DoesNotExist:
            raise NotFound('Post does not exist')

class DeleteLike(generics.DestroyAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        post_id = self.kwargs.get('post_id')
        try:
            post = Post.objects.get(id=post_id)
            try:
                return Like.objects.get(user=user, post=post)
            except Like.DoesNotExist:
                raise NotFound('like does not exist')
        except Post.DoesNotExist:
            raise NotFound('post does not exist')
        
def GetPostInfo(request, post_id):
    user = request.user
    edit = False
    like = False
    if request.method == 'GET':
        try:
            post = Post.objects.get(id=post_id)
            likes = Like.objects.filter(post=post).count()
            if Like.objects.filter(post=post, user=user).exists():
                like = True
            if user == post.user:
                edit = True
            return JsonResponse({
                "likes": likes,
                "edit": edit,
                "like": like
            }, status=200)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
    else: 
        return JsonResponse({"error": "Request should be via GET."}, status=400)