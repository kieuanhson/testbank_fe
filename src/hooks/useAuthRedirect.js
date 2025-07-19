import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Redirects to /app if a token exists in localStorage and not already on /app
 */
const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    } else if (
      token &&
      !location.pathname.startsWith("/app") &&
      location.pathname !== "/test"
    ) {
      navigate("/app", { replace: true });
    }
  }, [navigate, location]);
};

export default useAuthRedirect;
