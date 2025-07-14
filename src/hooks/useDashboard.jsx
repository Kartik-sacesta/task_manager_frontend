import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const TASK_ANALYTICS_API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/task/alltask/analytics`;
const USER_ANALYTICS_API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/alluser`;

const useDashboard = () => {
  const [taskAnalytics, setTaskAnalytics] = useState(null);
  const [loadingTaskAnalytics, setLoadingTaskAnalytics] = useState(true);
  const [errorTaskAnalytics, setErrorTaskAnalytics] = useState(null);

  const [userAnalytics, setUserAnalytics] = useState(null);
  const [loadingUserAnalytics, setLoadingUserAnalytics] = useState(true);
  const [errorUserAnalytics, setErrorUserAnalytics] = useState(null);

  const fetchAnalyticsData = useCallback(async () => {
    setLoadingTaskAnalytics(true);
    setLoadingUserAnalytics(true);
    setErrorTaskAnalytics(null);
    setErrorUserAnalytics(null);

    const authToken = localStorage.getItem("authtoken");

    if (!authToken) {
      const authError = new Error(
        "Authentication token not found. Please log in."
      );
      setErrorTaskAnalytics(authError);
      setErrorUserAnalytics(authError);
      setLoadingTaskAnalytics(false);
      setLoadingUserAnalytics(false);
      return;
    }

    const axiosInstance = axios.create({
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    try {
      const taskResponse = await axiosInstance.get(TASK_ANALYTICS_API_URL);
      setTaskAnalytics(taskResponse.data);
    } catch (err) {
      console.error("Error fetching task analytics:", err);

      setErrorTaskAnalytics(
        err.response
          ? new Error(
              `HTTP error! Status: ${err.response.status} for Task Analytics: ${err.response.statusText}`
            )
          : err
      );
    } finally {
      setLoadingTaskAnalytics(false);
    }

    try {
      const userResponse = await axiosInstance.get(USER_ANALYTICS_API_URL);
      setUserAnalytics(userResponse.data);
    } catch (err) {
      console.error("Error fetching user analytics:", err);

      setErrorUserAnalytics(
        err.response
          ? new Error(
              `HTTP error! Status: ${err.response.status} for User Analytics: ${err.response.statusText}`
            )
          : err
      );
    } finally {
      setLoadingUserAnalytics(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return {
    taskAnalytics,
    userAnalytics,
    loadingTaskAnalytics,
    loadingUserAnalytics,
    errorTaskAnalytics,
    errorUserAnalytics,
    fetchAnalyticsData,
  };
};

export default useDashboard;
