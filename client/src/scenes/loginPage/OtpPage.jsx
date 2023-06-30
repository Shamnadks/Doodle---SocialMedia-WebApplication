import { Box, Typography, useMediaQuery, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import backgroundImage from "./background1.jpg";
import toast,{ Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import { useLocation } from 'react-router-dom';








const otpSchema = yup.object().shape({
  otp: yup.string().required("enter otp sent to your email").length(6,"otp must be 6 digits"),
});

const initialValuesOtp = {
  otp: ""
};

const OtpPage = () => {
  const location = useLocation();
   const state = location.state;
   const email = state.email;
    const navigate = useNavigate();
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer]);



  const verifyOTP = async(values, onSubmitProps) => {
    const { otp } = values;
    const response = await fetch("http://localhost:3001/auth/verifyOTP", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({otp,email}),
    });
    onSubmitProps.resetForm();
    const data = await response.json();
    if (response.status === 400) {
        toast.error("Entered OTP is wrong");
    }
    else if (response.status === 201){
        toast.success("User registered successfully");
        navigate("/");
    }else{
        toast.error("Entered OTP is wrong");
    }
    }


    const handleFormSubmit = async (values, onSubmitProps) => {
      verifyOTP(values, onSubmitProps)
    };

  const handleResendOTP = () => {
    // Handle resend OTP logic

    setTimer(60);
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
     
      <Box
        width="100%"
        sx={{
          backgroundColor: "transparent",
          backdropFilter: "blur(5px)",
          position: "fixed",
          zIndex: "1",
        }}
        p="0.2rem 6%"
      >
        <Typography
          fontWeight="bold"
          fontSize="38px"
          color="primary"
          align="center"
          sx={{
            fontFamily: "Dancing Script, cursive",
          }}
        >
          Doodle
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreen ? "30%" : "83%"}
        p="2rem"
        m="12rem auto"
        borderRadius="1.5rem"
        sx={{
          backgroundColor: "transparent",
          backdropFilter: "blur(60px)",
        }}
      >
        <Typography
          fontWeight="bold"
          fontSize="34px"
          color="white"
          align="center"
        >
        OTP
        </Typography>
        <Typography fontWeight="bold" fontSize="14px" color="white" align="center">
          Enter the OTP sent to your email
        </Typography>
        <Typography fontWeight="bold" fontSize="14px" color="red" align="center">
          {email}
        </Typography>

        <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesOtp}
      validationSchema={otpSchema}
    > 

    {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="center" mt={4}>
            <TextField
              label="OTP"
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.otp}
              error={Boolean(touched.otp) && Boolean(errors.otp)}
              helperText={touched.otp && errors.otp}
              name="otp"
              type="text"
              // Add necessary props and styling as needed
            />
          </Box>

          <Box display="flex" justifyContent="center" mt={4}>
            <Button variant="contained" color="primary" type="submit">
              Verify OTP
            </Button>
          </Box>

        </form>
        )}
        </Formik>

        {timer === 0 ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button color="primary" onClick={handleResendOTP}>
              Resend OTP
            </Button>
          </Box>
        ) : (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            mt={2}
          >
            Resend OTP in {timer} seconds
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default OtpPage;

