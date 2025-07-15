import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { formatDistanceToNow, parseISO } from "date-fns";

import useNotifications from "./../hooks/useNotifications";
import { Notificationskeleton } from "../skeleton/Notificationskeleton";

export default function NotificationsPage() {
  const { loading, notifications, notificationCounts, error } =
    useNotifications();
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: "error",
      });
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "No deadline";
    try {
      const date = parseISO(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const renderTaskList = (tasks, title) => (
    <React.Fragment>
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{ mt: 3, mb: 1 }}
      >
        {title}
      </Typography>
      {tasks.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 2, mb: 2 }}
        >
          No tasks for this period.
        </Typography>
      ) : (
        <List dense>
          {tasks.map((task, index) => (
            <React.Fragment key={task.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="span">
                      {task.title}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <div
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }} // Example: basic CSS for truncation if desired
                          dangerouslySetInnerHTML={{ __html: task.description }}
                        />
                      <br />
                      <Typography variant="body2" color="text.secondary">
                        Deadline:{" "}
                        {task.expiredDate || task.expried_date
                          ? `${formatDateForDisplay(
                              task.expiredDate || task.expried_date
                            )} (${formatDistanceToNow(
                              parseISO(task.expiredDate || task.expried_date),
                              { addSuffix: true }
                            )})`
                          : "No deadline"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {task.status} | Priority: {task.priority}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < tasks.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </React.Fragment>
  );

  const getFilteredTasks = () => {
    switch (selectedFilter) {
      case "today":
        return notifications.today;
      case "thisWeek":
        return notifications.thisWeek;
      case "nextWeek":
        return notifications.nextWeek;
      case "pastDue":
        return notifications.pastDue;
      case "all":
      default:
        return notifications.all;
    }
  };

  const getFilterTitle = () => {
    switch (selectedFilter) {
      case "today":
        return "Tasks Due Today";
      case "thisWeek":
        return "Tasks Due This Week";
      case "nextWeek":
        return "Tasks Due Next Week";
      case "pastDue":
        return "Past Due Tasks";
      case "all":
      default:
        return "All Upcoming Deadlines and Pending Tasks";
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Task Notifications
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 3, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Button
            variant={selectedFilter === "all" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("all")}
            sx={{
              backgroundColor:
                selectedFilter === "all" ? "primary.main" : "transparent",
              color: selectedFilter === "all" ? "white" : "primary.main",
              "&:hover": {
                backgroundColor:
                  selectedFilter === "all" ? "primary.dark" : "primary.light",
                color: selectedFilter === "all" ? "white" : "primary.dark",
              },
            }}
          >
            All{" "}
            <Chip label={notificationCounts.all} size="small" sx={{ ml: 1 }} />
          </Button>
          <Button
            variant={selectedFilter === "pastDue" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("pastDue")}
            sx={{
              backgroundColor:
                selectedFilter === "pastDue" ? "error.main" : "transparent",
              color: selectedFilter === "pastDue" ? "white" : "error.main",
              "&:hover": {
                backgroundColor:
                  selectedFilter === "pastDue" ? "error.dark" : "error.light",
                color: selectedFilter === "pastDue" ? "white" : "error.dark",
              },
            }}
          >
            Past Due{" "}
            <Chip
              label={notificationCounts.pastDue}
              size="small"
              sx={{ ml: 1 }}
            />
          </Button>
          <Button
            variant={selectedFilter === "today" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("today")}
            sx={{
              backgroundColor:
                selectedFilter === "today" ? "warning.main" : "transparent",
              color: selectedFilter === "today" ? "white" : "warning.main",
              "&:hover": {
                backgroundColor:
                  selectedFilter === "today" ? "warning.dark" : "warning.light",
                color: selectedFilter === "today" ? "white" : "warning.dark",
              },
            }}
          >
            Today{" "}
            <Chip
              label={notificationCounts.today}
              size="small"
              sx={{ ml: 1 }}
            />
          </Button>
          <Button
            variant={selectedFilter === "thisWeek" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("thisWeek")}
            sx={{
              backgroundColor:
                selectedFilter === "thisWeek" ? "info.main" : "transparent",
              color: selectedFilter === "thisWeek" ? "white" : "info.main",
              "&:hover": {
                backgroundColor:
                  selectedFilter === "thisWeek" ? "info.dark" : "info.light",
                color: selectedFilter === "thisWeek" ? "white" : "info.dark",
              },
            }}
          >
            This Week{" "}
            <Chip
              label={notificationCounts.thisWeek}
              size="small"
              sx={{ ml: 1 }}
            />
          </Button>
          <Button
            variant={selectedFilter === "nextWeek" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("nextWeek")}
            sx={{
              backgroundColor:
                selectedFilter === "nextWeek" ? "success.main" : "transparent",
              color: selectedFilter === "nextWeek" ? "white" : "success.main",
              "&:hover": {
                backgroundColor:
                  selectedFilter === "nextWeek"
                    ? "success.dark"
                    : "success.light",
                color: selectedFilter === "nextWeek" ? "white" : "success.dark",
              },
            }}
          >
            Next Week{" "}
            <Chip
              label={notificationCounts.nextWeek}
              size="small"
              sx={{ ml: 1 }}
            />
          </Button>
        </Stack>

        {loading ? (
         
           <Notificationskeleton/>
          
        ) : (
          renderTaskList(getFilteredTasks(), getFilterTitle())
        )}
      </Paper>

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
