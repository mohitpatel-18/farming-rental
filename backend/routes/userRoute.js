// routes/userRoute.js
import express from "express";
const router = express.Router();

/**
 * GET /api/user/admin
 * A friendly message for browser GET access (debugging).
 */
router.get("/admin", (req, res) => {
  return res.status(200).json({ message: "This endpoint accepts POST for admin login. Use POST /api/user/admin" });
});

/**
 * POST /api/user/admin
 * Expect JSON body: { email: string, password: string }
 * Returns:
 *  - 400 if fields missing
 *  - 401 if credentials invalid
 *  - 200 with token if success (replace auth logic with real DB later)
 */
router.post("/admin", async (req, res) => {
  try {
    console.log("ROUTE /api/user/admin POST - body:", req.body);
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    // TODO: Replace with your DB lookup and password check
    // Example dummy check for testing:
    if (email === "mohitpatelpip06@gmail.com" && password === "yourpassword") {
      return res.status(200).json({ message: "Login success", token: "FAKE_TEST_TOKEN" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error in /api/user/admin:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
