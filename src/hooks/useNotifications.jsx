// useNotifications.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  isPast,
  parseISO,
  isToday,
  isThisWeek,
  startOfWeek,
  addWeeks,
  endOfDay,
} from "date-fns";

const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    today: [],
    thisWeek: [],
    nextWeek: [],
    pastDue: [],
    completed: [],
    inProgress: [],
    pending: [],
    all: [],
  });
  const [notificationCounts, setNotificationCounts] = useState({
    today: 0,
    thisWeek: 0,
    nextWeek: 0,
    pastDue: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    all: 0,
  });
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.get("http://localhost:5000/task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const allFetchedTasks = Array.isArray(response.data)
          ? response.data
          : [];
        const now = new Date();

        const todayTasks = [];
        const thisWeekTasks = [];
        const nextWeekTasks = [];
        const pastDueTasks = [];
        const completedTasks = [];
        const inProgressTasks = [];
        const pendingTasks = [];
        const allRelevantTasks = []; 
        const startOfNextWeek = startOfWeek(addWeeks(now, 1), {
          weekStartsOn: 1, 
        });
        const endOfNextWeek = endOfDay(addWeeks(startOfNextWeek, 6)); 

        allFetchedTasks.forEach((task) => {
          const deadlineDate = task.expiredDate || task.expried_date;

          
          if (task.status === "completed") {
            completedTasks.push(task);
          } else if (task.status === "in-progress") {
            inProgressTasks.push(task);
          } else if (task.status === "pending") {
            pendingTasks.push(task);
          }

          
          if (task.status !== "completed") {
            allRelevantTasks.push(task); 

            if (!deadlineDate) {
              return; 
            }

            const parsedDeadline = parseISO(deadlineDate);

            if (isPast(parsedDeadline) && !isToday(parsedDeadline)) {
              pastDueTasks.push(task);
            } else if (isToday(parsedDeadline)) {
              todayTasks.push(task);
            } else if (isThisWeek(parsedDeadline, { weekStartsOn: 1 })) {
              thisWeekTasks.push(task);
            } else if (
              parsedDeadline >= startOfNextWeek &&
              parsedDeadline <= endOfNextWeek
            ) {
              nextWeekTasks.push(task);
            }
          }
        });

        const sortTasks = (tasks) =>
          tasks.sort((a, b) => {
            const dateA = parseISO(a.expiredDate || a.expried_date);
            const dateB = parseISO(b.expiredDate || b.expried_date);
            return dateA.getTime() - dateB.getTime();
          });

        const sortedToday = sortTasks(todayTasks);
        const sortedThisWeek = sortTasks(thisWeekTasks);
        const sortedNextWeek = sortTasks(nextWeekTasks);
        const sortedPastDue = sortTasks(pastDueTasks);
        const sortedCompleted = sortTasks(completedTasks);
        const sortedInProgress = sortTasks(inProgressTasks);
        const sortedPending = sortTasks(pendingTasks);
        const sortedAllRelevant = sortTasks(allRelevantTasks);

        setNotifications({
          today: sortedToday,
          thisWeek: sortedThisWeek,
          nextWeek: sortedNextWeek,
          pastDue: sortedPastDue,
          completed: sortedCompleted,
          inProgress: sortedInProgress,
          pending: sortedPending,
          all: sortedAllRelevant, 
        });

        setNotificationCounts({
          today: sortedToday.length,
          thisWeek: sortedThisWeek.length,
          nextWeek: sortedNextWeek.length,
          pastDue: sortedPastDue.length,
          completed: sortedCompleted.length,
          inProgress: sortedInProgress.length,
          pending: sortedPending.length,
          all: sortedAllRelevant.length,
        });
      } else {
        throw new Error("Failed to fetch tasks.");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch tasks."
      );
      setNotifications({
        today: [],
        thisWeek: [],
        nextWeek: [],
        pastDue: [],
        completed: [],
        inProgress: [],
        pending: [],
        all: [],
      });
      setNotificationCounts({
        today: 0,
        thisWeek: 0,
        nextWeek: 0,
        pastDue: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        all: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000); 
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  return { loading, notifications, notificationCounts, error, fetchNotifications };
};

export default useNotifications;