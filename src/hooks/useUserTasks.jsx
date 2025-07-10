
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useUserTasks = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0,
  });

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

        const pending = fetchedTasks.filter(
          (task) => task.status === "pending"
        ).length;
        const inProgress = fetchedTasks.filter(
          (task) => task.status === "in-progress"
        ).length;
        const completed = fetchedTasks.filter(
          (task) => task.status === "completed"
        ).length;

        setTaskCounts({
          pending,
          inProgress,
          completed,
          total: fetchedTasks.length,
        });
      } else {
        throw new Error("Failed to fetch tasks.");
      }
    } catch (e) {
      console.error("API Error:", e);
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
      setTaskCounts({ pending: 0, inProgress: 0, completed: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [userId]); 

  useEffect(() => {
    console.log("Fetching tasks for user:", userId);
    fetchUserTasks();
    
  }, [fetchUserTasks]);

  return { tasks, loading, error, taskCounts, fetchUserTasks };
};

export default useUserTasks;