import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import PlantDetailsPage from "@/pages/PlantDetailsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import Profile from "@/pages/Profile";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/plant/:id" element={<PlantDetailsPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
