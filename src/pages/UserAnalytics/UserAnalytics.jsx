import "./userAnalytics.css";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UserAnalytics() {

    const currentTheme = useSelector((state) => state.theme.currentTheme);
  
    const users = useSelector((state) => state.data.transactions);
    const [isLoading, setIsLoading] = useState(true);
  
  
    useEffect(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, []);
  
    const columns = [
      { field: "id", headerName: "ID", width: 150 },
      {
        field: "name",
        headerName: "UserName",
        width: 200,
        renderCell: (params) => {
          return (
            <div className="userListUser">
              {params.row.name}
            </div>
          );
        },
      },
      { field: "income", headerName: "Income", width: 170 },
      {
        field: "action",
        headerName: "Action",
        width: 170,
        renderCell: (params) => {
          return (
            <>
              <Link to={"/user/" + params.row.id}>
                <button className="userListEdit">See Details</button>
              </Link>
              {/* <DeleteOutline
                className="userListDelete"
                onClick={() => handleDelete(params.row._id)}
              /> */}
            </>
          );
        },
      },
    ];

  return (
    <div className={`userList ${currentTheme === "dark" ? "dark-mode" : ""}`}>
      {isLoading ? (
       <div className="loading">
       <div className="spinner">
         <div></div>
         <div></div>
         <div></div>
         <div></div>
         <div></div>
         <div></div>
       </div>
     </div>
      ) : (
        <DataGrid
          rows={users}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
        />
      )}
    </div>
  )
}
