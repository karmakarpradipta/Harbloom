import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManagePlants from "@/pages/admin/ManagePlants";
import AddPlant from "@/pages/admin/AddPlant";
import Families from "@/pages/admin/data/Families";
import Origins from "@/pages/admin/data/Origins";
import Habitats from "@/pages/admin/data/Habitats";
// import ChemicalConstituents from "@/pages/admin/data/ChemicalConstituents";
import ChemicalProfiles from "@/pages/admin/data/ChemicalProfiles";
import MedicinalProfiles from "@/pages/admin/data/MedicinalProfiles";
import DataEntryGuide from "@/pages/admin/DataEntryGuide";
import PlantParts from "@/pages/admin/data/PlantParts";
import CultivationProfiles from "@/pages/admin/data/CultivationProfiles";
import Tags from "@/pages/admin/data/Tags";
import { ExploreProvider } from "@/context/ExploreContext";

// Layout Wrapper for Explore Context
const ExploreLayout = () => {
  return (
    <ExploreProvider>
      <Outlet />
    </ExploreProvider>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Routes needing Explore Context */}
      <Route element={<ExploreLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/plant/:id" element={<PlantDetailsPage />} />
      </Route>

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Routes - Requires 'admin' role */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="plants" element={<ManagePlants />} />
          <Route path="add-plant" element={<AddPlant />} />

          {/* Data Management Routes */}
          <Route path="families" element={<Families />} />
          <Route path="origins" element={<Origins />} />
          <Route path="habitats" element={<Habitats />} />
          <Route path="chemical-profiles" element={<ChemicalProfiles />} />
          <Route path="medicinal-profiles" element={<MedicinalProfiles />} />
          <Route path="cultivation-data" element={<CultivationProfiles />} />
          <Route path="parts" element={<PlantParts />} />
          <Route path="tags" element={<Tags />} />

          <Route path="guide" element={<DataEntryGuide />} />

          <Route
            path="settings"
            element={<div className="p-4">Admin Settings (Coming Soon)</div>}
          />
          {/* Catch-all for /admin/* to debug 404s inside admin */}
          <Route
            path="*"
            element={
              <div className="p-8 text-center text-muted-foreground">
                Page not found in Admin (404)
              </div>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
