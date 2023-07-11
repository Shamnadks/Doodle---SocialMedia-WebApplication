import React from 'react'
import { Box } from '@mui/system'
import AdminNavbar from 'scenes/navbar/adminNavbar';
import Applications from 'components/reports/Datatable';
import "./list.scss";


const ReportsPage =()=>{
    return (
        <div className="list">
        <div className="listContainer">
        <Box>
            
            <AdminNavbar />
            <div style={{justifyItems:"center"}}>
            <div style={{ justifyItems:"center" ,margin:"0 70px"}}>
            <Applications />
            </div>
            </div>
            </Box>
            </div>
            </div>
    )
}

export default ReportsPage;