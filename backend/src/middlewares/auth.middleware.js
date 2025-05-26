import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "../utils/firebaseAdmin.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Missing or malformed token");
    }

    // Extract token after "Bearer "
const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError(401, "Token is required");
    }

    console.log("Token: ", token);

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    console.log(decodedToken);
    if (!decodedToken) {
      throw new ApiError(401, "Invalid token");
    }

    if (!decodedToken.email_verified) {
      throw new ApiError(401, "Email not verified");
    }

    // IMPORTANT: Await this!
    const user = await auth.getUser(decodedToken.uid);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user; // attach user info to request
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
