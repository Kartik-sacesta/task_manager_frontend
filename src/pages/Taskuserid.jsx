import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Box,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Snackbar, // Added for global snackbar
  Alert, // Added for global snackbar
} from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";

import useUserTasks from "../hooks/useUserTasks";
import TaskCommentsModal from "../modals/TaskCommentsModal";

export default function Taskuserid() {
  const params = useParams();
  const { id: userId } = params;

  const { tasks, loading, error, taskCounts, fetchUserTasks } =
    useUserTasks(userId);
  const [openAnalyticsModal, setOpenAnalyticsModal] = useState(false);
  const [openCommentsModal, setOpenCommentsModal] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleMenuClick = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskForMenu(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskForMenu(null);
  };

  const handleOpenAnalyticsModal = () => {
    handleMenuClose();
    setOpenAnalyticsModal(true);
  };

  const handleCloseAnalyticsModal = () => {
    setOpenAnalyticsModal(false);
  };

  const handleOpenCommentsModal = () => {
    handleMenuClose();
    if (selectedTaskForMenu) {
      setOpenCommentsModal(true);
    } else {
      showSnackbar("No task selected for comments.", "error");
    }
  };

  const handleCloseCommentsModal = () => {
    setOpenCommentsModal(false);
    setSelectedTaskForMenu(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "title",
      headerName: "Title",
      width: 180,
      editable: false,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      editable: false,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      editable: false,
      renderCell: (params) => {
        let color = "default";
        if (params.value === "completed") {
          color = "success";
        } else if (params.value === "in-progress") {
          color = "info";
        } else if (params.value === "pending") {
          color = "warning";
        }
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      editable: false,
    },
    // {
    //   field: "expiredDate",
    //   headerName: "Deadline",
    //   width: 160,
    //   editable: false,
    //   valueFormatter: (params) => {
    //     if (params.value) {
    //       try {
    //         return new Date(params.value).toLocaleDateString("en-GB");
    //       } catch (e) {
    //         console.error("Error formatting date:", params.value, e);
    //         return "Invalid Date";
    //       }
    //     }
    //     return "N/A";
    //   },
    // },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="more"
            aria-controls={openMenu ? "task-row-menu" : undefined}
            aria-expanded={openMenu ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleMenuClick(event, params.row)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading tasks...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          color: "error.main",
          padding: 4,
          textAlign: "center",
          mt: 4,
        }}
      >
        <Typography variant="h5" component="h3" gutterBottom>
          Error Loading Tasks
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchUserTasks}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" component="h2">
          Tasks for User: {userId}
        </Typography>
      </Stack>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={tasks.map((task) => ({ ...task, id: task._id || task.id }))}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          disableRowSelectionOnClick
        />
      </div>

      <Menu
        id="task-row-menu"
        MenuListProps={{
          "aria-labelledby": "more-options-button",
        }}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem onClick={handleOpenAnalyticsModal}>
          <AnalyticsIcon sx={{ mr: 1 }} /> View Overall Analytics
        </MenuItem>
        <MenuItem onClick={handleOpenCommentsModal}>
          <CommentIcon sx={{ mr: 1 }} /> View/Add Comments
        </MenuItem>
      </Menu>

      <Dialog
        open={openAnalyticsModal}
        onClose={handleCloseAnalyticsModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Task Status Overview</Typography>
            <IconButton aria-label="close" onClick={handleCloseAnalyticsModal}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ py: 2 }}>
            <Typography variant="body1">
              <strong>Total Tasks:</strong>{" "}
              <Chip label={taskCounts.total} color="primary" />
            </Typography>
            <Typography variant="body1">
              <strong>Pending:</strong>{" "}
              <Chip label={taskCounts.pending} color="warning" />
            </Typography>
            <Typography variant="body1">
              <strong>In-Progress:</strong>{" "}
              <Chip label={taskCounts.inProgress} color="info" />
            </Typography>
            <Typography variant="body1">
              <strong>Completed:</strong>{" "}
              <Chip label={taskCounts.completed} color="success" />
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAnalyticsModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {selectedTaskForMenu && (
        <TaskCommentsModal
          open={openCommentsModal}
          onClose={handleCloseCommentsModal}
          taskId={selectedTaskForMenu._id || selectedTaskForMenu.id}
          showSnackbar={showSnackbar}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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
