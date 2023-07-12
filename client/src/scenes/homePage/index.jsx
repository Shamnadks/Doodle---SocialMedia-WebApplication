import Navbar from "scenes/navbar";
import { Box, useMediaQuery } from "@mui/material";
import UserWidget from "scenes/widgets/UserWidget";
import { useSelector } from "react-redux";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const HomePage =()=>{
    const isNonMobileScreen =useMediaQuery('(min-width:1000px)');
    const { _id , picturePath } = useSelector(state => state.user);

    return ( 
    <Box  sx={{
        backgroundImage: `url(https://res.cloudinary.com/dwpsyo2te/image/upload/v1689144066/SOCIAL-MEDIA/nukwpjw7hkch6qqj1i9w.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}>
    <Navbar />
        <Box
        width ="100%"
        padding ="5rem 6%"
        display={isNonMobileScreen?"flex":"block"}
        gap="0.5rem"
        justifyContent="space-between">
            <Box flexBasis={isNonMobileScreen?"26%": undefined}>
                <UserWidget userId={_id} picturePath={picturePath}  isHome/>
            </Box>
            <Box flexBasis={isNonMobileScreen?"42%": undefined} mt={isNonMobileScreen? undefined :"2rem"}>
            <MyPostWidget picturePath={picturePath} />
            <PostsWidget userId={_id} />
            </Box>
            {isNonMobileScreen && (
                <Box flexBasis="26%" sx={{}}>
                <Box >
                <FriendListWidget userId={_id}  isHome/>
                </Box>
                </Box>
            )}
        </Box>
    </Box>)
}

export default HomePage;