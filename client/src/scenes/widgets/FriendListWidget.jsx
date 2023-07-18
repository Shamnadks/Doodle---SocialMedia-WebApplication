import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect,useState} from "react";
import { Button } from "@mui/material";
import { getFriendsList , getFollowersList } from "../../services/userServices";


const FriendListWidget = ({ userId ,isHome}) => {
  const [friends,setFriends]=useState([])
  const[followers,setFollowers]=useState([])
  const { palette } = useTheme();
  const [isFollowing, setIsFollowing] = useState(true); 



  const getFriends = async () => {
    try {
      const response = await getFriendsList(userId);
      setFriends(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getFollowers = async () => {
    try {
      const response = await getFollowersList(userId);
      setFollowers(response);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  


  useEffect(() => {
    getFollowers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const handleFollowers = () => {
    setIsFollowing(!isFollowing);
      getFollowers();
  };
  
  const handleFollowing = () => {
    setIsFollowing(!isFollowing);
      getFriends(); 
  };
  

  return (
    
    <WidgetWrapper  
    sx={{
      backgroundColor:isHome ?"transparent":undefined,
      backdropFilter: "blur(80px)",
      position: isHome ? "fixed": undefined,
      
    }}  p="0.2rem 6%">
  

  <Box display="flex" gap="1rem" alignItems="center">
  <Button
    variant={!isFollowing ? "contained" : "outlined"}
    sx={{
      borderRadius: "0.8rem",
      marginBottom: "0.5rem",
      backgroundColor: "transparent",
    }}
    onClick={() => handleFollowing()}
  >
    <Typography
      color={palette.neutral.dark}
      variant="h5"
      fontWeight="500"
    >
      Following
    </Typography>
  </Button>
  <Button
    variant={isFollowing ? "contained" : "outlined"}
    sx={{
      borderRadius: "0.8rem",
      marginBottom: "0.5rem",
      backgroundColor: "transparent",
    }}
    onClick={() => handleFollowers()}
  >
    <Typography
      color={palette.neutral.dark}
      variant="h5"
      fontWeight="500"
    >
      Followers
    </Typography>
  </Button>
</Box>



<Box
    display="flex"
    flexDirection="column"
    gap="1.5rem"
    maxHeight="400px"
    sx={{  
    overflowY:"scroll",
          "&::-webkit-scrollbar": {
            width: "0.25rem",
          }, }}
  >
    {isFollowing ? (
      friends.map((friend) => (
        <Friend
          key={friend._id}
          friendId={friend._id}
          name={`${friend.firstName} ${friend.lastName}`}
          subtitle={friend.occupation}
          userPicturePath={friend.picturePath}
        />
      ))
    ) : (
      followers.map((friend) => (
        <Friend
          key={friend._id}
          friendId={friend._id}
          name={`${friend.firstName} ${friend.lastName}`}
          subtitle={friend.occupation}
          userPicturePath={friend.picturePath}
        />
      ))
    )}
  </Box>

    </WidgetWrapper>
  );
};

export default FriendListWidget;