import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from "@mui/material"
import { Delete, Edit, FavoriteBorder, Favorite } from "@mui/icons-material"
import Tooltip from '@mui/material/Tooltip'
import EditPost from "./EditPost"
import DeletePost from './DeletePost'
import api from '../api'

function PostComp({post, getPosts}) {

    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [content, setContent] = useState(post.content);
    const [likesNum, setLikesNum] = useState(null);
    const [liked, setLiked] = useState(null);
    const [canEdit, setCanEdit] = useState(null);

    const navigate = useNavigate()

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
            setLiked(!liked);
        } catch (error) {
            console.error(error)
        }
    }

    const dislike = async () => {
        try {
            const response = await api.delete(`/api/dislike/${post.id}`)
            console.log(response)
            setLikesNum((prevState) => prevState - 1);
            setLiked(!liked);
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <div style={{
            display: 'flex',
            flexDirection : 'column',
            padding: '0.5rem',
            border: '1.5px solid grey',
            borderRadius: '20px',
            width: '70%',
            marginBottom: '1.6vw'
        }}>
            <h2 style={{marginLeft: 0}}>{content}</h2>
            { liked ? (
                <div style={{display: 'inline-flex', alignItems: 'center'}}>
                    <Tooltip title="Like post" arrow>
                        <IconButton  aria-label="Like post" onClick={dislike}>
                            <Favorite/> 
                        </IconButton>
                    </Tooltip>
                    <h3 style={{margin: 0}}>{likesNum}</h3>
                </div>
                ) : (
                <div style={{display: 'inline-flex', alignItems: 'center'}}>
                    <Tooltip title="Like post" arrow>
                        <IconButton  aria-label="Like post" onClick={like}>
                            <FavoriteBorder/> 
                        </IconButton>
                    </Tooltip>
                    <h3 style={{margin: 0}}>{likesNum}</h3>
                </div>
            )}
            <a onClick={() => navigate(`/profile/${post.user}`)}><h2 style={{marginLeft: 0, color: 'purple', marginTop: 0}}>{post.user}</h2></a>
            <div className="flex-inline-between">
                <p style={{margin: 0}}>{post.created_at}</p>
                { canEdit ? (
                    <div style={{display: 'inline-flex', alignSelf: 'flex-end'}}>
                        <Tooltip title="Edit post" arrow>
                            <IconButton  aria-label="Edit post" onClick={() => setOpenEdit(true)}>
                                <Edit color="primary"/> 
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete post" arrow>
                            <IconButton  aria-label="Delete post" onClick={() => setOpenDelete(true)}>
                                <Delete color="error"/> 
                            </IconButton>
                        </Tooltip>
                        <EditPost 
                            postId={post.id}
                            content={post.content}
                            openEdit={openEdit} 
                            closeEmpty={() => setOpenEdit(false)}
                            closeEdit={(newContent) => {
                                setOpenEdit(false)
                                setContent(newContent)
                            }}
                        />
                        <DeletePost 
                            postId={post.id}
                            openDelete={openDelete} 
                            closeEmpty={() => setOpenDelete(false)}
                            closeDelete={() => {
                                getPosts()
                                setOpenDelete(false)
                            }}
                        />
                    </div>
                    ) : null
                }
            </div>
        </div>
    )
}

export default PostComp