import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useState ,useEffect} from "react";
import axios from "../../utils/axios";
import Swal from "sweetalert2";

const Applications = () => {
  const [status, setStatus] = useState("");
  const [err, setErr] = useState(false);
  const [data, setData] = useState(false);
  const userColumns = [
    { field: "_id", headerName: "ID", width: 200 },
    {
      field: "reason",
      headerName: "Reason",
      width: 130,
    },
    {
      field: "createdAt",
      headerName: "Reported on",
      width: 195,
    },
    {
      field: "desc",
      headerName: "Bio/Desc",
      width: 155,
    },
  ];

  useEffect(() => {
    
    axios.get(`posts/reports/1`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        setErr(err.response.data);
      });
  }, [status]);



  function handleDelete(item, postId, email, type) {
    if (type == "post") 
    {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`posts/${postId}/rejectReport?id=${item}&name=${email}`)
            .then((response) => {
              if (response.data) {
                setStatus(new Date());
              } else {
                setErr("Something went wrong");
              }
            })
            .catch((err) => {
              console.log(err);
              setErr(err.response.data);
            });
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, block",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`users/${postId}/rejectReport?id=${item}&name=${email}`)
            .then((response) => {
              if (response.data) {
                setStatus(new Date());
              } else {
                setErr("Something went wrong");
              }
            })
            .catch((err) => {
              console.log(err);
              setErr(err.response.data);
            });
        }
      });
    }
  }


  function handleReject(item, postId, email, type) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!",
    }).then((result) => {
      if (result.isConfirmed) {
        if (type == "post") {
          axios
            .delete(`posts/${postId}/report?id=${item}&name=${email}`)
            .then((response) => {
              if (response.data) {
                setStatus(new Date());
              } else {
                setErr("Something went wrong");
              }
            })
            .catch((err) => {
              console.log(err);
              setErr(err.response.data);
            });
        } else {
          console.log("not posts", type);
          axios
            .delete(`users/${postId}/report?id=${item}&name=${email}`, {
              withCredentials: true,
            })
            .then((response) => {
              if (response.data) {
                setStatus(new Date());
              } else {
                setErr("Something went wrong");
              }
            })
            .catch((err) => {
              console.log(err);
              setErr(err.response.data);
            });
        }
      }
    });
  }


  
  const actionColumn = [
    {
      field: "image",
      headerName: "Image",
      width: 130,
      renderCell: (params) => {
        console.log(params, "params apps");
        return <img className="image" style={{height:"100px"}} src={params.row.post || "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"} alt="No image" />;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => {
                handleDelete(
                  params.id,
                  params.row.postId,
                  params.row.userId,
                  params.row.type
                );
              }}
            >
              {params.row.type == "post" ? "Delete post" : "Block user"}
            </div>
            <div
              className="deleteButton"
              onClick={() => {
                handleReject(
                  params.id,
                  params.row.postId,
                  params.row.userId,
                  params.row.type
                );
              }}
              style={{ color: "orange" }}
            >
              Reject report
            </div>
          </div>
        );
      },
    },
  ];
  console.log(err);
  return (
    <div className="datatable">
      <div className="datatableTitle">Reports</div>
      {data && (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={userColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id}
          rowHeight={75}
        />
      )}
    </div>
  );
};

export default Applications;
