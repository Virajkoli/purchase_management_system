const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const superadminRoutes = require("./routes/superadmin");
// const { createSuperadmin } = require('./controllers/superadminController');
const rolePermissions = require("./controllers/rolePermissions");
const authenticate = require("./middlewares/authMiddleware");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/superadmin", superadminRoutes);

// createSuperadmin();

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/dashboards/superadmin", authenticate, (req, res) => {
  res.render("dashboards/superadmin");
});

app.get("/add-admin", authenticate, (req, res) => {
  res.render("superAdmin/createUser");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.get("/login-role", (req, res) => {
  const { role } = req.query;
  if (!role) {
    return res.status(400).send("Role is required!");
  }

  // Render the login form based on the role
  res.render("auth/login", { role });
});

app.get("/login-superadmin", (req, res) => {
  res.render("auth/login-superadmin");
});

app.get("/user-list", authenticate, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});
    // Render the user list page with the users data
    res.render("superAdmin/userList", { users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

// Handling login for regular users (by role)
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("User not found");
  }

  // Check if role matches the user’s role
  if (user.role.name !== role) {
    return res.status(403).send("You are not authorized for this role");
  }

  // Validate password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).send("Invalid credentials");
  }

  // Generate a JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Set the token in cookie and redirect to dashboard
  res.cookie("token", token, { httpOnly: true });
  res.redirect(`/admin/dashboard`);
});

// Handling superadmin login
app.post("/login-superadmin", async (req, res) => {
  const { email, password } = req.body;

  // Check if superadmin exists
  const superadmin = await User.findOne({
    email: "superadmin@purchase.com",
    role: "Superadmin",
  });
  if (!superadmin) {
    return res.status(400).send("Superadmin not found");
  }

  // Validate password
  const match = await bcrypt.compare(password, superadmin.password);
  if (!match) {
    return res.status(400).send("Invalid credentials");
  }

  // Generate a JWT token for superadmin
  const token = jwt.sign(
    { userId: superadmin._id, role: superadmin.role.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Set the token in cookie and redirect to superadmin dashboard
  res.cookie("token", token, { httpOnly: true });
  res.redirect("dashboards/superadmin");
});

app.post("/create-user", authenticate, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Get permissions for the selected role
    const permissions = rolePermissions[role] || [];

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      permissions,
    });

    await user.save();
    res.redirect("/user-list"); // Redirect to user list or dashboard
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});