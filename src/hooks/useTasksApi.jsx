import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/task`;

const useTasksApi = (showSnackbar) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getToken = () => localStorage.getItem("authtoken");

  const fetchTasks = useCallback(
    async (filter = null) => {
      setLoading(true);
      try {
        const token = getToken();
        console.log("filtters", filter);
        let url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/task`;

        if (filter && filter.sub_category_id) {
          url += `/${filter.sub_category_id}`;
        }
        if (filter && filter.id) {
          url += `/search/${filter.id}`;
        }

        const queryParams = {
          page: filter.page,
          limit: filter.limit,
        };
        console.log(url);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: queryParams,
        });
        console.log(response);
        if (response.status === 200) {
          setTasks(Array.isArray(response.data) ? response.data : []);
        } else {
          throw new Error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (showSnackbar) {
          showSnackbar("Failed to fetch tasks", "error");
        }
        setTasks([]);
      } finally {
        setLoading(false);
      }
    },
    [showSnackbar]
  );

  console.log(tasks);
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    setCreateLoading(true);
    try {
      const token = getToken();
      const response = await axios.post(API_BASE_URL, taskData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        if (showSnackbar) {
          showSnackbar("Task created successfully!");
        }
        fetchTasks();
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      if (showSnackbar) {
        showSnackbar(
          error.response?.data?.message ||
            error.message ||
            "Failed to create task",
          "error"
        );
      }
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateTask = async (taskId, taskData) => {
    setCreateLoading(true);
    try {
      const token = getToken();
      const response = await axios.put(`${API_BASE_URL}/${taskId}`, taskData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
   
      if (response.status === 200) {
        if (showSnackbar) {
          showSnackbar("Task updated successfully!");
        }
        fetchTasks();
  
      } else {
        throw new Error(response.data?.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      if (showSnackbar) {
        showSnackbar(
          error.response?.data?.message ||
            error.message ||
            "Failed to update task",
          "error"
        );
      }
    
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteTasks = async (ids) => {
    setDeleteLoading(true);
    try {
      const token = getToken();
      const deletePromises = ids.map((id) =>
        axios.delete(`${API_BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const responses = await Promise.allSettled(deletePromises);
      const failedDeletes = responses.filter(
        (res) => res.status === "rejected"
      );

      if (failedDeletes.length === 0) {
        if (showSnackbar) {
          showSnackbar(`${ids.length} task(s) deleted successfully!`);
        }
        fetchTasks();
        return true;
      } else {
        throw new Error(`Failed to delete ${failedDeletes.length} task(s)`);
      }
    } catch (error) {
      console.error("Error deleting tasks:", error);
      if (showSnackbar) {
        showSnackbar(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete tasks",
          "error"
        );
      }
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    tasks,
    loading,
    createLoading,
    deleteLoading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTasks,
  };
};

export default useTasksApi;
