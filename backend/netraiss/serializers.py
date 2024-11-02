from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, Follow, Like

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):  
        user = User.objects.create_user(**validated_data)
        return user
    
class PostSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['id', 'user', 'username', 'content', 'created_at']
        extra_kwargs = {
            'user': {'read_only': True},
            'created_at': {'read_only': True}
        }

    def get_username(self, obj):
        return obj.user.username

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'user', 'friend']
        extra_kwargs = {
            'user': {'read_only': True},
            'friend': {'read_only': True}
        }

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'user', 'post']
        extra_kwargs = {
            'user': {'read_only': True},
            'post': {'read_only': True}
        }