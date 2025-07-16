import React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";

import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import { visuallyHidden } from "@mui/utils";

import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import TaskCommentsModal from "../modals/TaskCommentsModal";
import CreateTaskModal from "../modals/CreateTaskModal";
import ConfirmationDialog from "../modals/ConfirmationDialog";
import useTasksApi from "../hooks/useTasksApi";
import useCategoriesApi from "../hooks/useCategoriesApi";
import EnhancedTableToolbar from "../components/EnhancedTableToolbar";
import { Tableskeleton } from "../skeleton/Tableskeleton";
import Pagination from "@mui/material/Pagination";
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
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
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

export default function Taskpage() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("title");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openMenuId, setOpenMenuId] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [editTaskId, setEditTaskId] = React.useState(null);
  const [editTaskData, setEditTaskData] = React.useState(null);

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [priorityFilter, setPriorityFilter] = React.useState([]);

  const [taskTitleSearchTerm, setTaskTitleSearchTerm] = React.useState("");
  const [subCategorySearchTerm, setSubCategorySearchTerm] = React.useState("");

  const [selectedTaskTitleId, setSelectedTaskTitleId] = React.useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    React.useState(null);

  const [commentsModalOpen, setCommentsModalOpen] = React.useState(false);
  const [currentTaskIdForComments, setCurrentTaskIdForComments] =
    React.useState(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
    subCategories,
    loading: subCategoriesLoading,
    fetchSubCategories,
  } = useCategoriesApi();

  const {
    tasks,
    loading: tasksLoading,
    createLoading,
    deleteLoading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTasks,
  } = useTasksApi();

  React.useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, [fetchCategories, fetchSubCategories]);

  React.useEffect(() => {
    const filters = {
      page: page,
      limit: rowsPerPage,
    };
    if (selectedSubCategoryId) {
      filters.sub_category_id = selectedSubCategoryId;
    }

    if (selectedTaskTitleId) {
      filters.id = selectedTaskTitleId;
    }

    fetchTasks(filters);
  }, [
    fetchTasks,
    selectedSubCategoryId,
    selectedTaskTitleId,
    page,
    rowsPerPage,
  ]);

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTasks(selected);
      setSelected([]);
      setConfirmDialogOpen(false);
      showSnackbar(`${selected.length} task(s) deleted successfully`);
    } catch (error) {
      showSnackbar("Failed to delete tasks", error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map((n) => n.id);
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
    setPage(1);
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

  const handlePriorityFilterChange = (newvalue) => {
    const priorityArray = Array.isArray(newvalue) ? newvalue : [newvalue];
    setPriorityFilter(priorityArray);
    setPage(1);
  };
  console.log("priority", priorityFilter);

  const handleTaskTitleSearchChange = (value) => {
    console.log(value.id);

    if (typeof value === "string") {
      setTaskTitleSearchTerm(value);
      setSelectedTaskTitleId(null);
    } else if (value && typeof value === "object" && value.id) {
      setTaskTitleSearchTerm(value.name);
      setSelectedTaskTitleId(value.id);
    } else {
      setTaskTitleSearchTerm("");
      setSelectedTaskTitleId(null);
    }
    setPage(1);
  };

  const handleSubCategorySearchChange = (value) => {
    console.log(value.id);
    if (typeof value === "string") {
      setSubCategorySearchTerm(value);
      setSelectedSubCategoryId(null);
    } else if (value && typeof value === "object" && value.id) {
      setSubCategorySearchTerm(value.name);
      setSelectedSubCategoryId(value.id);
    } else {
      setSubCategorySearchTerm("");
      setSelectedSubCategoryId(null);
    }
    setPage(1);
  };

  const filteredRows = React.useMemo(() => {
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    let currentFilteredTasks = [...tasksArray];

    if (priorityFilter && priorityFilter.length > 0) {
      currentFilteredTasks = currentFilteredTasks.filter((task) =>
        priorityFilter.includes(task.priority?.toLowerCase())
      );

      console.log("curr", currentFilteredTasks);
    }

    if (!selectedTaskTitleId && taskTitleSearchTerm) {
      const lowerCaseSearchTerm = String(taskTitleSearchTerm).toLowerCase();
      currentFilteredTasks = currentFilteredTasks.filter(
        (task) =>
          (task.title &&
            String(task.title).toLowerCase().includes(lowerCaseSearchTerm)) ||
          (task.description &&
            String(task.description)
              .toLowerCase()
              .includes(lowerCaseSearchTerm))
      );
    }

    if (!selectedSubCategoryId && subCategorySearchTerm) {
      const lowerCaseSearchTerm = String(subCategorySearchTerm).toLowerCase();
      currentFilteredTasks = currentFilteredTasks.filter(
        (task) =>
          task.subCategory &&
          task.subCategory.name &&
          String(task.subCategory.name)
            .toLowerCase()
            .includes(lowerCaseSearchTerm)
      );
    }

    return currentFilteredTasks;
  }, [
    tasks,
    priorityFilter,
    taskTitleSearchTerm,
    selectedTaskTitleId,
    subCategorySearchTerm,
    selectedSubCategoryId,
  ]);

  const visibleRows = React.useMemo(() => {
    return [...filteredRows].sort(getComparator(order, orderBy));
  }, [filteredRows, order, orderBy]);

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

  const handleTaskSubmit = async (taskData) => {
    try {
      if (edit) {
        await updateTask(editTaskId, taskData);
        showSnackbar("Task updated successfully");
      } else {
        await createTask(taskData);
        showSnackbar("Task created successfully");
      }
      handleModalClose();
    } catch (error) {
      showSnackbar(`Failed to ${edit ? "update" : "create"} task`, error);
    }
  };

  const handleOpenCommentsModal = (taskId) => {
    setCurrentTaskIdForComments(taskId);
    setCommentsModalOpen(true);
  };

  const handleCloseCommentsModal = () => {
    setCommentsModalOpen(false);
    setCurrentTaskIdForComments(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
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
          categories={categories}
          subCategories={subCategories}
          taskTitleSearchTerm={taskTitleSearchTerm}
          onTaskTitleSearchChange={handleTaskTitleSearchChange}
          subCategorySearchTerm={subCategorySearchTerm}
          onSubCategorySearchChange={handleSubCategorySearchChange}
          tasks={tasks}
        />{" "}
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
              {tasksLoading || categoriesLoading || subCategoriesLoading ? (
                <TableRow>
                  <TableCell align="center">
                    <Tableskeleton />
                  </TableCell>
                </TableRow>
              ) : visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox"></TableCell>
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
                        <div
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }} // Example: basic CSS for truncation if desired
                          dangerouslySetInnerHTML={{ __html: row.description }}
                        />
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
                          {row.status?.replace("_", " ") || "Unknown"}
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
                          {row.priority || "Unknown"}
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <IconButton
                          aria-label="more"
                          id={`long-button-${row.id}`}
                          aria-controls={
                            openMenuId === row.id ? "long-menu" : undefined
                          }
                          aria-expanded={
                            openMenuId === row.id ? "true" : undefined
                          }
                          aria-haspopup="true"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(e, row.id);
                          }}
                          size="small"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                        <Menu
                          id="long-menu"
                          MenuListProps={{
                            "aria-labelledby": `long-button-${row.id}`,
                          }}
                          anchorEl={anchorEl}
                          open={openMenuId === row.id}
                          onClose={handleMenuClose}
                          PaperProps={{
                            style: {
                              maxHeight: 48 * 4.5,
                              width: "15ch",
                            },
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              handleOpenEditModal(row);
                              handleMenuClose();
                            }}
                          >
                            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setSelected([row.id]);
                              setConfirmDialogOpen(true);
                              handleMenuClose();
                            }}
                          >
                            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />{" "}
                            Delete
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleOpenCommentsModal(row.id);
                              handleMenuClose();
                            }}
                          >
                            <CommentIcon fontSize="small" sx={{ mr: 1 }} />{" "}
                            Comments
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onPageChange={(event, newPage) =>
            handleChangePage(event, newPage + 1)
          }
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <CreateTaskModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleTaskSubmit}
        loading={createLoading}
        edit={edit}
        initialData={editTaskData}
      />

      <ConfirmationDialog
        open={confirmDialogOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${selected.length} selected task(s)? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
        loading={deleteLoading}
      />

      <TaskCommentsModal
        open={commentsModalOpen}
        onClose={handleCloseCommentsModal}
        taskId={currentTaskIdForComments}
        showSnackbar={showSnackbar}
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
