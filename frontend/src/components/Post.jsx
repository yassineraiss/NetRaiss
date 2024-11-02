import { useState, useEffect } from "react";
import api from "../api";

function Post({post}) {
    const [content, setContent] = useState(post.content);
    const [edit, setEdit] = useState(null);
    const [canEdit, setCanEdit] = useState(null);
    const [likesNum, setLikesNum] = useState(null);
    const [liked, setLiked] = useState(null);
    const [newContent, setNewContent] = useState(post.content);

    const getPostInfo = async (postId) => {
        try {
            const response = await api.get(`/api/get-post-info/${postId}/`)
            const data = response.data; 
            console.log(data);
            setCanEdit(data.edit);
            setLikesNum(data.likes);
            setLiked(data.like)
        } catch(error) {
            throw(error)
        }
    }

    useEffect(() => {
        getPostInfo(post.id)
    }, [])

    const editPost = async (postId) => {
        try {
            const response = await api.put(`/api/rud-post/${postId}`, {
                'content': newContent
            })
            console.log(response)
        } catch(error) {
            throw(error)
        } finally {
            setContent(newContent);
            setNewContent('');
            setEdit(false);
        }
    }

    const deletePost = async (postId) => {
        try {
            const response = await api.delete(`/api/rud-post/${postId}`)
            console.log(response)
        } catch(error) {
            throw(error)
        }
    }

    const addLike = async (postId) => {
        try {
            const response = await api.post(`/api/add-like/${postId}`)
            console.log(response)
        } catch(error) {
            throw(error)
        } finally {
            setLikesNum((prevState) => prevState + 1);
            setLiked(true);
        }
    }

    const dislike = async (postId) => {
        try {
            const response = await api.post(`/api/dislike/${postId}`)
            console.log(response)
        } catch(error) {
            throw(error)
        } finally {
            setLikesNum((prevState) => prevState - 1);
            setLiked(false);
        }
    }

    return (
        <div key={post.id} className="w-100">
            {
                !edit ?
                <div className="d-flex flex-column mt-2 p-2 border border-3">
                    <h3>{content}</h3>
                    {
                        liked ?
                        <a 
                            onClick={dislike} 
                            className="d-flex text-decoration-none link-hover"
                        >
                            <i className="bi bi-heart-fill text-danger mr-1" style={{
                                transition: 'color 0.3s ease',
                                cursor: 'pointer'
                            }}></i>
                            <h5>{likesNum}</h5>
                        </a>
                        :
                        <a 
                            onClick={addLike} 
                            className="d-flex text-decoration-none link-hover"
                        >
                            <i className="bi bi-heart mr-1" style={{
                                transition: 'color 0.3s ease',
                                cursor: 'pointer'
                            }}></i>
                            <h5>{likesNum}</h5>
                        </a>
                    }
                    <a href={`/profile/${post.user}`}><h5>{post.user}</h5></a>
                    <p>{post.created_at}</p>
                    {
                        canEdit ?
                        <button onClick={() => setEdit(true)}  className='m-2 btn btn-link'>
                            <i className="bi bi-pencil"></i> Edit post
                        </button>
                        : null
                    }
                </div> 
                :
                <div className='d-flex flex-column align-items-center border border-3 border-primary rounded mt-2 p-2'>
                    <h3 className='m-2 text-secondary'>Edit Post:</h3>
                    <textarea 
                        id="textarea" 
                        className='m-2 form-control form-control-lg '
                        placeholder="Type here..."
                        value={newContent} 
                        onChange={(e) => setNewContent(e.target.value)}
                    />
                    <button 
                        type="button"
                        className='m-2 btn btn-primary' 
                        onClick={() => {
                            editPost(post.id);
                            setEdit(false);
                        }}
                    >
                        Save
                    </button>
                </div>
            }    
        </div>
    )
}

export default Post