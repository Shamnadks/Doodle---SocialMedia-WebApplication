import React from 'react'
import { Box } from '@mui/system'
import AdminNavbar from 'scenes/navbar/adminNavbar'
import Users from 'components/Users/Users'


const AdminDashboard =()=>{
    return (
        <Box>
            
            <AdminNavbar />

             <Users /> 

            </Box>
    )
}

export default AdminDashboard;