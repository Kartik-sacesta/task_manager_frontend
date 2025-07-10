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
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
 import { useNavigate } from 'react-router-dom';


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/user/login", {
                email,
                password,
            });
            toast.success("Login successful");
            localStorage.setItem("authtoken", res.data.token);
          navigate("/dashboard")
        } catch (e) {
            toast.error(
                e.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

  if (loading) {
    return (
      <>
        <h1>loading...</h1>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex" }} >
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
        }}
      >
        <img src="/src/assets/loginleft.png" />
      </Box>
              
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            width: "100%",
            p: 4,
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={1}>
            Sign In to your Account
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Welcome back! please enter your detail
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            my={1}
          >
            <FormControlLabel control={<Checkbox />} label="Remember me" />
            <Link href="#" variant="body2">
              Forgot Password?
            </Link>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 2, mb: 3 }}
            onClick={handleSubmit}
          >
            Sign In
          </Button>

          <Divider>Or sign in with</Divider>

          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <Button variant="outlined" startIcon={<GoogleIcon />}>
              Google
            </Button>
            <Button variant="outlined" startIcon={<GoogleIcon />}>
              Google
            </Button>
          </Stack>

          <Typography variant="body2" mt={3} textAlign="center">
            Don’t have an account? <Link href="#">Sign Up</Link>
          </Typography>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}
