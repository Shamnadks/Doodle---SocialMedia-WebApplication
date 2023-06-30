
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdminLogin } from "state";
import toast,{Toaster} from 'react-hot-toast';




const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("enter your email"),
  password: yup.string().required("enter your password"),
});


const initialValuesLogin = {
  email: "",
  password: "",
};

const LoginAdmin = () => {
 
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");


  

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedInResponse.status===200) {
      dispatch(
        setAdminLogin({
          admin: loggedIn.admin,
          adminToken: loggedIn.token,
        })
      );
      navigate("/adminHome");
    }if (loggedInResponse.status===400) {
      toast.error(loggedIn.msg);

  }if (loggedInResponse.status===404) {
      toast.error(loggedIn.msg);
  }
};

  const handleFormSubmit = async (values, onSubmitProps) => {
     await login(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues= {initialValuesLogin}
      validationSchema={loginSchema} 
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
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
    

            <TextField
              label="Admin Email"
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
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: "red",
                color: palette.background.alt,
                "&:hover": { color: "green" },
              }}
            >
              LOGIN
            </Button>
            <Toaster />
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoginAdmin;