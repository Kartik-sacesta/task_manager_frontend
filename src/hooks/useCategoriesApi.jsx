import { useState, useCallback } from "react";
import axios from "axios";


const token = localStorage.getItem("authtoken");

const useCategoriesApi = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/category`);
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        throw new Error(response.data.message || "Failed to fetch categories");
      }
    } catch (err) {
      setError(err);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/category`, categoryData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        await fetchCategories();
      } else {
        throw new Error(response.data.message || "Failed to create category");
      }
    } catch (err) {
      setError(err);
      console.error("Error creating category:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (categoryId, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/category/${categoryId}`, categoryData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        await fetchCategories();
      } else {
        throw new Error(response.data.message || "Failed to update category");
      }
    } catch (err) {
      setError(err);
      console.error("Error updating category:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        await fetchCategories();
      } else {
        throw new Error(response.data.message || "Failed to delete category");
      }
    } catch (err) {
      setError(err);
      console.error("Error deleting category:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const fetchSubCategories = useCallback(async (categoryId = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = categoryId ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/subcategory/${categoryId}` : `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/subcategory`;
      const response = await axios.get(url);

      if (response.data.success) {
        setSubCategories(response.data.subcategories);
      } else {
        throw new Error(response.data.message || "Failed to fetch subcategories");
      }
    } catch (err) {
      setError(err);
      console.error("Error fetching subcategories:", err);
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubCategory = useCallback(async (subCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/subcategory`, subCategoryData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        if (subCategoryData.categoryId) {
          await fetchSubCategories(subCategoryData.categoryId);
        } else {
          await fetchSubCategories();
        }
      } else {
        throw new Error(response.data.message || "Failed to create subcategory");
      }
    } catch (err) {
      setError(err);
      console.error("Error creating subcategory:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchSubCategories]);

  const updateSubCategory = useCallback(async (subCategoryId, subCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/subcategory/${subCategoryId}`, subCategoryData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        await fetchSubCategories();
      } else {
        throw new Error(response.data.message || "Failed to update subcategory");
      }
    } catch (err) {
      setError(err);
      console.error("Error updating subcategory:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchSubCategories]);

  const deleteSubCategory = useCallback(async (subCategoryId)=> {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/subcategory/${subCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        await fetchSubCategories();
      } else {
        throw new Error(response.data.message || "Failed to delete subcategory");
      }
    } catch (err) {
      setError(err);
      console.error("Error deleting subcategory:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchSubCategories]);

  return {
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
    error,
  };
};

export default useCategoriesApi;
