import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
  completeEmailVerification,
  clearMessage,
  clearError,
} from "@/store/slices/authSlice";
import { motion } from "motion/react";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error, message } = useSelector((state) => state.auth);

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    if (userId && secret) {
      dispatch(completeEmailVerification({ userId, secret }));
    }
  }, [userId, secret, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearMessage());
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleContinue = () => {
    navigate("/home");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/60 shadow-xl text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : error ? (
                <XCircle className="h-10 w-10 text-destructive" />
              ) : (
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {loading
                ? "Verifying Email..."
                : error
                ? "Verification Failed"
                : "Email Verified!"}
            </CardTitle>
            <CardDescription>
              {loading
                ? "Please wait while we verify your email address."
                : error
                ? error
                : "Your email address has been successfully verified. You can now continue to explore Harbloom."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!loading && (
              <Button onClick={handleContinue} className="w-full">
                Continue to App
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
