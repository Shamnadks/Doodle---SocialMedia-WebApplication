import { Box ,Typography,useTheme, useMediaQuery } from "@mui/material";
import FormAdmin from "./FormAdmin";




const AdminLoginPage =()=>{
    const theme = useTheme();
    const isNonMobileScreen = useMediaQuery("(min-width:1000px)");

    return (<Box  sx={{
        backgroundImage: `url(https://res.cloudinary.com/dwpsyo2te/image/upload/v1689663362/SOCIAL-MEDIA/nxxq8qimsfajz5awrx5h.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }} height="100%">

    <Box width="100%"  p="1rem 6%" textAlign="center">
   <Typography fontWeight ="bold" fontSize ="38px" color="red"  sx={{
            border: "2px dashed white ",
            borderColor: "white",
            borderRadius: "1.5rem",
            display: "inline-block",
            padding: "0.5rem",
          }}>Doodle Admin</Typography>
   </Box>

   <Box width={isNonMobileScreen ? "50%":"93%"}
   p="2rem"
   m="8rem auto"
   borderRadius="1.5rem"
   backgroundColor={theme.palette.background.alt}
  >
   <Typography fontWeight ="500"  variant="h5" sx={{ mb:"1.5rem"}}>Welcome Admin</Typography>
   <FormAdmin />
   </Box>

    </Box>)
   
}

export default AdminLoginPage;