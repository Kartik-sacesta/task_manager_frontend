import React, { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog, // Keep Dialog for TaskCommentsModal if it's not a separate component
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
  Snackbar,
  Alert,
  Grid,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Analytics as AnalyticsIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Comment as CommentIcon,
  Refresh as RefreshIcon,
  CheckCircleOutline as CheckCircleOutlineIcon, // For Completed
  HourglassEmpty as HourglassEmptyIcon, // For Pending
  PlayCircleOutline as PlayCircleOutlineIcon, // For In-Progress
  WarningAmber as WarningAmberIcon, // For Urgent/Due Soon
  ErrorOutline as ErrorOutlineIcon, // For High/Overdue
  LowPriority as LowPriorityIcon, // For Low Priority
  PriorityHigh as PriorityHighIcon, // For Medium Priority
  TaskAlt as TaskAltIcon, // For Total Active Tasks
} from "@mui/icons-material";

import useUserTasks from "../hooks/useUserTasks";
import TaskCommentsModal from "../modals/TaskCommentsModal";

const PAGINATION_OPTIONS = [5, 10, 20, 50];
const INITIAL_PAGE_SIZE = 10;
const SNACKBAR_DURATION = 6000;

const STATUS_COLORS = {
  completed: "success",
  "in-progress": "info",
  pending: "warning",
  default: "default",
};
const PRIORITY_COLORS = {
  High: "error",
  Medium: "primary",
  Low: "default",
  Urgent: "secondary",
};

const StatusChip = React.memo(({ status }) => (
  <Chip
    label={status}
    color={STATUS_COLORS[status] || STATUS_COLORS.default}
    size="small"
    variant="outlined"
  />
));

const PriorityChip = React.memo(({ priority }) => (
  <Chip
    label={priority}
    color={PRIORITY_COLORS[priority] || PRIORITY_COLORS.Low}
    size="small"
  />
));

const ActionsCell = React.memo(({ task, onMenuClick }) => (
  <Tooltip title="More options">
    <IconButton
      aria-label={`More options for task ${task.title}`}
      onClick={(event) => onMenuClick(event, task)}
      size="small"
    >
      <MoreVertIcon />
    </IconButton>
  </Tooltip>
));

// Helper component for displaying individual analytics metrics
const AnalyticsMetric = ({ label, value, color, icon: IconComponent }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{
      p: 1.5,
      borderRadius: 1,
      backgroundColor: (theme) =>
        theme.palette[color]
          ? theme.palette[color].light + "1A"
          : "rgba(0,0,0,0.05)", // Light background tint
      borderLeft: `4px solid ${color === "default"}`, // Colored left border
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1}>
      {IconComponent && (
        <IconComponent
          sx={{
            color: (theme) =>
              theme.palette[color] ? theme.palette[color].main : "#000",
          }}
        />
      )}
      <Typography
        variant="body1"
        sx={{ fontWeight: "medium", color: "text.secondary" }}
      >
        {label}
      </Typography>
    </Stack>
    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        color: (theme) =>
          theme.palette[color] ? theme.palette[color].dark : "#000",
      }}
    >
      {value !== undefined && value !== null ? value : "-"}
    </Typography>
  </Stack>
);

