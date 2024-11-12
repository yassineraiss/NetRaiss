import React, {useState} from "react"
import { Button, TextareaAutosize, Modal, Box, CircularProgress } from "@mui/material"
import { Edit } from "@mui/icons-material"
import api from "../api"

const EditPost = ({postId, content, openEdit, closeEdit, closeEmpty}) => {

    const [newContent, setNewContent] = useState(content)
    const [displayEditButton, setDisplayEditButton] = useState(true)
    const [displayMessage, setDisplayMessage] = useState('')

    const editPost = async () => {
        setDisplayEditButton(false)
        try {
            const response = await api.put(`/api/rud-post/${postId}`, {
                'content': newContent
            })
            console.log(response)
            
        } catch (error) {
            console.error(error)
        } finally {
            setDisplayMessage('Post edited')
        }
    }


    return (
        <>
            <Modal open={openEdit} onClose={() => {
                displayMessage ? closeEdit(newContent) : closeEmpty()
                setDisplayMessage('')
                setDisplayEditButton(true)
            }} >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
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
                                    <TextareaAutosize
                                        minRows={4} // Minimum number of rows
                                        value={newContent}
                                        onChange={(e) => {setNewContent(e.target.value)}}
                                        style={{
                                        width: '90%', // Full width of the container
                                        borderRadius: '20px',
                                        border: '2px solid #ccc',
                                        padding: '12px',
                                        fontSize: '1rem',
                                        lineHeight: '1.5',
                                        color: '#333',
                                        resize: 'none', // Disable manual resizing of the textarea
                                        }}
                                    />
                                    {   
                                        displayEditButton ? (
                                            <Button 
                                                variant="outlined"
                                                color="primary"
                                                sx={{borderRadius: '20px', marginTop: '2rem'}}
                                                className="inline-icon"
                                                onClick={editPost}
                                            >
                                                <Edit color="primary"/>
                                                <h3 style={{fontFamily: 'Dosis'}}>Edit post</h3>
                                            </Button>
                                            ) : (
                                            <CircularProgress color="primary" sx={{marginTop: '2rem'}} />
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
                backdropFilter: openEdit ? 'blur(5px)' : 'none', // Apply blur when modal is open
                zIndex: openEdit ? 1 : -1, // Ensure the blur appears behind the modal
                transition: 'backdrop-filter 0.3s ease',
                }}
            />
        </>
    )
}

export default EditPost