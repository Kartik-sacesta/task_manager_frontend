import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "urgent", label: "Urgent" },
];

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    onCreateTask,
    priorityFilter,
    onPriorityFilterChange,
    subCategories,
    taskTitleSearchTerm,
    onTaskTitleSearchChange,
    subCategorySearchTerm,
    onSubCategorySearchChange,
    tasks,
  } = props;

  const taskTitleOptions = React.useMemo(() => {
    return Array.isArray(tasks)
      ? tasks.map((task) => ({ id: task.id, name: task.title }))
      : [];
  }, [tasks]);

  const subCategoryOptions = React.useMemo(() => {
    return Array.isArray(subCategories)
      ? subCategories.map((subCat) => ({
          id: subCat.id,
          name: subCat.name,
          categoryId: subCat.category_id,
        }))
      : [];
  }, [subCategories]);

  const handlePriorityChange = (event) => {
    const value = event.target.value;
    const newValue = typeof value === "string" ? value.split(",") : value;
    onPriorityFilterChange(newValue);
  };

  const renderSelectedValues = (selected) => {
    if (!selected || selected.length === 0) {
      return <em>All Priorities</em>;
    }

    if (selected.length === priorityOptions.length) {
      return <em>All Priorities</em>;
    }

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {selected.map((value) => {
          const option = priorityOptions.find((opt) => opt.value === value);
          return (
            <Chip
              key={value}
              label={option?.label || value}
              size="small"
              variant="outlined"
            />
          );
        })}
      </Box>
    );
  };

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Tasks
        </Typography>
      )}

      <Autocomplete
        freeSolo
        disablePortal
        id="task-title-search"
        options={taskTitleOptions}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        value={null}
        onChange={(event, newValue) => {
          onTaskTitleSearchChange(newValue);
        }}
        inputValue={taskTitleSearchTerm || ""}
        onInputChange={(event, newInputValue) => {
          onTaskTitleSearchChange(newInputValue || "");
        }}
        filterOptions={(options, { inputValue }) => {
          if (!inputValue) return [];
          return options.filter((option) =>
            option.name.toLowerCase().includes(inputValue.toLowerCase())
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Task Title"
            variant="outlined"
            size="small"
            sx={{ m: 1, minWidth: 200 }}
            placeholder="Type to search tasks..."
          />
        )}
      />

      <Autocomplete
        freeSolo
        disablePortal
        id="sub-category-search"
        options={subCategoryOptions}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        value={null}
        onChange={(event, newValue) => {
          onSubCategorySearchChange(newValue);
        }}
        inputValue={subCategorySearchTerm || ""}
        onInputChange={(event, newInputValue) => {
          onSubCategorySearchChange(newInputValue || "");
        }}
        filterOptions={(options, { inputValue }) => {
          if (!inputValue) return [];
          return options.filter((option) =>
            option.name.toLowerCase().includes(inputValue.toLowerCase())
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search SubCategory"
            variant="outlined"
            size="small"
            sx={{ m: 1, minWidth: 200 }}
            placeholder="Type to search subcategories..."
          />
        )}
      />

      <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
        <InputLabel id="priority-filter-label">Priority</InputLabel>
        <Select
          labelId="priority-filter-label"
          id="priority-filter-select"
          value={priorityFilter || []}
          label="Priority"
          onChange={handlePriorityChange}
          multiple
          renderValue={renderSelectedValues}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250,
              },
            },
          }}
        >
          {priorityOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip title="Create Task">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateTask}
          sx={{ m: 1, minWidth: 200 }}
          size="small"
        >
          Create Task
        </Button>
      </Tooltip>
    </Toolbar>
  );
}

export default EnhancedTableToolbar;
