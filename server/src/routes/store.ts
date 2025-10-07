import { Router } from "express";
import bcrypt from "bcrypt";
import { authenticateUser } from "../auth";
import { userService } from "../services";
import { generateToken } from "../utils/auth";
import { signupSchema, SignupRequest } from "../validation/signup";
import { loginSchema, LoginRequest } from "../validation/login";
import { validate } from "../validation/middleware";
import { sendSuccess, sendError } from "../utils/responseHandler";

const router = Router();

router.get("/", async (req, res) => {
  if (!req.currentStore) {
    return sendError(res, "Store not found", "STORE_NOT_FOUND", 404);
  }

  return sendSuccess(res, {
    id: req.currentStore.id,
    name: req.currentStore.name,
    slug: req.currentStore.slug,
    welcome_message: req.currentStore.welcome_message,
    theme: req.currentStore.theme,
  }, "Store retrieved successfully");
});

router.post("/signup", validate(signupSchema), async (req, res) => {
  if (!req.currentStore) {
    return sendError(res, "Store not found", "STORE_NOT_FOUND", 404);
  }

  const { email, password } = req.body;

  try {
    const user = await userService.createUser(
      email,
      password,
      req.currentStore.id,
    );

    const token = generateToken(user.id, user.store_id);

    return sendSuccess(res, {
      token,
      user: { id: user.id, email: user.email, store_id: user.store_id },
    }, "User created successfully", 201);
  } catch (error: any) {
    //duplicate email error code
    if (error.code === "23505") {
      return sendError(res, "Email already exists in this store", "EMAIL_EXISTS", 409);
    }
    return sendError(res, "Failed to create user", "CREATE_USER_ERROR", 500);
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  if (!req.currentStore) {
    return sendError(res, "Store not found", "STORE_NOT_FOUND", 404);
  }

  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmailAndStore(
      email,
      req.currentStore.id,
    );

    if (!user) {
      return sendError(res, "Invalid credentials", "INVALID_CREDENTIALS", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return sendError(res, "Invalid credentials", "INVALID_CREDENTIALS", 401);
    }

    const token = generateToken(user.id, user.store_id);

    return sendSuccess(res, {
      token,
      user: { id: user.id, email: user.email, store_id: user.store_id },
    }, "Login successful");
  } catch (error) {
    return sendError(res, "Login failed", "LOGIN_ERROR", 500);
  }
});

router.get("/profile", authenticateUser, async (req, res) => {
  if (!req.userId || !req.storeId) {
    return sendError(res, "Authentication required", "AUTH_REQUIRED", 401);
  }

  try {
    const user = await userService.getUserByIdAndStore(req.userId, req.storeId);

    if (!user) {
      return sendError(res, "User not found", "USER_NOT_FOUND", 404);
    }

    return sendSuccess(res, {
      id: user.id,
      email: user.email,
      store_id: user.store_id,
    }, "User profile retrieved successfully");
  } catch (error) {
    return sendError(res, "Failed to fetch user profile", "FETCH_PROFILE_ERROR", 500);
  }
});

export default router;
