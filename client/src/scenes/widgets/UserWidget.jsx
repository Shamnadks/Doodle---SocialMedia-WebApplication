import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfilePicture } from "state";
import toast from 'react-hot-toast';
import axios from "../../utils/axios";
import Dropzone from "react-dropzone";

const UserWidget = ({ userId, picturePath, isHome }) => {
  const currentUser = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedFirstName, setUpdatedFirstName] = useState(currentUser.firstName);
  const [updatedLastName, setUpdatedLastName] = useState(currentUser.lastName);
  const [updatedOccupation, setUpdatedOccupation] = useState(currentUser.occupation);
  const [updatedProfilePicture, setUpdatedProfilePicture] = useState(null);

  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const dispatch = useDispatch()
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    try {
      const response = await axios.get(`/users/${userId}`);
      const data = response.data;
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const handleClick = () => {
    localStorage.removeItem("userId");
    localStorage.setItem("userId", userId);
    navigate(`/profile`);
  };

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    following,
    followers,
  } = user;


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProfilePictureChange = (files) => {
    if (files.length > 0) {
      setUpdatedProfilePicture(files[0]);
    }
  };

  const handleUpdateUserDetails = async () => {
    console.log("handleUpdateUserDetails");
    if (!updatedFirstName || !updatedLastName || !updatedOccupation) {
      toast.error("Please fill all the fields");
      return;
    }
    if (updatedProfilePicture) {
      try {
        const formData = new FormData();
        formData.append("picture", updatedProfilePicture);
        formData.append("userId", userId);
        formData.append("firstName", updatedFirstName);
        formData.append("lastName", updatedLastName);
        formData.append("occupation", updatedOccupation);
        const response = await axios.post("/users/uploadImage/editProfile", formData);
        setUser((prevState) => ({
          ...prevState,
          firstName: updatedFirstName,
          lastName: updatedLastName,
          occupation: updatedOccupation,
        }));
        dispatch(setProfilePicture({ picturePath: response.data }));
        toast.success("Profile updated successfully");
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await axios.patch("/users/editProfile", {
          userId,
          firstName: updatedFirstName,
          lastName: updatedLastName,
          occupation: updatedOccupation,
        });
        setUser((prevState) => ({
          ...prevState,
          firstName: updatedFirstName,
          lastName: updatedLastName,
          occupation: updatedOccupation,
        }));
        toast.success("Profile updated successfully");
  
      } catch (error) {
        console.error(error);
      }
    }
    handleCloseModal();
  };
  

  return (
    <WidgetWrapper
      sx={{
        position: isHome && isNonMobileScreen ? "fixed" : undefined,
        width: isHome && isNonMobileScreen ? "23%" : undefined,
      }}
      p="0.2rem 6%"
    >
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem">
          <UserImage
            image={picturePath}
            width={100}
            height={100}
          />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
              onClick={handleClick}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{following.length} following</Typography>
            <Typography color={medium}>{followers.length} followers</Typography>
          </Box>
        </FlexBetween>
        {isHome && <ManageAccountsOutlined  onClick={handleOpenModal}/> }
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box
          sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 8,
  }}
        >
          <Typography id="edit-modal-title" variant="h6" component="h2" align="center">
            Edit Profile
          </Typography>
          <Box sx={{ mt: 2 }}>
          <Dropzone onDrop={handleProfilePictureChange} multiple={false} accept="image/*">
  {({ getRootProps, getInputProps }) => (
    <div {...getRootProps()} style={{ cursor: "pointer" }}>
      <input {...getInputProps()} />
      <Box
  sx={{
    width: 100,
    height: 100,
    borderRadius: "50%",
    overflow: "hidden",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px dashed",
    borderColor: "primary.main",
  }}
>
  <UserImage
    image={picturePath}
    width={400}
    height={400}
    style={{
      objectFit: "cover",
    }}
  />
</Box>
      <Typography>Drag and drop an image or click here</Typography>
    </div>
  )}
</Dropzone>
            <TextField
              fullWidth
              label="First Name"
              value={updatedFirstName}
              onChange={(e) => setUpdatedFirstName(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={updatedLastName}
              onChange={(e) => setUpdatedLastName(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Occupation"
              value={updatedOccupation}
              onChange={(e) => setUpdatedOccupation(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Button onClick={handleUpdateUserDetails} variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </WidgetWrapper>
  );
};

export default UserWidget;
