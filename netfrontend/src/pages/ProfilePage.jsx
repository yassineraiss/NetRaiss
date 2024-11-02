import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'
import Post from "../components/Post";

function Profile() {
    const { username } = useParams();
    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [follow, setFollow] = useState(false);
    const [sameUser, setSameUser] = useState(false);

    const getUserData = async () => {
        try {
            const response = await api.get(`/api/get-user/${username}`)
            console.log(response)
            setPosts(response.data.posts);
            setFollowing(response.data.following);
            setFollowers(response.data.followers);
            setFollow(response.data.follow);
            setSameUser(response.data.same_user);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    return <h1>Profile {username} </h1>
}

export default Profile