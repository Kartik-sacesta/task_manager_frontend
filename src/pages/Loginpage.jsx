import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
  Link,
  Stack,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isAdminLogin
        ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/adminlogin`
        : `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/login`;

      const res = await axios.post(endpoint, {
        email,
        password,
      });

      toast.success("Login successful");
      localStorage.setItem("authtoken", res.data.token);
      localStorage.setItem("userdata", JSON.stringify(res.data.user));
      window.location.href = "/";
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const idToken = await user.getIdToken();

      const backendResponse = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/google-login`,
        {
          idToken,
        }
      );

      toast.success(
        "Google login successful! Welcome, " + backendResponse.data.user.name
      );
      localStorage.setItem("authtoken", backendResponse.data.token);
      localStorage.setItem(
        "userdata",
        JSON.stringify(backendResponse.data.user)
      );
      window.location.href = "/";
    } catch (error) {
      console.error("Google login error:", error);
      let errorMessage = "Google login failed. Please try again.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Google login popup closed.";
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
      className="login-container"
    >
      <Box
        sx={{
          flex: 1,
          background: "linear-gradient(135deg, #050a2c, #0a1a4e)",
          color: "#fff",
          padding: "2rem",
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
        }}
        className="login-leftside"
      >
        <Box className="welcome" sx={{ maxWidth: 360 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            mb={1}
            sx={{ fontSize: "2.5rem", lineHeight: 1.2 }}
            className="title"
          >
            Sign In to your Account
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1rem", opacity: 0.85, lineHeight: 1.6 }}
            className="summary"
          >
            Welcome back! please enter your detail
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          background: "#fff",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
        className="form-area"
      >
        <Box
          sx={{
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
            padding: "1rem",
          }}
          className="form-wrap"
        >
          <Box
            className="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.375rem",
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&.Mui-focused fieldset": {
                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                    borderColor: "transparent",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                },
                "& .MuiInputLabel-root": {
                  color: "#374151",
                  fontSize: "0.875rem",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#6b7280" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.375rem",
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&.Mui-focused fieldset": {
                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                    borderColor: "transparent",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                },
                "& .MuiInputLabel-root": {
                  color: "#374151",
                  fontSize: "0.875rem",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#6b7280" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="toggle password visibility"
                      sx={{ color: "#6b7280" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            my={1}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAdminLogin}
                  onChange={(e) => setIsAdminLogin(e.target.checked)}
                  sx={{
                    color: "#6b7280",
                    "&.Mui-checked": {
                      color: "#3b82f6",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#4b5563" }}>
                  Login as Admin
                </Typography>
              }
            />
            <Link
              href="#"
              variant="body2"
              sx={{
                fontSize: "0.875rem",
                color: "#6b7280",
                textAlign: "right",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                  color: "#3b82f6",
                },
              }}
              className="forgot link"
            >
              Forgot Password?
            </Link>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              mb: 1, // Reduced margin to add Google button below
              padding: "0.75rem",
              backgroundColor: "#111827",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 500,
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "#1f2937",
              },
            }}
            onClick={handleSubmit}
            disabled={loading || googleLoading} // Disable if either is loading
            className="btn"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

      
          <Button
            fullWidth
            variant="outlined" // Use outlined variant for Google button
            size="large"
            sx={{
              mt: 1, // Margin top to separate from regular sign-in button
              padding: "0.75rem",
              borderColor: "#d1d5db", // Border color for outlined button
              color: "#4b5563", // Text color
              fontSize: "1rem",
              fontWeight: 500,
              borderRadius: "0.375rem",
              cursor: "pointer",
              transition: "background-color 0.2s ease, border-color 0.2s ease",
              "&:hover": {
                backgroundColor: "#f3f4f6", // Light background on hover
                borderColor: "#9ca3af", // Darker border on hover
              },
            }}
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading} // Disable if either is loading
            startIcon={googleLoading ? null : <GoogleIcon />} // Show icon only when not loading
            className="btn-google"
          >
            {googleLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In with Google"
            )}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography
              variant="body2"
              color="#4b5563"
              className="signup-prompt"
            >
              Don't have an account?{" "}
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#3b82f6",
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                className="link"
              >
                Sign Up
              </Link>
            </Typography>
          </Divider>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}
