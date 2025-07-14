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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; 

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
