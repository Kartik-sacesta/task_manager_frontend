import React from "react"; // Changed from 'React.useState' to use destructuring
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  CircularProgress,
  IconButton,
  Stack,
 
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment"; 
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete"; // Added for delete button
import axios from "axios";
import { format } from "date-fns"; // For formatting comment dates

function TaskCommentsModal({ open, onClose, taskId, showSnackbar }) {
  const [comments, setComments] = React.useState([]);
  const [newCommentText, setNewCommentText] = React.useState("");
  const [loadingComments, setLoadingComments] = React.useState(false);
  const [submittingComment, setSubmittingComment] = React.useState(false);
  const [deletingCommentId, setDeletingCommentId] = React.useState(null);

  const fetchComments = React.useCallback(async () => {
    if (!taskId) return;
    setLoadingComments(true);
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.get(
        `http://localhost:5000/taskcomments/${taskId}`, // Endpoint to get comments for a specific task
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Assuming response.data is an array of comments
      if (response.status === 200) {
        setComments(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      showSnackbar("Failed to fetch comments", "error");
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }, [taskId, showSnackbar]);

  React.useEffect(() => {
    if (open) {
      fetchComments();
    } else {
      // Clear comments and new comment text when modal closes
      setComments([]);
      setNewCommentText("");
    }
  }, [open, fetchComments]);

  const handleSubmitComment = async () => {
    if (!newCommentText.trim()) {
      showSnackbar("Comment cannot be empty", "warning");
      return;
    }
    setSubmittingComment(true);
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.post(
        `http://localhost:5000/taskcomments/${taskId}`, 
        { comments: newCommentText }, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        showSnackbar("Comment added successfully!");
        setNewCommentText(""); // Clear input field
        fetchComments(); // Refresh the list of comments
      } else {
        throw new Error(response.data?.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      showSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to add comment",
        "error"
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;

    setDeletingCommentId(commentId);
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.delete(
        `http://localhost:5000/taskcomments/${commentId}`, // Endpoint to delete a specific comment
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        showSnackbar("Comment deleted successfully!");
        fetchComments(); // Refresh comments list
      } else {
        throw new Error(response.data?.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      showSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete comment",
        "error"
      );
    } finally {
      setDeletingCommentId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      // Use date-fns for consistent formatting
      return format(new Date(dateString), "dd LLL yyyy, hh:mm a");
    } catch {
      return dateString; // Fallback if date-fns fails
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Comments for Task ID: {taskId}</Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {loadingComments ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress />
          </Box>
        ) : comments.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
            No comments yet. Be the first to add one!
          </Typography>
        ) : (
          <List sx={{ maxHeight: 300, overflow: "auto", pb: 1 }}>
            {comments.map((comment) => (
              <React.Fragment key={comment._id || comment.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{ display: "block", fontWeight: "bold" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {comment.user ? comment.user.username : "Anonymous"}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "block" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {comment.comment} {/* Assuming comment text is 'comment' field */}
                        </Typography>
                        <Typography
                          sx={{ display: "block" }}
                          component="span"
                          variant="caption"
                          color="text.disabled"
                        >
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete comment"
                    onClick={() => handleDeleteComment(comment._id || comment.id)}
                    disabled={deletingCommentId === (comment._id || comment.id)}
                    sx={{
                      ml: 1,
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "error.contrastText",
                      },
                    }}
                  >
                    {deletingCommentId === (comment._id || comment.id) ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
        <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            fullWidth
            label="Add a new comment"
            multiline
            rows={2}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            disabled={submittingComment}
          />
          <Button
            variant="contained"
            onClick={handleSubmitComment}
            disabled={submittingComment}
            sx={{ flexShrink: 0, height: "fit-content" }}
            startIcon={submittingComment ? null : <AddCommentIcon />}
          >
            {submittingComment ? <CircularProgress size={24} color="inherit" /> : "Post"}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskCommentsModal;