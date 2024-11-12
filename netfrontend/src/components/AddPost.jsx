import React, {useState} from "react"
import { Button, TextareaAutosize, Modal, Box, CircularProgress } from "@mui/material"
import { Add } from "@mui/icons-material"
import api from "../api"

const AddPost = ({openAdd, closeAdd, closeEmpty}) => {

    const [content, setContent] = useState('')
    const [displayAddButton, setDisplayAddButton] = useState(true)
    const [displayMessage, setDisplayMessage] = useState('')

    const addPost = async () => {
        setDisplayAddButton(false)
        try {
            const response = await api.post(`/api/add-post`, {
                'content': content
            })
            console.log(response)
        } catch (error) {
            console.error(error)
        } finally {
            setContent('')
            setDisplayMessage('Post added successfully ')
        }
    }

    return (
        <>
            <Modal open={openAdd} onClose={() => {
                displayMessage ? closeAdd() : closeEmpty()
                setDisplayMessage('')
                setDisplayAddButton(true)
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
                                    placeholder="Type here..."
                                    onChange={(e) => {setContent(e.target.value)}}
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
                                    displayAddButton ? (
                                        <Button 
                                            variant="contained"
                                            color="primary"
                                            sx={{borderRadius: '20px', marginTop: '2rem'}}
                                            onClick={addPost}
                                        >
                                            <h3 style={{fontFamily: 'Dosis', margin: 0}}>Add post</h3>
                                        </Button>
                                    ) : (
                                        <CircularProgress color="primary" sx={{marginTop: '2rem'}}/>
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
                backdropFilter: openAdd ? 'blur(5px)' : 'none', // Apply blur when modal is open
                zIndex: openAdd ? 1 : -1, // Ensure the blur appears behind the modal
                transition: 'backdrop-filter 0.3s ease',
                }}
            />
        </>
    )
}

export default AddPost