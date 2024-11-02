import React, { useState, useEffect } from "react"
import api from '../api'
import { TextField, Button } from '@mui/material'
import Post from "../components/Post";

function HomePage() {

    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        try {
            const response = await api.get(`/api/get-all-posts`)
            console.log(response)
            setPosts(response.data.posts);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getPosts()
    }, [])

    const addPost = async () => {
        try {
            const response = await api.post(`/api/add-post`, {
                'content': content
            })
            console.log(response)
        } catch (error) {
            console.error(error)
        } finally {
            setContent('')
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
            <h1 style={{fontFamily: 'Dosis'}}>
                Add Post
            </h1>
            <TextField 
                color='secondary'
                label='type here'
                type='text'
                sx={{mb: '1rem'}}
                onChange={(e) => {setContent(e.target.value)}}
            />
            <Button
                variant='contained'
                color='secondary'
                onClick={addPost}
                style={{
                    width: '100%',
                    borderRadius: '20px',
                }}
            >
                <h3 style={{
                    fontFamily: 'Dosis',
                    margin: 0,
                    color: 'inherit'
                }}>
                    Add post
                </h3>
            </Button>
            <h1 style={{fontFamily: 'Dosis'}}>
                Posts
            </h1>
            {posts && posts.length > 0 ? (
                posts.map(post => (
                    <Post key={post.id} post={post} />
                ))
            ) : (
                <h2>Loading posts ...</h2>
            )}
        </div>
    )
}

export default HomePage