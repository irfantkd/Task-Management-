import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usePostMutation } from "../service/apiService";
import { logout } from "../features/authSlice";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [verifyTokenAPI] = usePostMutation();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        dispatch(logout());
        navigate("/auth/login", { replace: true });
        return;
      }

      try {
        const response = await verifyTokenAPI({
          path: "/auth/verify",
          body: { token },
        });

        if (response?.data?.error) {
          throw new Error("Invalid token");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        dispatch(logout());
        navigate("/auth/login", { replace: true });
      }
    };

    verifyToken();
  }, [token, dispatch, navigate, verifyTokenAPI]);

  // if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
