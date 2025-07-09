import React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Title",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "expiredDate",
    numeric: false,
    disablePadding: false,
    label: "Expired Date",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "priority",
    numeric: false,
    disablePadding: false,
    label: "Priority",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const priorityOptions = [
  { value: "All", label: "All Priorities" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Urgent", label: "Urgent" },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all tasks",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== "actions" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onCreateTask, onDeleteSelected, deleteLoading, priorityFilter, onPriorityFilterChange } = props;

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Tasks
        </Typography>
      )}
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="priority-filter-label">Priority</InputLabel>
        <Select
          labelId="priority-filter-label"
          id="priority-filter-select"
          value={priorityFilter}
          label="Priority"
          onChange={onPriorityFilterChange}
        >
          {priorityOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onDeleteSelected} disabled={deleteLoading}>
            {deleteLoading ? (
              <CircularProgress size={24} />
            ) : (
              <DeleteIcon />
            )}
            
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Create Task">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateTask}
            sx={{ textTransform: "none" }}
          >
            Create Task
          </Button>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onCreateTask: PropTypes.func.isRequired,
  onDeleteSelected: PropTypes.func.isRequired,
  deleteLoading: PropTypes.bool.isRequired,
  priorityFilter: PropTypes.string.isRequired,
  onPriorityFilterChange: PropTypes.func.isRequired,
};

function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  loading,
  edit,
  initialData,
}) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    expiredDate: "",
    status: "pending",
    priority: "Medium",
  });
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (edit && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        expiredDate: initialData.expiredDate
          ? initialData.expiredDate.split("T")[0]
          : initialData.expried_date
          ? initialData.expried_date.split("T")[0]
          : "",
        status: initialData.status || "pending",
        priority: initialData.priority || "Medium",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        expiredDate: "",
        status: "pending",
        priority: "Medium",
      });
    }
    setErrors({});
  }, [open, edit, initialData]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.expiredDate) {
      newErrors.expiredDate = "Expired date is required";
    } else {
      const selectedDate = new Date(formData.expiredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.expiredDate = "Expired date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        expried_date: new Date(formData.expiredDate).toISOString(),
      };
      delete submitData.expiredDate;
      onSubmit(submitData);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      expiredDate: "",
      status: "pending",
      priority: "Medium",
    });
    setErrors({});
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{edit ? "Edit Task" : "Create New Task"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={handleChange("title")}
              error={!!errors.title}
              helperText={errors.title}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange("description")}
              error={!!errors.description}
              helperText={errors.description}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expired Date"
              type="date"
              value={formData.expiredDate}
              onChange={handleChange("expiredDate")}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: today,
              }}
              error={!!errors.expiredDate}
              helperText={errors.expiredDate}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Status"
              select
              value={formData.status}
              onChange={handleChange("status")}
              disabled={loading}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Priority"
              select
              value={formData.priority}
              onChange={handleChange("priority")}
              disabled={loading}
            >
              {priorityOptions.slice(1).map((option) => ( // Exclude "All" from Create/Edit modal
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading
            ? edit
              ? "Saving..."
              : "Creating..."
            : edit
            ? "Save Changes"
            : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateTaskModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  edit: PropTypes.bool.isRequired,
  initialData: PropTypes.object,
};

function ConfirmationDialog({ open, title, message, onConfirm, onCancel, loading }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={16} /> : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("title");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [editTaskId, setEditTaskId] = React.useState(null);
  const [editTaskData, setEditTaskData] = React.useState(null);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [priorityFilter, setPriorityFilter] = React.useState('All'); // New state for priority filter

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

  const fetchTasks = React.useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.get("http://localhost:5000/task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setRows(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showSnackbar("Failed to fetch tasks", "error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (taskData) => {
    setCreateLoading(true);
    try {
      const token = localStorage.getItem("authtoken");

      const response = await axios.post(
        "http://localhost:5000/task",
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        showSnackbar("Task created successfully!");
        setModalOpen(false);
        fetchTasks();
      } else {
        throw new Error(response.data?.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      showSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to create task",
        "error"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditTask = async (taskData) => {
    if (!editTaskId) return;
    setCreateLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.put(
        `http://localhost:5000/task/${editTaskId}`,
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        showSnackbar("Task updated successfully!");
        setModalOpen(false);
        setEdit(false);
        setEditTaskId(null);
        setEditTaskData(null);
        fetchTasks();
      } else {
        throw new Error(response.data?.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      showSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to update task",
        "error"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;

    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      const deletePromises = selected.map((id) =>
        axios.delete(`http://localhost:5000/task/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const responses = await Promise.allSettled(deletePromises);
      const failedDeletes = responses.filter(
        (res) => res.status === "rejected"
      );

      if (failedDeletes.length === 0) {
        showSnackbar(`${selected.length} task(s) deleted successfully!`);
        setSelected([]);
        fetchTasks();
      } else {
        throw new Error(`Failed to delete ${failedDeletes.length} task(s)`);
      }
    } catch (error) {
      console.error("Error deleting tasks:", error);
      showSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete tasks",
        "error"
      );
    } finally {
      setDeleteLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "primary";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "success";
      case "Medium":
        return "warning";
      case "High":
      case "Urgent":
        return "error";
      default:
        return "primary";
    }
  };

  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
    setPage(0); // Reset page when filter changes
  };

  const filteredRows = React.useMemo(() => {
    if (priorityFilter === 'All') {
      return rows;
    }
    return rows.filter(row => row.priority === priorityFilter);
  }, [rows, priorityFilter]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...(Array.isArray(filteredRows) ? filteredRows : [])]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredRows, order, orderBy, page, rowsPerPage]
  );

  const handleOpenEditModal = (row) => {
    setEditTaskId(row.id);
    setEditTaskData(row);
    setEdit(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEdit(false);
    setEditTaskId(null);
    setEditTaskData(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onCreateTask={() => {
            setEdit(false);
            setEditTaskId(null);
            setEditTaskData(null);
            setModalOpen(true);
          }}
          onDeleteSelected={handleDeleteSelected}
          deleteLoading={deleteLoading}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={handlePriorityFilterChange}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => {
                  const isItemSelected = selected.includes(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClick(event, row.id);
                          }}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        onClick={() => handleClick(null, row.id)}
                      >
                        <Typography variant="subtitle2" noWrap>
                          {row.title}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body2" noWrap>
                          {row.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        {formatDate(row.expiredDate || row.expried_date)}
                      </TableCell>
                      <TableCell align="left">
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: `${getStatusColor(row.status)}.light`,
                            color: `${getStatusColor(row.status)}.dark`,
                            textTransform: "capitalize",
                            fontSize: "0.75rem",
                            fontWeight: "medium",
                            display: "inline-block",
                          }}
                        >
                          {row.status.replace("_", " ")}
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: `${getPriorityColor(row.priority)}.light`,
                            color: `${getPriorityColor(row.priority)}.dark`,
                            textTransform: "capitalize",
                            fontSize: "0.75rem",
                            fontWeight: "medium",
                            display: "inline-block",
                          }}
                        >
                          {row.priority}
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(row);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && !loading && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <CreateTaskModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={edit ? handleEditTask : handleCreateTask}
        loading={createLoading}
        edit={edit}
        initialData={editTaskData}
      />

      <ConfirmationDialog
        open={confirmDialogOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${selected.length} selected task(s)? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
        loading={deleteLoading}
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
