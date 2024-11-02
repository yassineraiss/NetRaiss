import React, { useEffect, useState } from 'react';
import api from '../api'
import Post from "../components/Post";

function Following() {

    const [posts, setPosts] = useState([]);
    const followings = async () => {
        try {
            const response = await api.get(`/api/followings`)
            console.log(response)
            setPosts(response.data.posts);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        followings()
    }, [])

    return <h1>Following </h1>
}

export default Following