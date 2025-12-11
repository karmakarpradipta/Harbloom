import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check for roles if specified
  if (allowedRoles.length > 0) {
    // Appwrite user labels are the primary source.
    const labels = user?.labels || [];
    console.log("hello");

    // Fallback: Check 'prefs' in case labels are hidden on client-side
    const prefsRole = user?.prefs?.role;
    const prefsRoles = user?.prefs?.roles || [];

    // Combine all potential user roles/markers
    const allUserRoles = [
      ...labels,
      ...(prefsRole ? [prefsRole] : []),
      ...(Array.isArray(prefsRoles) ? prefsRoles : []),
    ].map((r) => String(r).toLowerCase());

    const hasRole = allowedRoles.some((role) =>
      allUserRoles.includes(String(role).toLowerCase())
    );

    if (!hasRole) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-muted/20">
          <h1 className="text-4xl font-bold text-destructive">403</h1>
          <p className="text-xl text-muted-foreground mt-2">Access Denied</p>
          <p className="text-sm text-muted-foreground mt-1 px-4 text-center">
            User has no matching permissions. Required:{" "}
            <strong>{allowedRoles.join(", ")}</strong>.
          </p>
          <p className="text-xs text-muted-foreground mt-4 px-4 text-center max-w-lg">
            <strong>Troubleshooting:</strong>
            <br />
            1. Ensure your account has the "admin" <strong>Label</strong> in
            Appwrite Console.
            <br />
            2. If Labels are set but not working, try adding{" "}
            <code>role: "admin"</code> to your <strong>User Preferences</strong>
            .<br />
            3. Log out and log back in to refresh your session.
          </p>
          <a href="/home" className="mt-6 text-primary hover:underline">
            Go Home
          </a>
        </div>
      );
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
