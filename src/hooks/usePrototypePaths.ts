import { useLocation } from "react-router-dom";
import { getVersionFromPath, prototypePaths } from "../routes/paths";

export function usePrototypePaths() {
  const { pathname } = useLocation();
  return prototypePaths(getVersionFromPath(pathname));
}

export function usePrototypeVersion() {
  const { pathname } = useLocation();
  return getVersionFromPath(pathname);
}
