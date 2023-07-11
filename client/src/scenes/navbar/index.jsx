import { useState } from "react";
import { Box ,
IconButton,
InputBase,
Typography,
Select,
MenuItem,
FormControl,
useTheme,
useMediaQuery,
} from "@mui/material";
import { Search,Message,DarkMode,Notifications,Help,Menu,Close, LightMode } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode,setLogout} from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";


const Navbar =()=>{

const [isMobileMenuToggled, SetIsMobileMenuToggled] = useState(false);
const dispatch = useDispatch();
const navigate = useNavigate();
const user = useSelector(state=>state.user);
const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

const theme = useTheme();
const neutralLight = theme.palette.neutral.light;
const dark= theme.palette.neutral.dark;
const background = theme.palette.background.default;
const primaryLight = theme.palette.primary.light;
const alt = theme.palette.background.alt;

const fullName = `${user.firstName} ${user.lastName}`;





    return (<FlexBetween padding="1rem 6%" 
    // backgroundColor={alt}
    width="100%"  sx={{
        backgroundColor:"transparent",
        backdropFilter: "blur(20px)",
        position: "fixed",
        zIndex: "1",
      }}  p="0.2rem 6%" 
     >
<FlexBetween gap="1.75rem">
<Typography 
fontWeight ="bold" 
fontSize ="clamp(1rem , 3rem ,2.25rem)"
color="primary"
onClick={()=>navigate("/home")}
 sx={{
    "&:hover":{
        color:primaryLight,
        cursor:"pointer",
    },
    fontFamily: "Dancing Script, cursive",
 }}>
Doodle
</Typography>
{isNonMobileScreens && (
    <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
    <InputBase placeholder="Search...." />
    <IconButton>
    <Search />
    </IconButton>
    </FlexBetween>
)}
</FlexBetween>

  {/* desktop nav */}
  {isNonMobileScreens ? (<FlexBetween gap="2rem">
  <IconButton onClick={()=>dispatch(setMode())}>
    {theme.palette.mode === "dark" ? (<DarkMode sx={{ fontSize :"25px"}} />):(<LightMode sx={{ color : dark , fontSize :"25px"}} />)}
  </IconButton>
  <IconButton onClick={()=>navigate("/chat")}>
    <Message sx={{ fontSize :"25px"}} />
    </IconButton>
    <Notifications sx={{ fontSize :"25px"}} />
    <Help sx={{ fontSize :"25px"}} />
    <FormControl variant="standard" value={fullName}>
    <Select 
    value={fullName}
    sx={{
        backgroundColor:neutralLight,
        width :"150px",
        borderRadius:"0.25rem",
        padding:"0.25rem 1rem",
        "& .MuiSvgIcon-root":{
            pr:"0.25rem",
            width:"3rem",
        },"& .MuiSelect-select:focus":{
            backgroundColor:"transparent", 
        }
    }}
    input={<InputBase />}
    >
    <MenuItem value={fullName}>
        <Typography>{fullName}</Typography>
    </MenuItem>
    <MenuItem onClick={()=>dispatch(setLogout())}>Logout</MenuItem>
    </Select>
    </FormControl>
  </FlexBetween>):(<IconButton onClick={()=>SetIsMobileMenuToggled(!isMobileMenuToggled)}>
  <Menu />
  </IconButton>)}
    {/* mobile nav */}
    {!isNonMobileScreens && isMobileMenuToggled && (
        <Box position ="fixed" right="0" bottom="0" height="100%" zIndex="10" maxWidth="500px" minWidth="300px" backgroundColor={background}>
        <Box display="flex" justifyContent="flex-end" p="1rem"><IconButton onClick={()=>SetIsMobileMenuToggled(!isMobileMenuToggled)}>
        <Close />
        </IconButton>
        </Box>

{/* menu Items */}
<FlexBetween display ="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="3rem">
  <IconButton onClick={()=>dispatch(setMode())} sx={{ fontSize :"25px"}} >
    {theme.palette.mode === "dark" ? (<DarkMode sx={{ fontSize :"25px"}} />):(<LightMode sx={{ color : dark , fontSize :"25px"}} />)}
  </IconButton>
  <IconButton onClick={()=>navigate("/chat")} sx={{ fontSize :"25px"}} >
    <Message sx={{ fontSize :"25px"}}  />
    </IconButton>
    <Notifications sx={{ fontSize :"25px"}} />
    <Help sx={{ fontSize :"25px"}} />
    <FormControl variant="standard" value={fullName}>
    <Select 
    value={fullName}
    sx={{
        backgroundColor:neutralLight,
        width :"150px",
        borderRadius:"0.25rem",
        padding:"0.25rem 1rem",
        "& .MuiSvgIcon-root":{
            pr:"0.25rem",
            width:"3rem",
        },"& .MuiSelect-select:focus":{
            backgroundColor:"transparent", 
        }
    }}
    input={<InputBase />}
    >
    <MenuItem value={fullName}>
        <Typography>{fullName}</Typography>
    </MenuItem>
    <MenuItem onClick={()=>dispatch(setLogout())}>Logout</MenuItem>
    </Select>
    </FormControl>
  </FlexBetween>
        </Box>
    )}

</FlexBetween>
    )
}

export default Navbar;