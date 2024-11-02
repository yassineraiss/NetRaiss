import React, { useState, useEffect } from "react"
import api from '../api'
import { TextField, Button } from '@mui/material'

function Post({post}) {
    const [content, setContent] = useState(post.content);
    const [edit, setEdit] = useState(null);
    const [canEdit, setCanEdit] = useState(null);
    const [likesNum, setLikesNum] = useState(null);
    const [liked, setLiked] = useState(null);
    const [newContent, setNewContent] = useState(post.content);

    const getPostInfo = async () => {
        try {
            const response = await api.get(`/api/get-post-info/${post.id}`)
            console.log(response)
            setCanEdit(response.data.edit);
            setLikesNum(response.data.likes);
            setLiked(response.data.like)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getPostInfo()
    }, [])

    const like = async () => {
        try {
            const response = await api.post(`/api/add-like/${post.id}`)
            console.log(response)
            setLikesNum((prevState) => prevState + 1);
            setLiked(true);
        } catch (error) {
            console.error(error)
        }
    }

    const dislike = async () => {
        try {
            const response = await api.delete(`/api/dislike/${post.id}`)
            console.log(response)
            setLikesNum((prevState) => prevState - 1);
            setLiked(false);
        } catch (error) {
            console.error(error)
        }
    }

    const editPost = async () => {
        try {
            const response = await api.put(`/api/rud-post/${post.id}`, {
                'content': newContent
            })
            console.log(response)
            setContent(newContent);
            setNewContent('');
            setEdit(false);
        } catch (error) {
            console.error(error)
        }
    }

    const deletePost = async () => {
        try {
            const response = await api.delete(`/api/rud-post/${post.id}`)
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '1.4rem',
            borderRadius: '20px',
            maxWidth: '400px',
            gap: '1.6rem'
        }}>
            <h3>{content}</h3>
            <h3>{post.user}</h3>
            <h3>{post.created_at}</h3>
            <div style={{
                display: 'inline-flex',
                gap: '1rem'
            }}>
                <Button variant="contained" color="primary" onClick={like}>
                    Like
                </Button>
                <Button variant="contained" color="error" onClick={deletePost}>
                    Delete
                </Button>
            </div>
        </div>
    )

}

export default Post