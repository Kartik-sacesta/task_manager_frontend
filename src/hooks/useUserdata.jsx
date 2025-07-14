import { useState, useEffect, useCallback } from "react";
import axios from "axios";



export const useUserData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const getAuthToken = () => localStorage.getItem("authtoken");

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

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Failed to fetch users", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (userData) => {
    setCreateLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user`, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        showSnackbar("User created successfully!");
        fetchUsers();
        return { success: true };
      } else {
        throw new Error(response.data?.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      showSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to create user",
        "error"
      );
      return { success: false, error };
    } finally {
      setCreateLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    if (!userId) return { success: false };

    setCreateLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/${userId}`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        showSnackbar("User updated successfully!");
        fetchUsers();
        return { success: true };
      } else {
        throw new Error(response.data?.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to update user",
        "error"
      );
      return { success: false, error };
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!userId) return { success: false };

    try {
      const token = getAuthToken();
      const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        showSnackbar("User deleted successfully!");
        fetchUsers();
        return { success: true };
      } else {
        throw new Error(response.data?.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete user",
        "error"
      );
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    createLoading,
    snackbar,
    handleCloseSnackbar,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
