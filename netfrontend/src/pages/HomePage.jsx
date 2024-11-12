import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { Button, Avatar, CircularProgress } from "@mui/material"
import { Home, Person, Logout, Add, PeopleAlt } from "@mui/icons-material"
import AddPost from "../components/AddPost";
import PostComp from "../components/PostComp";
import api from "../api";

function HomePage() {

    const navigate = useNavigate()
    const [openAdd, setOpenAdd] = useState(false);
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState(null)
    const [openRefresh, setOpenRefresh] = useState(false)

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
        getUsername()
        getPosts()
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
                    <Button onClick={() => navigate(`/`)} className="inline-icon" color="inherit" sx={{display: 'flex', alignItems: 'center', fontFamily: 'Dosis', color:'grey'}}><Home color="silver" /><h3>Home</h3></Button>
                    <Button onClick={() => navigate(`/profile/${username}`)} className="inline-icon" color="inherit" sx={{display: 'flex', alignItems: 'center', fontFamily: 'Dosis', color:'grey'}}><Person color="silver" /><h3>Profile</h3></Button>
                    <Button onClick={() => navigate(`/following`)} className="inline-icon" color="inherit" sx={{display: 'flex', alignItems: 'center', fontFamily: 'Dosis', color:'grey'}}><PeopleAlt color="silver" /><h3>Following</h3></Button>
                    <Button onClick={() => navigate(`/logout`)} className="inline-icon" color="inherit" sx={{display: 'flex', alignItems: 'center', fontFamily: 'Dosis', color:'grey'}}><Logout color="silver" /><h3>Logout</h3></Button>
                </div>
                <div className="flex-column-center" style={{marginRight: '6.5vw', gap: '1w'}}>
                    <h2 style={{color: 'purple', marginBottom: '1.5vw'}}>All posts:</h2>
                    {posts && posts.length > 0 ? (
                        posts.map(post => (
                            <PostComp key={post.id} post={post} getPosts={getPosts}/>
                        ))
                    ) : (
                        <CircularProgress color="secondary" sx={{marginTop: '1.5rem'}} />
                    )}
                </div>
            </div>
            <AddPost openAdd={openAdd} closeEmpty={() => setOpenAdd(false)} closeAdd={() => {
                setOpenAdd(false)
                getPosts()
            }}/>
        </div>
    )
}

export default HomePage