from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class Post(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name='posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Follow(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name='followings')
    friend = models.ForeignKey(User, on_delete= models.CASCADE, related_name='followers')

class Like(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name='liked_posts')
    post = models.ForeignKey(Post, on_delete= models.CASCADE, related_name='likes')