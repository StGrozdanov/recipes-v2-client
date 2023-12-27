import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * hook that gives access to the auth context
 */
export const useAuthContext = () => useContext(AuthContext);