import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'
import { Button, Avatar, CircularProgress } from "@mui/material"
import { Home, Person, Logout, PeopleAlt } from "@mui/icons-material"
import PostComp from "../components/PostComp";

function Profile() {
    const { profilename } = useParams();
    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [follow, setFollow] = useState(false);
    const [sameUser, setSameUser] = useState(false);
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

    const getUserData = async () => {
        try {
            const response = await api.get(`/api/get-user/${profilename}`)
            console.log(response)
            response.data.posts && response.data.posts.length > 0 ? 
                setPosts(response.data.posts) 
            : 
                setDisplayMessage(`${profilename} has no posts.`);
            setFollowing(response.data.following);
            setFollowers(response.data.followers);
            setFollow(response.data.follow);
            setSameUser(response.data.same_user);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUsername()
        getUserData()
    }, [])

    const unfollow = async () => {
        try {
            const response = await api.delete(`/api/unfollow/${profilename}`)
            console.log(response)
            setFollowers((prevState) => prevState - 1);
            setFollow(!follow);
        } catch (error) {
            console.error(error)
        }
    }

    const addFollow = async () => {
        try {
            const response = await api.post(`/api/add-follow/${profilename}`)
            console.log(response)
            setFollowers((prevState) => prevState + 1);
            setFollow(!follow);
        } catch (error) {
            console.error(error)
        }
    }

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
                <Avatar sx={{ bgcolor: '#0066aa' }}>{username.charAt(0).toUpperCase()}</Avatar>
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
                    <h2 style={{color: 'purple', marginBottom: '1.5vw'}}>{profilename}'s profile:</h2>
                    <div className="flex-inline">
                        <h3 style={{marginTop: 0}}>Followers: {followers}</h3>
                        <h3 style={{marginTop: 0}}>Following: {following}</h3>
                    </div>
                    {
                        !sameUser ? 
                            follow ? 
                            <Button 
                                variant="outlined"
                                color="secondary"
                                sx={{borderRadius: '20px', marginBottom: '1.5rem'}}
                                onClick={unfollow}
                            >
                                <h3 style={{fontFamily: 'Dosis', margin: 0}}>Unfollow</h3>
                            </Button>
                            :
                            <Button 
                                variant="outlined"
                                color="secondary"
                                sx={{borderRadius: '20px', marginBottom: '1.5rem'}}
                                onClick={addFollow}
                            >
                                <h3 style={{fontFamily: 'Dosis', margin: 0}}>Follow</h3>
                            </Button>
                        :
                        null
                    }
                    {posts && posts.length > 0 ? (
                        posts.map(post => (
                            <PostComp key={post.id} post={post} getPosts={getUserData}/>
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

export default Profile