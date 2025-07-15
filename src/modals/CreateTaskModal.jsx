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
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { alpha } from "@mui/material/styles";

import { Editor } from "@tinymce/tinymce-react";

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
      let initialCategoryId = "";
      if (initialData.sub_category_id) {
        const foundSubCategory = subCategories.find(
          (sub) => sub.id === initialData.sub_category_id
        );
        if (foundSubCategory) {
          initialCategoryId = foundSubCategory.category_id;
        }
      }

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
        categoryId: initialCategoryId,
        subCategoryId: initialData.sub_category_id || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        expiredDate: "",
        status: "pending",
        priority: "Medium",
        categoryId: "",
        subCategoryId: "",
      });
    }
    setErrors({});
  }, [open, edit, initialData, subCategories]);

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
    if (field === "categoryId") {
      setFormData((prev) => ({
        ...prev,
        subCategoryId: "",
      }));
    }
  };

  const handleEditorChange = (content, editor) => {
    setFormData((prev) => ({
      ...prev,
      description: content,
    }));
    if (errors.description) {
      setErrors((prev) => ({
        ...prev,
        description: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    const strippedDescription = formData.description
      .replace(/<[^>]*>/g, "")
      .trim();
    if (!strippedDescription) {
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
        title: formData.title,
        description: formData.description,
        expried_date: new Date(formData.expiredDate).toISOString(),
        status: formData.status,
        priority: formData.priority,
      };

      if (formData.subCategoryId) {
        submitData.sub_category_id = formData.subCategoryId;
      } else {
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          position: "absolute",
          right: 0,
          margin: 0,
          height: "100%",
          maxHeight: "100%",
          width: { xs: "100%", sm: "500px", md: "600px" },
          borderRadius: 0,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" component="div">
            {edit ? "Edit Task" : "Create New Task"}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mt: 1 }}>
          {/* Basic Information Section */}
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Basic Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={formData.title}
                onChange={handleChange("title")}
                error={!!errors.title}
                helperText={errors.title}
                disabled={loading}
                variant="outlined"
                placeholder="Enter task title..."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                Description
              </Typography>
              <Box
                sx={{
                  border: errors.description
                    ? "1px solid #d32f2f"
                    : "1px solid #e0e0e0",
                  borderRadius: 1,
                }}
              >
                <Editor
                  apiKey="3it5kj2j0kbpxlv0zkfukdl7w5161114jj3f2mf8lc5wax6m"
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; padding: 10px; }",
                    placeholder: "Enter task description...",
                  }}
                  value={formData.description}
                  onEditorChange={handleEditorChange}
                  disabled={loading}
                />
              </Box>
              {errors.description && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {errors.description}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Task Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
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
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange("status")}
                  disabled={loading}
                  label="Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={handleChange("priority")}
                  disabled={loading}
                  label="Priority"
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Category & Classification
          </Typography>

          <Grid spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={handleChange("categoryId")}
                  disabled={loading}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth displayEmpty variant="outlined">
                <InputLabel>SubCategory</InputLabel>
                <Select
                  value={formData.subCategoryId}
                  onChange={handleChange("subCategoryId")}
                  disabled={loading || !formData.categoryId}
                  label="SubCategory"
                >
                  <MenuItem value="">
                    <em>Select SubCategory</em>
                  </MenuItem>
                  {filteredSubCategories.map((subCategory) => (
                    <MenuItem key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{ minWidth: 120 }}
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
