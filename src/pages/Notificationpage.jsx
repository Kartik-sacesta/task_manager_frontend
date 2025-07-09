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
import {
  formatDistanceToNow,
  isPast,
  parseISO,
  isToday,
  isThisWeek,
  startOfWeek,
  addWeeks,
  endOfDay,
} from "date-fns";
import axios from "axios";

export default function NotificationsPage() {
  const [loading, setLoading] = React.useState(false);
  const [notifications, setNotifications] = React.useState({
    today: [],
    thisWeek: [],
    nextWeek: [],
    pastDue: [],
    all: [],
  });
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [snackbar, setSnackbar] = React.useState({
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

  const fetchNotifications = React.useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.get("http://localhost:5000/task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const allFetchedTasks = Array.isArray(response.data)
          ? response.data
          : [];
        const now = new Date();

        const todayTasks = [];
        const thisWeekTasks = [];
        const nextWeekTasks = [];
        const pastDueTasks = [];
        const allRelevantTasks = [];

        const startOfNextWeek = startOfWeek(addWeeks(now, 1), {
          weekStartsOn: 1,
        });
        const endOfNextWeek = endOfDay(addWeeks(startOfNextWeek, 6));

        allFetchedTasks.forEach((task) => {
          const deadlineDate = task.expiredDate || task.expried_date;
          if (task.status === "completed") {
            return;
          }

          allRelevantTasks.push(task);

          if (!deadlineDate) {
            return;
          }

          const parsedDeadline = parseISO(deadlineDate);

          if (isPast(parsedDeadline) && !isToday(parsedDeadline)) {
            pastDueTasks.push(task);
          } else if (isToday(parsedDeadline)) {
            todayTasks.push(task);
          } else if (isThisWeek(parsedDeadline, { weekStartsOn: 1 })) {
            thisWeekTasks.push(task);
          } else if (
            parsedDeadline >= startOfNextWeek &&
            parsedDeadline <= endOfNextWeek
          ) {
            nextWeekTasks.push(task);
          }
        });

        const sortTasks = (tasks) =>
          tasks.sort((a, b) => {
            const dateA = parseISO(a.expiredDate || a.expried_date);
            const dateB = parseISO(b.expiredDate || b.expried_date);
            return dateA.getTime() - dateB.getTime();
          });

        setNotifications({
          today: sortTasks(todayTasks),
          thisWeek: sortTasks(thisWeekTasks),
          nextWeek: sortTasks(nextWeekTasks),
          pastDue: sortTasks(pastDueTasks),
          all: sortTasks(allRelevantTasks),
        });
      } else {
        throw new Error("Failed to fetch tasks.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch notifications.",
        "error"
      );
      setNotifications({
        today: [],
        thisWeek: [],
        nextWeek: [],
        pastDue: [],
        all: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

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
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {task.description}
                      </Typography>
                      <br />
                      <Typography variant="body2" color="text.secondary">
                        Deadline:{" "}
                        {formatDateForDisplay(
                          task.expiredDate || task.expried_date
                        )}{" "}
                        (
                        {formatDistanceToNow(
                          parseISO(task.expiredDate || task.expried_date),
                          { addSuffix: true }
                        )}
                        )
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
            All
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
            Past Due
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
            Today
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
            This Week
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
            Next Week
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
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
