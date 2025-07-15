import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Chip,
  Card,
  CardContent,
} from "@mui/material";

import {
  PieChart,
  BarChart,
  ChartsTooltip,
  ChartsLegend,
  axisClasses,
} from "@mui/x-charts";
import useDashboardAnalytics from "../hooks/useDashboard";
import DashboardSkeleton from "../skeleton/DashboardSkeleton ";

const AnalyticsCard = ({ title, value, onClick, sx = {} }) => (
  <Grid item xs={12} sm={6} md={3} sx={{ mb: 2 }}>
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        textAlign: "center",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? { transform: "translateY(-2px)", boxShadow: 6 }
          : {},
        transition: "transform 0.2s, box-shadow 0.2s",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...sx,
      }}
      onClick={onClick}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "medium", color: "text.secondary", mb: 1 }}
      >
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
    </Paper>
  </Grid>
);

const taskStatusColors = [
  "#4CAF50",
  "#2196F3",
  "#FFC107",
  "#F44336",
  "#9E9E9E",
];
const taskPriorityColors = ["#F44336", "#FF9800", "#2196F3"];

function DashboardPage() {
  const {
    taskAnalytics,
    userAnalytics,
    loadingTaskAnalytics,
    loadingUserAnalytics,
    errorTaskAnalytics,
    errorUserAnalytics,
  } = useDashboardAnalytics();

  const total = userAnalytics?.admin + userAnalytics?.users;
  const [selectedChartType, setSelectedChartType] = React.useState(null);

  const isLoading = loadingTaskAnalytics || loadingUserAnalytics;
  const hasError = errorTaskAnalytics || errorUserAnalytics;

  const statusPieData = React.useMemo(() => {
    if (!taskAnalytics?.statusSummary) return [];
    return Object.entries(taskAnalytics.statusSummary)
      .filter(([, count]) => count > 0)
      .map(([status, count], index) => ({
        id: index,
        value: count,
        label:
          status.replace("-", " ").charAt(0).toUpperCase() +
          status.replace("-", " ").slice(1),
      }));
  }, [taskAnalytics]);

  const priorityPieData = React.useMemo(() => {
    if (!taskAnalytics?.prioritySummary) return [];
    return Object.entries(taskAnalytics.prioritySummary)
      .filter(([, count]) => count > 0)
      .map(([priority, count], index) => ({
        id: index,
        value: count,
        label: priority,
      }));
  }, [taskAnalytics]);

  const userBarChartData = React.useMemo(() => {
    if (!userAnalytics) return { series: [], xAxisLabels: [] };
    const categories = ["Users", "Admins"];
    const activeData = [userAnalytics.usersactive, userAnalytics.adminactive];
    const inactiveData = [
      userAnalytics.usersinactive,
      userAnalytics.admininactive,
    ];
    const totalData = [userAnalytics.users, userAnalytics.admin];

    return {
      series: [
        {
          data: activeData,
          label: "Active",
          color: "#4CAF50",
        },
        {
          data: inactiveData,
          label: "Inactive",
          color: "#F44336",
        },
        {
          data: totalData,
          label: "Total",
          color: "#2196F3",
        },
      ],
      xAxisLabels: categories,
    };
  }, [userAnalytics]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={4}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Dashboard Overview
        </Typography>
      </Stack>

      {isLoading && (
        <>
          <DashboardSkeleton />
        </>
      )}

      {hasError && !isLoading && (
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="h6">Failed to load dashboard data.</Typography>
          <Typography variant="body2">
            Please check your server connection or try refreshing.
          </Typography>
        </Alert>
      )}

      {!isLoading && !hasError && (
        <>
          <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
            <AnalyticsCard
              title="Total Tasks"
              value={taskAnalytics?.totalActiveTasks ?? "-"}
              onClick={() => setSelectedChartType("taskStatus")}
            />
            <AnalyticsCard
              title="Tasks Priority"
              value={taskAnalytics?.totalActiveTasks ?? "-"}
              onClick={() => setSelectedChartType("taskPriority")}
            />
            <AnalyticsCard
              title="Total Users"
              value={total ?? "-"}
              onClick={() => setSelectedChartType("userSummary")}
            />
          </Grid>

          {selectedChartType && (
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                mt: 4,
                position: "relative",
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ fontWeight: "medium", mb: 3 }}
              >
                {selectedChartType === "taskStatus" && "Task Status Breakdown"}
                {selectedChartType === "taskPriority" &&
                  "Task Priority Breakdown"}
                {selectedChartType === "userSummary" && "User & Admin Summary"}
              </Typography>

              <Box sx={{ height: 400, width: "100%" }}>
                {selectedChartType === "taskStatus" &&
                  statusPieData.length > 0 && (
                    <PieChart
                      series={[
                        {
                          data: statusPieData,
                          arcLabel: (item) => `${item.label} (${item.value})`,
                          outerRadius: 120,
                        },
                      ]}
                      colors={taskStatusColors}
                      tooltip={{ trigger: "item" }}
                      legend={{
                        hidden: false,
                        position: { vertical: "bottom", horizontal: "middle" },
                      }}
                    >
                      <ChartsTooltip />
                      <ChartsLegend />
                    </PieChart>
                  )}

                {selectedChartType === "taskPriority" &&
                  priorityPieData.length > 0 && (
                    <PieChart
                      series={[
                        {
                          data: priorityPieData,
                          arcLabel: (item) => `${item.label} (${item.value})`,
                          outerRadius: 120,
                        },
                      ]}
                      colors={taskPriorityColors}
                      tooltip={{ trigger: "item" }}
                      legend={{
                        hidden: false,
                        position: { vertical: "bottom", horizontal: "middle" },
                      }}
                    >
                      <ChartsTooltip />
                      <ChartsLegend />
                    </PieChart>
                  )}

                {selectedChartType === "userSummary" &&
                  userBarChartData.series.length > 0 && (
                    <BarChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: userBarChartData.xAxisLabels,
                        },
                      ]}
                      series={userBarChartData.series}
                      margin={{ top: 40, right: 30, left: 60, bottom: 80 }}
                      sx={{
                        [`.${axisClasses.left} .${axisClasses.label}`]: {
                          transform: "translate(-20px, 0)",
                        },
                        [`.${axisClasses.bottom} .${axisClasses.label}`]: {
                          transform: "translate(0, 10px)",
                        },
                      }}
                      slotProps={{
                        legend: {
                          direction: "row",
                          position: { vertical: "top", horizontal: "middle" },
                          padding: 0,
                        },
                      }}
                    >
                      <ChartsTooltip />
                      <ChartsLegend />
                    </BarChart>
                  )}
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}

export default DashboardPage;
