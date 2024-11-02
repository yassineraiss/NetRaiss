import React, { useEffect, useState } from 'react'
import api from '../api'
import { Button } from '@mui/material'
import Post from '../components/Post';

function HomePage() {

    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const getPosts = async () => {
        try {
            const response = await api.get('/api/add-list-post/')
            console.log(response)
            const data = response.data
            setPosts(data)
        } catch(error) {
            throw(error)
        }
    }

    useEffect(() => {
        getPosts();
    }, [])

    const addPost = async () => {
        try {
            const response = await api.post('/api/add-list-post/', {
                'content': content
            })
            console.log(response)
        } catch(error) {
            throw(error)
        } finally {
            setContent('');
            window.location.reload();
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            maxWidth: '500px'
        }}>
            <h1 style={{marginBottom: 0}}>Add post</h1>
            <textarea 
                cols="30" 
                rows="10"
                style={{
                    border: '3px solid black',
                    borderRadius: '20px'
                }}
                placeholder='share your post to the world'
                onChange={(e) => setContent(e.target.value)}
                value={content}
            />
            <Button 
                variant='contained' 
                color='primary'
                onClick={addPost}
            >
                Add
            </Button>
            <h3 className='m-2 text-secondary'>Posts:</h3>
            {
                !posts ? <h2>Loading Posts ...</h2> :
                posts.map(post => (
                    <Post post={post} />
                )) 
            }
        </div>
    )
}

export default HomePage