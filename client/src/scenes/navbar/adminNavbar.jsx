import { useState } from "react";
import { setAdminLogout} from "state";
import { useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import Book from "@mui/icons-material/Book";
import { Search,Menu,Close } from "@mui/icons-material";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FlexBetween from "components/FlexBetween";
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





const AdminNavbar =()=>{

const [isMobileMenuToggled, SetIsMobileMenuToggled] = useState(false);
const dispatch = useDispatch();
const navigate = useNavigate();
const theme = useTheme();
const alt = theme.palette.background.alt;
const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
const fullName = "Admin"




return (

<FlexBetween padding="1rem 6%" backgroundColor={alt} >
<FlexBetween gap="1.75rem">
<Typography 
fontWeight ="bold" 
fontSize ="clamp(1rem , 3rem ,2.25rem)"
color="primary"
onClick={()=>navigate("/AdminHome")}
 sx={{
    "&:hover":{
        color:"black",
        cursor:"pointer",
    },
 }}>
Doodle Admin
</Typography>
{isNonMobileScreens && (
    <FlexBetween backgroundColor="grey" borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
    
    <IconButton>
    <Search />
    </IconButton>

    <IconButton onClick={()=>navigate("/reports")}>
    <Book />
    </IconButton>

    <IconButton onClick={()=>navigate("/AdminHome")}>
    <GroupAddIcon />
    </IconButton>
    </FlexBetween>
)}
</FlexBetween>

{isNonMobileScreens ? (<FlexBetween gap="2rem">
    <FormControl variant="standard" value={fullName}>
    <Select 
    value={fullName}
    sx={{
        backgroundColor:"orangered",
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
    <MenuItem onClick={()=>dispatch(setAdminLogout())}>Logout</MenuItem>
    </Select>
    </FormControl>
  </FlexBetween>):(<IconButton onClick={()=>SetIsMobileMenuToggled(!isMobileMenuToggled)}>
  <Menu color="primary"/>
  </IconButton>)}

   {!isNonMobileScreens && isMobileMenuToggled && (
    <Box position ="fixed" right="0" bottom="0" height="100%" zIndex="10" maxWidth="500px" minWidth="300px" backgroundColor="black">
        <Box display="flex" justifyContent="flex-end" p="1rem"><IconButton onClick={()=>SetIsMobileMenuToggled(!isMobileMenuToggled)}>
        <Close />
        </IconButton>
        </Box>
        <FlexBetween display ="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="3rem">
        <FormControl variant="standard" value={fullName}>
    <Select 
    value={fullName}
    sx={{
        backgroundColor:"orangered",
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
    <MenuItem onClick={()=>dispatch(setAdminLogout())}>Logout</MenuItem>
    </Select>
    </FormControl>
  </FlexBetween>
        </Box>
    )}

    </FlexBetween>
     )
    }

    export default AdminNavbar;