import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

export default function Taskuserid() {
  const params = useParams();

  const [usertask, setusertask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "title",
      headerName: "Title",
      width: 150,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      type: "number",
      width: 110,
      editable: true,
    },
  ];

  const fetchdata = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authtoken");

      const res = await axios.get(
        `http://localhost:5000/user/task/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", res);
      setusertask(res.data.task);
    } catch (e) {
      console.error("API Error:", e);

      if (e.response?.status === 403) {
        setError(
          "Access forbidden. You may not have permission to view these tasks or your session has expired."
        );
      } else if (e.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        setError(`Error fetching tasks: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("task by user id ");
    fetchdata();
  }, [params.id]);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return (
      <div style={{ color: "red", padding: "20px" }}>
        <h3>Error:</h3>
        <p>{error}</p>
        <button onClick={fetchdata}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <h2>Tasks for User {params.id}</h2>
      <DataGrid
        rows={usertask}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </>
  );
}
