import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "../../utils/axios";
import FlexBetween from 'components/FlexBetween';

const CommentBox = ({ postId,onCommentAdded }) => {
  const { _id } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!comment) return;

    try {
      const response = await axios.post(`/posts/${postId}/comments/${_id}`, { comment });
      console.log(response.data);
      setComment('');
      onCommentAdded();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <FlexBetween>
      <TextField
        label="Write a comment"
        value={comment}
        onChange={handleCommentChange}
        fullWidth
      />
      <IconButton type="submit">
        <SendIcon />
      </IconButton>
      </FlexBetween>
    </form>
  );
};

export default CommentBox;
