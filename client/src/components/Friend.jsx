import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import {patchFriends} from "../services/userServices";
import axios from "../utils/axios";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const following = useSelector((state) => state.user.following);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = following.find((friend) => friend._id === friendId);



  const patchFriend = async () => {
    const response = await patchFriends(_id, friendId);
    dispatch(setFriends({ following: response }));
    await axios.get(`/conversations/find/${_id}/${friendId}`).then(async (response) => {
      if (response.data == null) {
        await axios.post(`/conversations/`, { senderId: _id, receiverId: friendId })
      }
    })
  };


  const handleClick = () => {
    localStorage.removeItem("userId");
    localStorage.setItem("userId",friendId);
    navigate(`/profile`);
    navigate(0);
  };
 


  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={handleClick}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>

      {_id !== friendId ? (
      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>) :null}
    </FlexBetween>
  );
};


export default Friend;
