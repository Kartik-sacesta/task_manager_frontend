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
  Typography,
  Box,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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

const steps = [
  "Basic Information",
  "Task Details",
  "Category & Classification",
];

function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  loading,
  edit,
  initialData,
}) {
  const [activeStep, setActiveStep] = React.useState(0);
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
      setActiveStep(0);
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

  const handleEditorChange = (content) => {
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

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    switch (step) {
      case 0:
        if (!formData.title.trim()) {
          newErrors.title = "Title is required";
          isValid = false;
        }

        if (!formData.description.trim()) {
          newErrors.description = "Description is required";
          isValid = false;
        }
        break;
      case 1:
        if (!formData.expiredDate) {
          newErrors.expiredDate = "Due date is required";
          isValid = false;
        } else {
          const selectedDate = new Date(formData.expiredDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            newErrors.expiredDate = "Due date cannot be in the past";
            isValid = false;
          }
        }
        break;
      case 2:
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
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
    setActiveStep(0);
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category_id === formData.categoryId
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
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
        );
      case 1:
        return (
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
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={formData.categoryId}
                  onChange={handleChange("categoryId")}
                  disabled={loading}
                  label="Category"
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <Select
                  value={formData.subCategoryId}
                  onChange={handleChange("subCategoryId")}
                  disabled={loading || !formData.categoryId}
                  label="SubCategory"
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>None</em>
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
        );
      default:
        return null;
    }
  };

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
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 1 }}>{getStepContent(activeStep)}</Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
        {activeStep !== 0 && (
          <Button
            onClick={handleBack}
            disabled={loading}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Back
          </Button>
        )}
        <Box sx={{ flex: "1 1 auto" }} />
        {activeStep === steps.length - 1 ? (
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
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default CreateTaskModal;
