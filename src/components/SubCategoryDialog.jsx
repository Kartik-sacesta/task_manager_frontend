import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const SubCategoryDialog = ({
  open,
  mode,
  data,
  categories,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    is_active: true,
  });

  useEffect(() => {
    if (mode === "edit" && data) {
      setFormData({
        name: data.name || "",
        description: data.description || "",
        category_id: data.category_id || "",
        is_active: data.is_active || true,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category_id: "",
        is_active: true,
      });
    }
  }, [mode, data, open]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      onSave({ message: "SubCategory name is required", severity: "error" });
      return;
    }
    if (!formData.category_id) {
      onSave({ message: "Please select a category", severity: "error" });
      return;
    }

    const saveData = {
      ...formData,
      is_deleted: false,
    };

    if (mode === "edit") {
      saveData.id = data.id;
    }

    onSave(saveData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "create" ? "Add SubCategory" : "Edit SubCategory"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="SubCategory Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
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
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === "create" ? "Create" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubCategoryDialog;
