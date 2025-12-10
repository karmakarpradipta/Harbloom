import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import { client } from "@/lib/appwrite";
import { checkAuth } from "@/store/slices/authSlice";
import { Toaster } from "sonner";

const App = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Check initial authentication status
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
