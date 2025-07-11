import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useUserTasks = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [taskAnalytics, setTaskAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);

  const fetchUserTasks = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.get(
        `http://localhost:5000/user/task/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const fetchedTasks = Array.isArray(response.data.task)
          ? response.data.task
          : [];
        setTasks(fetchedTasks);
      } else {
        throw new Error("Failed to fetch tasks.");
      }
    } catch (e) {
      console.error("API Error (tasks):", e);
      if (e.response?.status === 403) {
        setError(
          "Access forbidden. You may not have permission to view these tasks or your session has expired."
        );
      } else if (e.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        setError(`Error fetching tasks: ${e.message}`);
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchTaskAnalytics = useCallback(async () => {
    if (!userId) {
      setAnalyticsLoading(false);
      return;
    }

    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.get(
        `http://localhost:5000/task/analytics/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setTaskAnalytics(response.data);
      } else {
        throw new Error("Failed to fetch task analytics.");
      }
    } catch (e) {
      console.error("API Error (analytics):", e);
      if (e.response?.status === 403) {
        setAnalyticsError(
          "Access forbidden for analytics. You may not have permission or your session has expired."
        );
      } else if (e.response?.status === 401) {
        setAnalyticsError(
          "Authentication failed for analytics. Please login again."
        );
      } else {
        setAnalyticsError(`Error fetching analytics: ${e.message}`);
      }
      setTaskAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    console.log("Fetching tasks for user:", userId);
    fetchUserTasks();
    fetchTaskAnalytics();
  }, [fetchUserTasks, fetchTaskAnalytics, userId]);

  return {
    tasks,
    loading,
    error,
    taskAnalytics,
    analyticsLoading,
    analyticsError,
    fetchUserTasks,
    fetchTaskAnalytics,
  };
};

export default useUserTasks;
