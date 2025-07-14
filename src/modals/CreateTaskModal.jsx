import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Stack,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { alpha } from "@mui/material/styles";

import useCategoriesApi from "../hooks/useCategoriesApi";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Urgent", label: "Urgent" },
];

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
    categoryId: "",
    subCategoryId: "",
  });
  const [errors, setErrors] = React.useState({});

  const { categories, fetchCategories, subCategories, fetchSubCategories } =
    useCategoriesApi();

  React.useEffect(() => {
    if (open) {
      fetchCategories();
      fetchSubCategories();
    }
  }, [open, fetchCategories, fetchSubCategories]);

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
        subCategoryId: initialData.sub_category_id || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        expiredDate: "",
        status: "pending",
        priority: "Medium",

        subCategoryId: "",
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
    // If category changes, reset subcategory
    if (field === "categoryId") {
      setFormData((prev) => ({
        ...prev,
        subCategoryId: "",
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

      if (formData.subCategoryId) {
        submitData.sub_category_id = formData.subCategoryId;
      } else {
        submitData.category_id = null;
        submitData.sub_category_id = null;
      }

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
      categoryId: "",
      subCategoryId: "",
    });
    setErrors({});
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];

  
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category_id === formData.categoryId
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {edit ? "Edit Task" : "Create New Task"}
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
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
              margin="dense"
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
              margin="dense"
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
              margin="dense"
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
              margin="dense"
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
              margin="dense"
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              select
              value={formData.categoryId}
              onChange={handleChange("categoryId")}
              disabled={loading}
              margin="dense"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

        
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="SubCategory"
              select
              value={formData.subCategoryId}
              onChange={handleChange("subCategoryId")}
              disabled={loading || !formData.categoryId}
              margin="dense"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filteredSubCategories.map((subCategory) => (
                <MenuItem key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
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
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
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

export default CreateTaskModal;

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    onCreateTask,
    priorityFilter,
    onPriorityFilterChange,
    categories, 
    selectedCategoryFilter, 
    onCategoryFilterChange, 
    subCategories, 
    selectedSubCategoryFilter, 
    onSubCategoryFilterChange, 
    onDeleteSelected,
    deleteLoading, 
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
      <FormControl
        sx={{ m: 1, minWidth: 120 }}
        size="small"
        disabled={!selectedCategoryFilter || selectedCategoryFilter === "All"}
      >
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

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={onDeleteSelected}
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          </IconButton>
        </Tooltip>
      )}

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
  categories: PropTypes.array.isRequired, 
  selectedCategoryFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]), 
  onCategoryFilterChange: PropTypes.func.isRequired, 
  subCategories: PropTypes.array.isRequired, 
  selectedSubCategoryFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]), 
  onSubCategoryFilterChange: PropTypes.func.isRequired, 
};
