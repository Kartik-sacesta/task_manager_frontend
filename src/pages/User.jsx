import React from "react";
import { Box, Paper, Typography, Button, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserModal from "../modals/UserModal";
import ActionMenu from "../components/ActionMenu";
import { useUserData } from "../hooks/useUserdata";

export default function UserTable() {
  const navigate = useNavigate();
  const {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser,
    fetchUsers,
    createLoading,
    snackbar,
    handleCloseSnackbar,
  } = useUserData();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [editUserId, setEditUserId] = React.useState(null);
  const [editUserData, setEditUserData] = React.useState(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const pageSizeOptions = [5, 10, 25, 50, 100];

  React.useEffect(() => {
    fetchUsers(page + 1, rowsPerPage);
  }, [page, rowsPerPage, fetchUsers]);

  const handleCreateUser = () => {
    setEditMode(false);
    setEditUserId(null);
    setEditUserData(null);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setEditUserData(user);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditUserId(null);
    setEditUserData(null);
  };

  const handleModalSubmit = async (userData) => {
    if (editMode) {
      await updateUser(editUserId, userData);
    } else {
      await createUser(userData);
    }
    fetchUsers(page + 1, rowsPerPage);
    handleModalClose();
  };

  const handleUserClick = (params) => {
    navigate(`/user/${params.id}`);
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          sx={{
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => handleUserClick(params)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" color="textSecondary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <ActionMenu
          user={params.row}
          onEdit={() => handleEditUser(params.row)}
          onDelete={() => deleteUser(params.row.id)}
        />
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Paper sx={{ width: "100%", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" component="div">
            Users
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
            sx={{ textTransform: "none" }}
          >
            Create User
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="body2" sx={{ mr: 1 }}>
            Rows per page:
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {pageSizeOptions.map((option) => (
              <Typography
                key={option}
                variant="body2"
                sx={{
                  border: "1px solid",
                  borderColor:
                    rowsPerPage === option ? "primary.main" : "transperent",
                  borderRadius: 1,
                  p: "4px 8px",
                  cursor: "pointer",
                  backgroundColor:
                    rowsPerPage === option ? "primary.light" : "transparent",
                  color:
                    rowsPerPage === option
                      ? "primary.contrastText"
                      : "text.primary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={() => {
                  setRowsPerPage(option);
                  setPage(0);
                }}
              >
                {option}
              </Typography>
            ))}
          </Box>
        </Box>

        <Box sx={{ height: "50%" }}>
          <DataGrid
            rows={users}
            columns={columns}
            loading={loading}
            checkboxSelection={false}
            disableRowSelectionOnClick
            onRowClick={handleUserClick}
            rowCount={users.length}
            paginationMode="server"
            paginationModel={{ page, pageSize: rowsPerPage }}
            onPaginationModelChange={(model) => {
              setPage(model.page);
              setRowsPerPage(model.pageSize);
            }}
            pageSizeOptions={pageSizeOptions}
            sx={{
              border: "none",
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                cursor: "pointer",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                borderBottom: "2px solid #e0e0e0",
              },
            }}
            slots={{
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography variant="body1" color="textSecondary">
                    No users found
                  </Typography>
                </Box>
              ),
            }}
          />
        </Box>
      </Paper>

      <UserModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        loading={createLoading}
        editMode={editMode}
        initialData={editUserData}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
