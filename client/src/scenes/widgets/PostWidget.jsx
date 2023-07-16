import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Report,
} from "@mui/icons-material";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Box, Divider, IconButton, Typography, useTheme,List,ListItem  } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import Modal from 'react-modal'
import WidgetWrapper from "components/WidgetWrapper";
import React,{ useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { formatDistanceToNow } from "date-fns";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-hot-toast";
import Swal from 'sweetalert2';
import "./PostWidget.css";
import axios from "../../utils/axios";
import CommentBox from "../../components/comments/Comments";
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';




const customStyles = {
  overlay: {
    backgroundColor: 'transparent',
    zIndex: '1000',
  },

  content: {
    color: 'black',
    borderRadius: '10px',
    backgroundColor:'transparent',
    backdropFilter: 'blur(90px)',
    border: 'solid 1px #ccc',
    width: '20%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root')


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
  onCommentAdded,
  onPostDeleted,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector(state=>state.user);
  const [desc, setDesc] = useState('');
  const [report, setReport] = useState('other')
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const [err, setErr] = useState(null)
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true)
  }


  function afterOpenModal() {
    subtitle.style.color = 'black';
  }

  function closeModal() {
    setIsOpen(false)
  }

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;


  const handleDeleteComment = (commentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete you commented!",
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
        cancelButton: 'swal-cancel-button',
      },
      dark: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/posts/${postId}/comments/${commentId}`);
          const data = response.data;
          if (response.status === 200) {
            toast.success('Comment deleted successfully');
            dispatch(setPost({ post: data }));
          } else {
            toast.error('Something went wrong');
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    );
  };

   
  

  const handleReport = () => {
    if (report === "other" && desc.trim().length !== 0 && desc != null) {
      axios.put(`posts/${postId}/report/${user._id}`, { reason: desc }).then((res) => {
        Swal.fire({
          title: 'Reported!',
          text: 'Thanks for reporting',
          icon: 'success',
          confirmButtonText: 'Continue'
        })
        closeModal()
        setDesc("")
        setMenuOpen(false)
        setErr(null)
      }).catch((err) => {
        console.log(err)
        setErr(err.response.data)
      })
    } else if (report !== "other") {
      axios.put(`posts/${postId}/report/${user._id}`, { reason: report }).then((res) => {
        Swal.fire({
          title: 'Reported!',
          text: 'Thanks for reporting',
          icon: 'success',
          confirmButtonText: 'ok'
        })
        closeModal()
        setDesc("")
        setMenuOpen(false)
        setErr(false)

      }).catch((err) => {
        setErr(err.response.data)
      })

    }
    else {
      toast("Please specify reason")
    }
  }









  const deletePost = async (postId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
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
        cancelButton: 'swal-cancel-button',
      },
      dark: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/posts/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;
          if (response.status === 200) {
            onPostDeleted(postId);
            toast.success('Post deleted successfully');
            dispatch(setPost({ post: data }));
          } else {
            toast.error('Something went wrong');
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };



const patchLike = async () => {
  try {
    const response = await axios.patch(`/posts/${postId}/like`, {
      userId: loggedInUserId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const updatedPost = response.data;
    dispatch(setPost({ post: updatedPost }));
  } catch (error) {
    console.error(error);
  }
};


  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const commentTimeAgoList = comments.map((comment) =>
  formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
);

  return (
    <WidgetWrapper m="2rem 0"  sx={{
      backgroundColor:"transparent",
      backdropFilter: "blur(80px)",
    }} >
    
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
          src={`${picturePath}`}
        />
      )}


      <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Report Post</h2>
      <CloseIcon onClick={closeModal} className="close" />
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Please specify reason</FormLabel>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="other" name="radio-buttons-group">
          <FormControlLabel value="spam" control={<Radio />} label="Spam" onChange={e => { setReport(e.target.value) }} />
          <FormControlLabel value="fraud" control={<Radio />} label="Fraud" onChange={e => setReport(e.target.value)} />
          <FormControlLabel value="false information" control={<Radio />} label="False information" onClick={e => setReport(e.target.value)} />
          <FormControlLabel value="other" control={<Radio />} label="Other" onClick={e => setReport(e.target.value)} />
        </RadioGroup>
        {report === "other" && <TextField id="standard-basic" label="please say more about it" variant="standard" onChange={e => setDesc(e.target.value)} />}
        {err && <span style={{ top: "2rem", color: "red" }} className="err">{err}</span>}
        <Button variant="contained" endIcon={<SendIcon />} className="sendButton" onClick={handleReport}>Send</Button>
      </FormControl>
    </Modal>






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
        (<IconButton onClick={openModal} >
        <Report /> 
    </IconButton>) : (<IconButton  onClick={()=>deletePost(postId)}>
    <DeleteForeverRoundedIcon /> 
    </IconButton>)}

    
        </FlexBetween> 
      </FlexBetween>

          <CommentBox postId={postId} onCommentAdded={onCommentAdded}/>

          {isComments && (
      <Box mt="0.5rem" maxHeight="200px" sx={{ overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
        <List sx={{ width: '100%' }}>
          {comments.map((comment, i) => (
            <React.Fragment key={i}>
              <ListItem disablePadding>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ borderRadius: '50%', overflow: 'hidden', marginRight: '0.5rem' }}>
                    <img src={comment.userPicturePath} alt="User Profile" width="35px" height="35px" style={{ borderRadius: '50%' , marginTop:"10px" }} />
                  </Box>
                  <Box sx={{ flex: '1' }}>
                    <Typography variant="subtitle2">{comment.firstName} {comment.lastName}</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{comment.text}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary" sx={{ marginRight: '0.5rem' }}>
                      {commentTimeAgoList[i]}
                    </Typography>
                    {comment.userId === loggedInUserId && (
                      <IconButton size="small" onClick={() => handleDeleteComment(comment._id)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </ListItem>
              {i !== comments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    )}
  
    </WidgetWrapper>
  );
};

export default PostWidget;