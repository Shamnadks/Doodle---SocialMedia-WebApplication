import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Report,
} from "@mui/icons-material";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Box, Divider, IconButton, Typography, useTheme  } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import Swal from 'sweetalert2';
import "./PostWidget.css"


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;


 
const deletePost = async (postId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#00cccc',
    cancelButtonColor: '#ff0000',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    customClass: {
      container: 'swal-container',
      popup: 'swal-popup swal-small swal-dark',
      content: 'swal-content',
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button'
    },
    dark: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (response.status === 200) {
        toast.success("Post deleted successfully");
        dispatch(setPost({ post: data }));
      } else {
        toast.error("Something went wrong");
      }
    }
  });
};


  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
//   const commentTimeAgoList = comments.map((comment) =>
//   formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
// );

  return (
    <WidgetWrapper m="2rem 0">
    
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      
      <FlexBetween gap="1rem">
    <Box></Box>
    <Typography variant="caption" color={main} sx={{ alignSelf: "flex-end"}}>
        {timeAgo}
      </Typography> 
      </FlexBetween>
      
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

              <FlexBetween> 
        <IconButton>
          <ShareOutlined />
        </IconButton>

      {loggedInUserId !== postUserId ?
        (<IconButton >
        <Report /> 
    </IconButton>) : (<IconButton  onClick={()=>deletePost(postId)}>
    <DeleteForeverRoundedIcon /> 
    </IconButton>)}

    
        </FlexBetween> 
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <FlexBetween gap="0.5rem" mt="0.5rem">
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
              <Typography variant="caption" color={main} sx={{ pl: "1rem" }}>
                {/* {commentTimeAgoList[i]}  */}
                </Typography>
              </FlexBetween>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;