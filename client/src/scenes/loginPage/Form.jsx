import { useState,useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import jwt_decode from "jwt-decode";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import toast from 'react-hot-toast';

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Enter your first name"),
  lastName: yup.string().required("Enter your last name"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required").min(8, 'Password must be at least 8 characters long')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'),
  confirmPassword: yup.string().required("required").oneOf([yup.ref('password'), null], 'Passwords must match'),
  location: yup.string().required("enter your location"),
  occupation: yup.string().required("enter your occupation"),
  picture: yup.string().required("upload your picture"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("enter your email"),
  password: yup.string().required("enter your password"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword:"",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [imageError, setImageError] = useState("");
  const [user, setUser] = useState({});
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";




  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log("hdfuiuytff", userObject);

    setUser(userObject);
  }

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        window.google.accounts.id.initialize({
          client_id:
            "585711333789-j332iagr0aio3ebf0rkv0ct6jshjugem.apps.googleusercontent.com",
          callback: handleCallbackResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          {
            theme: "outline",
            size: "large",
            text: "Sign in with Google",
            login_uri: false,
            request_visible_actions: "http://schema.org/AddAction",
            prompt_parent_id: "signInDiv",
            callback: handleCallbackResponse,
          }
        );
      } else {
        setTimeout(initializeGoogleSignIn, 100);
      }
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);



  const googlebutton = async (e) => {
    const googledata = {
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
      picturePath: user.picture,
      location: "India",
      occupation: "Not Specified",
    };
    const response = await fetch("http://localhost:3001/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(googledata),
      })

      const data = await response.json();
    if (response.status === 200) {
      dispatch(
        setLogin({
          user: data.user,
          token: data.token,
        })
      );
      navigate("/home");
    } else {
    }
  };

  if (user) {
    googlebutton();
  }





















  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUserResponse.status === 200) {
      toast.success("OTP has been sent to your email.");
      navigate("/otp", { state: { email: savedUser.email } })
    }else if(savedUserResponse.status === 400){
      toast.error("User already exists, try logging in");
    }else{
      toast.error("Something went wrong");
      
    }
  };

  

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if (loggedInResponse.status=== 200) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }else if(loggedInResponse.status === 404){
      toast.error("User not found , try registering your account");
    }else if(loggedInResponse.status === 400){
      toast.error(loggedIn.msg);
    }else{
      toast.error("Something went wrong");
    }
  };


  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };


  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
    
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
          {isLogin && (<><Typography fontWeight ="bold"  sx={{ gridColumn: "span 4"  }} fontSize ="32px" color="primary"  >Sign in</Typography>
          <Typography fontWeight ="500"  variant="h5" sx={{gridColumn: "span 4"}} >Welcome to Doodle , every doodle tells a story. What's yours?</Typography> </>)}
          
            {isRegister && (
              <>
              <Typography fontWeight ="bold"  sx={{ gridColumn: "span 4"  }} fontSize ="32px" color="primary"  >Sign up</Typography>
   <Typography fontWeight ="500"  variant="h5" sx={{gridColumn: "span 4"}} >Welcome to Doodle , every doodle tells a story. What's yours?</Typography>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) => {
                    const file = acceptedFiles[0];
                    if (file) {
                    const isFileTypeValid = file.type === "image/jpeg" || file.type === "image/png";

                    if (!isFileTypeValid) {
                    setImageError("Please select a JPEG or PNG file.");
                    setFieldValue("picture", "");
                     } else {
                    setFieldValue("picture", file);
                    setImageError(""); 
                      }
                      }
                      }}
                  >
                  
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input acc {...getInputProps()} />
                        {!values.picture ? (
                          <p>Drag 'n' drop your picture here, or click to select</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                  {imageError && (
  <Typography variant="body2" color="error">
    {imageError}
  </Typography>
)}
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />

          {isRegister && (<TextField
              label="Confirm Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.confirmPassword}
              name="confirmPassword"
              error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              sx={{ gridColumn: "span 4" }}
            />
          )}

          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "1rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
    
          
            <div id="signInDiv" style={{ marginLeft: "1px" }}></div>
              
            
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;