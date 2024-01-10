import { useContext } from "react";
import { BlockedContext } from "../contexts/BlockedContext";

/**
 * hook that gives access to the auth context
 */
export const useBlockedContext = () => useContext(BlockedContext);