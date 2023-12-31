import {BrowserRouter ,Navigate ,Routes ,Route} from 'react-router-dom';
import HomePage from 'scenes/homePage';
import AdminDashboard from 'scenes/adminDashboard';
import ReportsPage from 'scenes/reportsPage';
import LoginPage from 'scenes/loginPage';
import Messenger from 'scenes/Messenger/Messenger';
import OtpPage from 'scenes/loginPage/OtpPage';
import AdminLoginPage from 'scenes/adminLoginPage';
import ProfilePage from "scenes/profilePage";
import {useSelector} from 'react-redux';
import {useMemo} from 'react';
import { CssBaseline,ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme'; 
import { Toaster } from 'react-hot-toast';
import Error from "scenes/404/index"

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const isAdminAuth = Boolean(useSelector((state) => state.admin));

  return (
    <div className="app">
      <Toaster
        position="top-right"
        reverseOrder={false}
        />
      <BrowserRouter>
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
         <Route path="/" element={isAuth ?<Navigate to="/home" />:<LoginPage/>} /> 
         <Route path="/otp" element={ <OtpPage />} />
         <Route path="/home" element={isAuth ? <HomePage/> : <Navigate to="/" />} />
         <Route path="/admin" element={isAdminAuth?<Navigate to="/adminHome" />:<AdminLoginPage/>} /> 
         <Route path="/AdminHome" element={isAdminAuth?<AdminDashboard/> : <Navigate to="/admin" />} /> 
         <Route path="/profile" element={isAuth ? <ProfilePage /> : <Navigate to="/" />}/>
         <Route path="/chat" element={isAuth ? <Messenger /> : <Navigate to="/" />}/>
         <Route path="/reports" element={isAdminAuth? <ReportsPage /> : <Navigate to="/admin" />}/>
         <Route path="*" element={ <Error />}/>
        </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
