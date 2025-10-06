import { Router } from "express";
import bcrypt from "bcrypt";
import { authenticateUser } from "../auth";
import { userService } from "../services";
import { generateToken } from "../utils/auth";

const router = Router();

router.get("/", async (req, res) => {
  if (!req.currentStore) {
    return res.status(404).json({ error: "Store not found" });
  }

  res.json({
    id: req.currentStore.id,
    name: req.currentStore.name,
    slug: req.currentStore.slug,
    welcome_message: req.currentStore.welcome_message,
    theme: req.currentStore.theme,
  });
});

router.post("/signup", async (req, res) => {
  if (!req.currentStore) {
    return res.status(404).json({ error: "Store not found" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await userService.createUser(
      email,
      password,
      req.currentStore.id,
    );

    const token = generateToken(user.id, user.store_id);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user.id, email: user.email, store_id: user.store_id },
    });
  } catch (error: any) {
    //duplicate email error code
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "Email already exists in this store" });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  if (!req.currentStore) {
    return res.status(404).json({ error: "Store not found" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await userService.getUserByEmailAndStore(
      email,
      req.currentStore.id,
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.store_id);

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, store_id: user.store_id },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/profile", authenticateUser, async (req, res) => {
  if (!req.userId || !req.storeId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const user = await userService.getUserByIdAndStore(req.userId, req.storeId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      store_id: user.store_id,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

export default router;
