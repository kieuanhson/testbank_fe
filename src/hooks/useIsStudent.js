import { useMemo } from "react";

/**
 * useIsStudent - Returns boolean if 'isStudent' in localStorage is truthy
 */
const useIsStudent = () => {
  return useMemo(() => {
    const value = localStorage.getItem("isStudent");
    return value === "true";
  }, []);
};

export default useIsStudent;
