import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  VisibilityOff as VisibilityOffIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import useCategoriesApi from "../hooks/useCategoriesApi";
import CategoryDialog from "../components/CategoryDialog";
import SubCategoryDialog from "../components/SubCategoryDialog";

const Categorypage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    subCategories,
    fetchSubCategories,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    loading,
  } = useCategoriesApi();

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, [fetchCategories, fetchSubCategories]);

  const [categoryDialog, setCategoryDialog] = useState({
    open: false,
    mode: "create",
    data: null,
  });
  const [subCategoryDialog, setSubCategoryDialog] = useState({
    open: false,
    mode: "create",
    data: null,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [selectedCategoryRow, setSelectedCategoryRow] = useState(null);

  const [subCategoryAnchorEl, setSubCategoryAnchorEl] = useState(null);
  const [selectedSubCategoryRow, setSelectedSubCategoryRow] = useState(null);

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      await createCategory(categoryData);
      setCategoryDialog({ open: false, mode: "create", data: null });
      showNotification("Category created successfully");
    } catch (err) {
      showNotification(`Failed to create category: ${err.message}`, "error");
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      await updateCategory(categoryData.id, categoryData);
      setCategoryDialog({ open: false, mode: "create", data: null });
      showNotification("Category updated successfully");
    } catch (err) {
      showNotification(`Failed to update category: ${err.message}`, "error");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      showNotification("Category deleted successfully");
    } catch (err) {
      showNotification(`Failed to delete category: ${err.message}`, "error");
    }
  };

  const handleToggleCategoryStatus = async (categoryId) => {
    try {
      const categoryToUpdate = categories.find((cat) => cat.id === categoryId);
      if (categoryToUpdate) {
        const updatedData = {
          ...categoryToUpdate,
          is_active: !categoryToUpdate.is_active,
        };
        await updateCategory(categoryId, updatedData);
        showNotification("Category status updated successfully");
      }
    } catch (err) {
      showNotification(
        `Failed to update category status: ${err.message}`,
        "error"
      );
    }
  };

  const handleCreateSubCategory = async (subCategoryData) => {
    try {
      await createSubCategory(subCategoryData);
      setSubCategoryDialog({ open: false, mode: "create", data: null });
      showNotification("SubCategory created successfully");
    } catch (err) {
      showNotification(`Failed to create subcategory: ${err.message}`, "error");
    }
  };

  const handleUpdateSubCategory = async (subCategoryData) => {
    try {
      await updateSubCategory(
        subCategoryData.id,
        subCategoryData,
        subCategoryData.category_id
      );
      setSubCategoryDialog({ open: false, mode: "create", data: null });
      showNotification("SubCategory updated successfully");
    } catch (err) {
      showNotification(`Failed to update subcategory: ${err.message}`, "error");
    }
  };

  const handleDeleteSubCategory = async (subCategoryId, parentCategoryId) => {
    try {
      await deleteSubCategory(subCategoryId, parentCategoryId);
      showNotification("SubCategory deleted successfully");
    } catch (err) {
      showNotification(`Failed to delete subcategory: ${err.message}`, "error");
    }
  };

  const handleToggleSubCategoryStatus = async (
    subCategoryId,
    parentCategoryId
  ) => {
    try {
      const subCategoryToUpdate = subCategories.find(
        (subCat) => subCat.id === subCategoryId
      );
      if (subCategoryToUpdate) {
        const updatedData = {
          ...subCategoryToUpdate,
          is_active: !subCategoryToUpdate.is_active,
        };
        await updateSubCategory(subCategoryId, updatedData, parentCategoryId);
        showNotification("SubCategory status updated successfully");
      }
    } catch (err) {
      showNotification(
        `Failed to update subcategory status: ${err.message}`,
        "error"
      );
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getActiveCategories = () => {
    return categories.filter((cat) => cat.is_active && !cat.is_deleted);
  };

  const getVisibleCategories = () => {
    return categories.filter((cat) => !cat.is_deleted);
  };

  const getVisibleSubCategories = () => {
    return subCategories.filter((subCat) => !subCat.is_deleted);
  };

  // Handlers for category menu
  const handleCategoryMenuOpen = (event, row) => {
    setCategoryAnchorEl(event.currentTarget);
    setSelectedCategoryRow(row);
  };

  const handleCategoryMenuClose = () => {
    setCategoryAnchorEl(null);
    setSelectedCategoryRow(null);
  };

  const handleCategoryEditClick = () => {
    setCategoryDialog({
      open: true,
      mode: "edit",
      data: selectedCategoryRow,
    });
    handleCategoryMenuClose();
  };

  const handleCategoryToggleStatusClick = () => {
    handleToggleCategoryStatus(selectedCategoryRow.id);
    handleCategoryMenuClose();
  };

  const handleCategoryDeleteClick = () => {
    handleDeleteCategory(selectedCategoryRow.id);
    handleCategoryMenuClose();
  };

  // Handlers for subcategory menu
  const handleSubCategoryMenuOpen = (event, row) => {
    setSubCategoryAnchorEl(event.currentTarget);
    setSelectedSubCategoryRow(row);
  };

  const handleSubCategoryMenuClose = () => {
    setSubCategoryAnchorEl(null);
    setSelectedSubCategoryRow(null);
  };

  const handleSubCategoryEditClick = () => {
    setSubCategoryDialog({
      open: true,
      mode: "edit",
      data: selectedSubCategoryRow,
    });
    handleSubCategoryMenuClose();
  };

  const handleSubCategoryToggleStatusClick = () => {
    handleToggleSubCategoryStatus(
      selectedSubCategoryRow.id,
      selectedSubCategoryRow.category_id
    );
    handleSubCategoryMenuClose();
  };

  const handleSubCategoryDeleteClick = () => {
    handleDeleteSubCategory(
      selectedSubCategoryRow.id,
      selectedSubCategoryRow.category_id
    );
    handleSubCategoryMenuClose();
  };

  const categoryColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", flex: 1, minWidth: 250 },
    {
      field: "is_active",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(event) => handleCategoryMenuOpen(event, params.row)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="category-actions-menu"
            anchorEl={categoryAnchorEl}
            open={
              Boolean(categoryAnchorEl) &&
              selectedCategoryRow?.id === params.row.id
            }
            onClose={handleCategoryMenuClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: "20ch",
              },
            }}
          >
            <MenuItem onClick={handleCategoryEditClick}>
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={handleCategoryToggleStatusClick}>
              {selectedCategoryRow?.is_active ? (
                <VisibilityOffIcon sx={{ mr: 1 }} />
              ) : (
                <ViewIcon sx={{ mr: 1 }} />
              )}
              {selectedCategoryRow?.is_active ? "Deactivate" : "Activate"}
            </MenuItem>
            <MenuItem onClick={handleCategoryDeleteClick}>
              <DeleteIcon sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const subCategoryColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", flex: 1, minWidth: 250 },
    {
      field: "category_id",
      headerName: "Category",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={getCategoryName(params.value)}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100, // Adjusted width for the ellipsis icon
      renderCell: (params) => (
        <Box>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(event) => handleSubCategoryMenuOpen(event, params.row)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="subcategory-actions-menu"
            anchorEl={subCategoryAnchorEl}
            open={
              Boolean(subCategoryAnchorEl) &&
              selectedSubCategoryRow?.id === params.row.id
            }
            onClose={handleSubCategoryMenuClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: "20ch",
              },
            }}
          >
            <MenuItem onClick={handleSubCategoryEditClick}>
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={handleSubCategoryToggleStatusClick}>
              {selectedSubCategoryRow?.is_active ? (
                <VisibilityOffIcon sx={{ mr: 1 }} />
              ) : (
                <ViewIcon sx={{ mr: 1 }} />
              )}
              {selectedSubCategoryRow?.is_active ? "Deactivate" : "Activate"}
            </MenuItem>
            <MenuItem onClick={handleSubCategoryDeleteClick}>
              <DeleteIcon sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Category & SubCategory Management
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Categories" />
        <Tab label="SubCategories" />
      </Tabs>

      {activeTab === 0 && (
        <Card>
          <CardHeader
            title="Categories"
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  setCategoryDialog({ open: true, mode: "create", data: null })
                }
              >
                Add Category
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={getVisibleCategories()}
                columns={categoryColumns}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5 },
                  },
                }}
                loading={loading}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Card>
          <CardHeader
            title="SubCategories"
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  setSubCategoryDialog({
                    open: true,
                    mode: "create",
                    data: null,
                  })
                }
              >
                Add SubCategory
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={getVisibleSubCategories()}
                columns={subCategoryColumns}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5 },
                  },
                }}
                loading={loading}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      )}

      <CategoryDialog
        open={categoryDialog.open}
        mode={categoryDialog.mode}
        data={categoryDialog.data}
        onClose={() =>
          setCategoryDialog({ open: false, mode: "create", data: null })
        }
        onSave={
          categoryDialog.mode === "create"
            ? handleCreateCategory
            : handleUpdateCategory
        }
      />

      <SubCategoryDialog
        open={subCategoryDialog.open}
        mode={subCategoryDialog.mode}
        data={subCategoryDialog.data}
        categories={getActiveCategories()}
        onClose={() =>
          setSubCategoryDialog({ open: false, mode: "create", data: null })
        }
        onSave={
          subCategoryDialog.mode === "create"
            ? handleCreateSubCategory
            : handleUpdateSubCategory
        }
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};





export default Categorypage;
