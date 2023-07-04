import React, { useState } from 'react';
import {
    Button,
    TextField,
    IconButton,
    useTheme,
  } from "@mui/material";
  import SendIcon from '@mui/icons-material/Send';

import FlexBetween from "../FlexBetween";



const CommentBox = () => {
  const [comment, setComment] = useState('');

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle submission logic here, e.g., send the comment to the server
    console.log(comment);
    setComment('');
  };

  return (
    
    <form  onSubmit={handleSubmit}>
    <FlexBetween >
      <TextField
        label="Write a comment"
        value={comment}
        onChange={handleCommentChange}
        fullWidth
      />
      <IconButton >
        <SendIcon /> 
    </IconButton>
    </FlexBetween>
    </form>
  );
};

export default CommentBox;