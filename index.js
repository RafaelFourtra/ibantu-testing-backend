const express = require("express");
const cors = require("cors");
const path = require("path");
// require("dotenv").config();
const {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole,
} = require("./controller/userController");

const {
  registerUser,
  registerUserByGoogle,
  loginUser,
  logoutUser,
  resetPassword,
  onAuthStateChange,
  getCurrentUser,
} = require("./controller/authentication");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.post("/api/users", async (req, res) => {
  try {
    const userId = await addUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    await updateUser(req.params.id, req.body);
    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Routes untuk Authentication
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, type } = req.body;
    const user = await registerUser(email, password, type);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/auth/google-register", async (req, res) => {
  try {
    const { email, googleId, type } = req.body;
    const user = await registerUserByGoogle(email, googleId, type);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        uid: user.uid,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.json({
      success: true,
      message: "Login successful",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  try {
    await logoutUser();
    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    await resetPassword(email);
    res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
