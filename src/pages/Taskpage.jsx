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
import CommentIcon from "@mui/icons-material/Comment";
import { visuallyHidden } from "@mui/utils";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TaskCommentsModal from "../modals/TaskCommentsModal";
import CreateTaskModal from "../modals/CreateTaskModal";
import ConfirmationDialog from "../modals/ConfirmationDialog";
import useTasksApi from "../hooks/useTasksApi";
import useCategoriesApi from "../hooks/useCategoriesApi"; 

import Menu from "@mui/material/Menu";

import MoreVertIcon from "@mui/icons-material/MoreVert";

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
  // {
  //   id: "category", 
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Category",
  // },
  // {
  //   id: "subCategory", 
  //   numeric: false,
  //   disablePadding: false,
  //   label: "SubCategory",
  // },
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

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    onCreateTask,
    priorityFilter,
    onPriorityFilterChange,
    categories, // NEW
    selectedCategoryFilter, // NEW
    onCategoryFilterChange, // NEW
    subCategories, // NEW
    selectedSubCategoryFilter, // NEW
    onSubCategoryFilterChange, // NEW
  } = props;

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

      {/* Category Filter */}
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="category-filter-label">Category</InputLabel>
        <Select
          labelId="category-filter-label"
          id="category-filter-select"
          value={selectedCategoryFilter || "All"}
          label="Category"
          onChange={onCategoryFilterChange}
        >
          <MenuItem value="All">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* SubCategory Filter */}
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small" disabled={!selectedCategoryFilter || selectedCategoryFilter === "All"}>
        <InputLabel id="sub-category-filter-label">SubCategory</InputLabel>
        <Select
          labelId="sub-category-filter-label"
          id="sub-category-filter-select"
          value={selectedSubCategoryFilter || "All"}
          label="SubCategory"
          onChange={onSubCategoryFilterChange}
        >
          <MenuItem value="All">All SubCategories</MenuItem>
          {subCategories.map((subCategory) => (
            <MenuItem key={subCategory.id} value={subCategory.id}>
              {subCategory.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Priority Filter */}
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

      <Tooltip title="Create Task">
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onCreateTask}
          sx={{ textTransform: "none" }}
        >
          Create Task
        </Button>
      </Tooltip>
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
  categories: PropTypes.array.isRequired, // NEW
  selectedCategoryFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // NEW
  onCategoryFilterChange: PropTypes.func.isRequired, // NEW
  subCategories: PropTypes.array.isRequired, // NEW
  selectedSubCategoryFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // NEW
  onSubCategoryFilterChange: PropTypes.func.isRequired, // NEW
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("title");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
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
  const [priorityFilter, setPriorityFilter] = React.useState("All");

  
  const [selectedCategoryFilter, setSelectedCategoryFilter] = React.useState("All");
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = React.useState("All");

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

  // NEW: Use new API hooks for categories and subcategories
  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
    subCategories,
    loading: subCategoriesLoading,
    fetchSubCategories,
  } = useCategoriesApi();
 
console.log("category--->",categories)
console.log("sub category--->",subCategories);
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

  // Fetch initial data
  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch subcategories when selectedCategoryFilter changes
  React.useEffect(() => {
    if (selectedCategoryFilter && selectedCategoryFilter !== "All") {
      fetchSubCategories(selectedCategoryFilter);
    } else {
      // Clear subcategories if no category is selected
      fetchSubCategories(null); // Pass null or empty array to clear
      setSelectedSubCategoryFilter("All"); // Reset subcategory filter
    }
  }, [selectedCategoryFilter, fetchSubCategories]);

  // Fetch tasks when filters change
  React.useEffect(() => {
    const filters = {};
    if (priorityFilter !== "All") {
      filters.priority = priorityFilter;
    }
    if (selectedSubCategoryFilter !== "All") {
      filters.sub_category_id = selectedSubCategoryFilter;
    } else if (selectedCategoryFilter !== "All") {
       //
    }
     if(selectedCategoryFilter!== "All"){
filters.category_id=selectedCategoryFilter;
    }
    
    console.log(filters);
    fetchTasks(filters);
  }, [fetchTasks, priorityFilter, selectedSubCategoryFilter]); 
  
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
      const newSelected = filteredRows.map((n) => n.id);
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
    setPage(0);
  };

  // NEW: Category filter handler
  const handleCategoryFilterChange = (event) => {
    const categoryId = event.target.value;
    console.log(categoryId);
    setSelectedCategoryFilter(categoryId);
    setSelectedSubCategoryFilter("All"); 
    setPage(0);
  };


  const handleSubCategoryFilterChange = (event) => {
    setSelectedSubCategoryFilter(event.target.value);
    setPage(0);
  };

  
  const filteredRows = React.useMemo(() => {
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    let currentFilteredTasks = tasksArray;

    
    if (priorityFilter !== "All") {
      currentFilteredTasks = currentFilteredTasks.filter((row) => row.priority === priorityFilter);
    }

    
    if (selectedCategoryFilter !== "All" && selectedSubCategoryFilter === "All") {
        currentFilteredTasks = currentFilteredTasks.filter(task =>
            task.subCategory && task.subCategory.category &&
            task.subCategory.category.id === selectedCategoryFilter
        );
    }
  

    return currentFilteredTasks;
  }, [tasks, priorityFilter, selectedCategoryFilter, selectedSubCategoryFilter]);


  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
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
          categories={categories} // NEW
          selectedCategoryFilter={selectedCategoryFilter} // NEW
          onCategoryFilterChange={handleCategoryFilterChange} // NEW
          subCategories={(subCategories||[]).filter(sub => sub.category_id === selectedCategoryFilter || selectedCategoryFilter === "All")} // NEW: Filter subcategories for the toolbar dropdown
          selectedSubCategoryFilter={selectedSubCategoryFilter} // NEW
          onSubCategoryFilterChange={handleSubCategoryFilterChange} // NEW
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
              {tasksLoading || categoriesLoading || subCategoriesLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
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
                        <Typography variant="body2" noWrap>
                          {row.description}
                        </Typography>
                      </TableCell>
                  
                      {/* <TableCell align="left">
                        <Typography variant="body2" noWrap>
                          {row.subCategory?.category?.name || "N/A"}
                        </Typography>
                      </TableCell>
                    
                      <TableCell align="left">
                        <Typography variant="body2" noWrap>
                          {row.subCategory?.name || "N/A"}
                        </Typography>
                      </TableCell> */}

        
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
                            e.stopPropagation(); // Prevent row selection
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
                              setSelected([row.id]); // Select only this row for deletion
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
              {emptyRows > 0 && !tasksLoading && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={8} />
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
