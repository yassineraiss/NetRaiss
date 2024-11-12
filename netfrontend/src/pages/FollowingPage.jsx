import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../api'
import { Button, Avatar, CircularProgress } from "@mui/material"
import { Home, Person, Logout, Add, PeopleAlt } from "@mui/icons-material"
import PostComp from "../components/PostComp";

function Following() {

    const [posts, setPosts] = useState([]);
    const [displayMessage, setDisplayMessage] = useState('')
    const [username, setUsername] = useState(null)
    const [openRefresh, setOpenRefresh] = useState(false)

    const navigate = useNavigate()

    const getUsername = async () => {
        try {
            const response = await api.get(`/api/get-username`)
            console.log(response)
            setUsername(response.data.username)
        } catch (error) {
            console.error(error)
            setOpenRefresh(true)
        }
    }

    const followings = async () => {
        try {
            const response = await api.get(`/api/followings`)
            console.log(response)
            response.data.posts && response.data.posts.length > 0 ? 
                setPosts(response.data.posts) 
            : 
                setDisplayMessage('No posts.');
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUsername()
        followings()
    }, [])

    if (!username) return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100vh'
        }}>
            <CircularProgress color="primary" />
        </div>
    )

    return (
        <div className="main-div">
            <div className="flex-inline-between">
                <h1>NetRaiss</h1>
                <div className="button-container">
                    <Button 
                        variant="outlined"
                        color="primary"
                        sx={{borderRadius: '20px'}}
                        className="inline-icon"
                        onClick={() => {
                            setOpenAdd(true)
                        }}
                    >
                        <Add color="primary"/>
                        <h3 style={{fontFamily: 'Dosis'}}>Add post</h3>
                    </Button>
                    <Avatar sx={{ bgcolor: '#0066aa' }}>{username.charAt(0).toUpperCase()}</Avatar>
                </div>
            </div>
            <div className="flex-inline">
                <div className="flex-column">
                <div className="flex-column">
                    <Button onClick={() => navigate(`/`)} className="inline-icon" color="inherit" sx={{display: 'flex', alignItems: 'center', fontFamily: 'Dosis', color:'grey'}}><Home color="silver" /><h3>Home</h3></Button>
                    <Button onClick={() => navigate(`/profile/${username}`)} className="inline-icon" color="inherit" sx={{display: 'flex', alignItems: 'center', fontFamily: 'Dosis', color:'grey'}}><Person color="silver" /><h3>Profile</h3></Button>
                    <Button onClick={() => navigate(`/following`)} className="inline-icon" color="inherit" sx={{display: 'flex', alignItems: 'center', fontFamily: 'Dosis', color:'grey'}}><PeopleAlt color="silver" /><h3>Following</h3></Button>
                    <Button onClick={() => navigate(`/logout`)} className="inline-icon" color="inherit" sx={{display: 'flex', alignItems: 'center', fontFamily: 'Dosis', color:'grey'}}><Logout color="silver" /><h3>Logout</h3></Button>
                </div>
                </div>
                <div className="flex-column-center" style={{marginRight: '6.5vw', gap: '1w'}}>
                    <h2 style={{color: 'purple', marginBottom: '1.5vw'}}>Following:</h2>
                    {posts && posts.length > 0 ? (
                        posts.map(post => (
                            <PostComp key={post.id} post={post} getPosts={followings}/>
                        ))
                    ) : displayMessage ? (
                        <h3>No posts.</h3>
                    ) :(
                        <CircularProgress color="secondary" sx={{marginTop: '1.5rem'}} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Following