import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { Button } from "@mui/material";
import { getFriendsList } from "../../services/userServices";
import { makeStyles } from "@mui/styles";





const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: "20px",
    padding: theme.spacing(1, 2),
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  dimmedButton: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[600],
    borderRadius: "20px",
    padding: theme.spacing(1, 2),
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: theme.palette.grey[300],
    },
  },
}));


const FriendListWidget = ({ userId ,isHome}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const friends = useSelector((state) => state.user.following);
  const followers = useSelector((state) => state.user.followers);
  const classes = useStyles();
  const [isFollowing, setIsFollowing] = useState(false);



  const getFriends = async () => {
    try {
      const response = await getFriendsList(userId);
      dispatch(setFriends({ following: response}));
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = () => {
    setIsFollowing((prevFollowing) => !prevFollowing);
  };


  useEffect(() => {
    getFriends();
  }, []);

  return (
    
    <WidgetWrapper  
    sx={{
      backgroundColor:isHome ?"transparent":undefined,
      backdropFilter: "blur(80px)",
      position: isHome ? "fixed": undefined,
      
    }}  p="0.2rem 6%">
  

  <Button
      className={isFollowing ? classes.dimmedButton : classes.button}
      variant="elevated"
      onClick={handleButtonClick}
    >
      <Typography color="inherit" variant="h5" fontWeight="500">
        {isFollowing ? "Followers" : "Following"}
      </Typography>
    </Button>




      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;