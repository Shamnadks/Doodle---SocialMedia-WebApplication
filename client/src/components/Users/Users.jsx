import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import './Users.css';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import toast, { Toaster } from 'react-hot-toast';
function Users() {
  const [users, setUsers] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    getUsersList();
  }, []);

  const deleteUser = async(id) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/users/blockUnblock/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const jsonData = await response.json();
      console.log(jsonData);
      getUsersList();
      toast.success(`${jsonData.firstName} ${jsonData.lastName} is ${jsonData.isblock ? "blocked" : "unblocked"}`);
    } catch (error) {
      console.log("Error block/unblock user:", error);
    }
  };


  const getUsersList = async () => {
    try {
      const response = await fetch("http://localhost:3001/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const jsonData = await response.json();
      setUsers(jsonData);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      initializeDataTable();
    }
  }, [users]);

  const initializeDataTable = () => {
    if (!$.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable({
        paging: true,
        lengthChange: false,
        searching: true,
        info: true,
        pageLength: 8,
      });
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <div className="table">
        <TableContainer>
          <Table ref={tableRef} id="myTable">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((obj, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{obj.firstName} {obj.lastName}</TableCell>
                  <TableCell>{obj.email}</TableCell>
                  <TableCell>
                {obj.isblock?(
                  <Button variant="contained" sx={{backgroundColor:"orangered" , width:"100px"}} onClick={()=>deleteUser(obj._id)}>
                      UnBlock
                    </Button>
                ):(
                  <Button variant="contained" sx={{width:"100px"}} onClick={()=>deleteUser(obj._id)}>
                      Block
                    </Button>
                  )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <Toaster 
               position="top-right"
                reverseOrder={false}
            />
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Users;