// New component for the analytics dialog, extracted for reusability and cleaner code
function TaskAnalyticsDialog({
  openAnalyticsModal,
  handleCloseAnalyticsModal,
  analyticsLoading,
  analyticsError,
  fetchTaskAnalytics,
  taskAnalytics,
}) {
  return (
    <Dialog
      open={openAnalyticsModal}
      onClose={handleCloseAnalyticsModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3, // More rounded corners
          boxShadow: 8, // Stronger shadow
          minHeight: "400px",
          overflowY: "hidden", // Prevent scrollbar on Paper itself
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, borderBottom: "1px solid #eee" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Task Analytics Overview
          </Typography>
          <IconButton
            aria-label="close analytics modal"
            onClick={handleCloseAnalyticsModal}
            sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {" "}
        {/* Increased padding */}
        {analyticsLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 250, // Adjusted min height for better centering
              gap: 2,
              color: "primary.main",
            }}
          >
            <CircularProgress size={50} />
            <Typography variant="h6">Loading analytics data...</Typography>
          </Box>
        ) : analyticsError ? (
          <Box sx={{ textAlign: "center", p: 4 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Failed to load analytics!
            </Typography>
            <Typography variant="body1" color="error.main" sx={{ mb: 2 }}>
              {analyticsError.message || "An unknown error occurred."}
            </Typography>
            <Button
              onClick={fetchTaskAnalytics}
              variant="contained"
              color="error"
            >
              Retry Analytics
            </Button>
          </Box>
        ) : taskAnalytics ? (
          <Grid container spacing={3}>
            {/* Status Summary */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{ p: 2.5, borderRadius: 2, border: "1px solid #e0e0e0" }}
              >
                {" "}
                {/* Enhanced Paper style */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  Status Summary
                </Typography>
                <Stack spacing={1.5}>
                  {" "}
                  {/* Increased spacing */}
                  <AnalyticsMetric
                    label="Pending"
                    value={taskAnalytics.statusSummary?.pending}
                    color="warning"
                    icon={HourglassEmptyIcon}
                  />
                  <AnalyticsMetric
                    label="In-Progress"
                    value={taskAnalytics.statusSummary?.["in-progress"]}
                    color="info"
                    icon={PlayCircleOutlineIcon}
                  />
                  <AnalyticsMetric
                    label="Completed"
                    value={taskAnalytics.statusSummary?.completed}
                    color="success"
                    icon={CheckCircleOutlineIcon}
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Priority Summary */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{ p: 2.5, borderRadius: 2, border: "1px solid #e0e0e0" }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  Priority Summary
                </Typography>
                <Stack spacing={1.5}>
                  <AnalyticsMetric
                    label="Urgent"
                    value={taskAnalytics.prioritySummary?.Urgent}
                    color="error" // Changed to error for high urgency
                    icon={WarningAmberIcon}
                  />
                  <AnalyticsMetric
                    label="High"
                    value={taskAnalytics.prioritySummary?.High}
                    color="secondary" // Changed to secondary
                    icon={ErrorOutlineIcon}
                  />
                  <AnalyticsMetric
                    label="Medium"
                    value={taskAnalytics.prioritySummary?.Medium}
                    color="primary"
                    icon={PriorityHighIcon}
                  />
                  <AnalyticsMetric
                    label="Low"
                    value={taskAnalytics.prioritySummary?.Low}
                    color="info" // Using info for low priority
                    icon={LowPriorityIcon}
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Overall Metrics */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{ p: 2.5, borderRadius: 2, border: "1px solid #e0e0e0" }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  Overall Metrics
                </Typography>
                <Stack spacing={1.5}>
                  <AnalyticsMetric
                    label="Total Active"
                    value={taskAnalytics.totalActiveTasks}
                    color="success"
                    icon={TaskAltIcon}
                  />
                  <AnalyticsMetric
                    label="Overdue"
                    value={taskAnalytics.overdueTasksCount}
                    color="error"
                    icon={ErrorOutlineIcon}
                  />
                  <AnalyticsMetric
                    label="Due Soon"
                    value={taskAnalytics.tasksDueSoonCount}
                    color="warning"
                    icon={WarningAmberIcon}
                  />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              p: 4,
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No analytics data available.
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Please ensure tasks are created and data is available.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <Button
          onClick={handleCloseAnalyticsModal}
          variant="contained"
          color="primary"
          sx={{ px: 3, py: 1, borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function TaskUserId() {
  const params = useParams();
  const { id: userId } = params;

  const {
    tasks,
    loading,
    error,
    taskAnalytics,
    analyticsLoading,
    analyticsError,
    fetchUserTasks,
    fetchTaskAnalytics,
  } = useUserTasks(userId);

  const [openAnalyticsModal, setOpenAnalyticsModal] = useState(false);
  const [openCommentsModal, setOpenCommentsModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const openMenu = Boolean(anchorEl);

  const processedTasks = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        id: task._id || task.id,
      })),
    [tasks]
  );

  // Callback functions
  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleMenuClick = useCallback((event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskForMenu(task);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedTaskForMenu(null);
  }, []);

  const handleOpenAnalyticsModal = useCallback(() => {
    handleMenuClose();
    fetchTaskAnalytics();
    setOpenAnalyticsModal(true);
  }, [fetchTaskAnalytics, handleMenuClose]);

  const handleCloseAnalyticsModal = useCallback(() => {
    setOpenAnalyticsModal(false);
  }, []);

  const handleOpenCommentsModal = useCallback(() => {
    handleMenuClose();
    if (selectedTaskForMenu) {
      setOpenCommentsModal(true);
    } else {
      showSnackbar("No task selected for comments.", "error");
    }
  }, [selectedTaskForMenu, handleMenuClose, showSnackbar]);

  const handleCloseCommentsModal = useCallback(() => {
    setOpenCommentsModal(false);
    setSelectedTaskForMenu(null);
  }, []);

  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 90,
        sortable: false,
      },
      {
        field: "title",
        headerName: "Title",
        width: 200,
        editable: false,
        renderCell: (params) => (
          <Tooltip title={params.value} placement="top">
            <Typography variant="body2" noWrap>
              {params.value}
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        editable: false,
        minWidth: 250,
        renderCell: (params) => (
          <Tooltip title={params.value} placement="top">
            <Typography variant="body2" noWrap>
              {params.value}
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        editable: false,
        renderCell: (params) => <StatusChip status={params.value} />,
      },
      {
        field: "priority",
        headerName: "Priority",
        width: 110,
        editable: false,
        renderCell: (params) => <PriorityChip priority={params.value} />,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        width: 100,
        renderCell: (params) => (
          <ActionsCell task={params.row} onMenuClick={handleMenuClick} />
        ),
      },
    ],
    [handleMenuClick]
  );

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading tasks...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 4,
          textAlign: "center",
          mt: 4,
          backgroundColor: "error.light",
          color: "error.contrastText",
        }}
      >
        <Typography variant="h5" component="h3" gutterBottom>
          Error Loading Tasks
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={fetchUserTasks} color="primary">
            Retry
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" component="h1">
            Tasks for User: {userId}
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={1} sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={processedTasks}
          columns={columns}
          pageSizeOptions={PAGINATION_OPTIONS}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: INITIAL_PAGE_SIZE,
              },
            },
          }}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
          loading={loading}
          localeText={{
            noRowsLabel: "No tasks found for this user",
          }}
        />
      </Paper>

      <Menu
        id="task-row-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleOpenAnalyticsModal}>
          <AnalyticsIcon sx={{ mr: 1 }} />
          View Analytics
        </MenuItem>
        <MenuItem onClick={handleOpenCommentsModal}>
          <CommentIcon sx={{ mr: 1 }} />
          View/Add Comments
        </MenuItem>
      </Menu>

      {/* Task Analytics Dialog (now using the extracted component) */}
      <TaskAnalyticsDialog
        openAnalyticsModal={openAnalyticsModal}
        handleCloseAnalyticsModal={handleCloseAnalyticsModal}
        analyticsLoading={analyticsLoading}
        analyticsError={analyticsError}
        fetchTaskAnalytics={fetchTaskAnalytics}
        taskAnalytics={taskAnalytics}
      />

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
        autoHideDuration={SNACKBAR_DURATION}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
