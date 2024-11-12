import React, { useState } from "react"
import { Button, Modal, Box, CircularProgress } from "@mui/material"
import { Delete } from "@mui/icons-material"
import api from "../api"

const DeletePost = ({postId, openDelete, closeDelete, closeEmpty}) => {

    const [displayDeleteButton, setDisplayDeleteButton] = useState(true)
    const [displayMessage, setDisplayMessage] = useState('')

    const deletePost = async () => {
        try {
            const response = await api.delete(`/api/rud-post/${postId}`)
            console.log(response)
        } catch (error) {
            console.error(error)
        } finally {
            setDisplayMessage('Post deleted successfully ')
        }
    }

    return (
        <>
            <Modal open={openDelete} onClose={() => {
                displayMessage ? closeDelete() : closeEmpty()
                setDisplayMessage('')
                setDisplayDeleteButton(true)
            }} >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: '8px',
                        padding: 4,
                        boxShadow: 24,
                    }}
                >
                    {
                        displayMessage ? (
                            <div className="flex-column-center">
                                <h2 color="green">{displayMessage}</h2>
                            </div>
                        )   : (
                            <div className="flex-column-center">
                                <h2>do you really want to delete this post ? </h2>
                                {
                                    displayDeleteButton ? (
                                        <div className="button-container">
                                            <Button 
                                                variant="outlined"
                                                color="inherit"
                                                sx={{borderRadius: '20px', marginTop: '2rem'}}
                                                className="inline-icon"
                                                onClick={() => closeEmpty()}
                                            >
                                                <h3 style={{fontFamily: 'Dosis'}}>Cancel</h3>
                                            </Button>
                                            <Button 
                                                variant="outlined"
                                                color="error"
                                                sx={{borderRadius: '20px', marginTop: '2rem'}}
                                                className="inline-icon"
                                                onClick={deletePost}
                                            >
                                                <Delete color="error"/>
                                                <h3 style={{fontFamily: 'Dosis'}}>Delete post</h3>
                                            </Button>
                                        </div>) : (
                                        <CircularProgress color="error" sx={{marginTop: '2rem'}} />
                                    )
                                }
                            </div>
                        )
                    }
                </Box>
            </Modal>
            <Box
                sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backdropFilter: openDelete ? 'blur(5px)' : 'none', // Apply blur when modal is open
                zIndex: openDelete ? 1 : -1, // Ensure the blur appears behind the modal
                transition: 'backdrop-filter 0.3s ease',
                }}
            />
        </>
    )
}

export default DeletePost