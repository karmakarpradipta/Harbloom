import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  updateUserName,
  updateUserPassword,
  updateUserAvatar,
  removeUserAvatar,
  logoutUser,
  sendEmailVerification,
} from "@/store/slices/authSlice";
import { deleteFileFromUploadcare, extractUuidFromUrl } from "@/lib/uploadcare";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Lock,
  Mail,
  Shield,
  Key,
  Camera,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import UploadcareWrapper from "@/components/common/UploadcareWrapper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "motion/react";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  // Account State
  const [name, setName] = useState(user?.name || "");

  // Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserName({ name })).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      await dispatch(
        updateUserPassword({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        })
      ).unwrap();

      toast.success("Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-background pb-10">
      {/* Hero Header */}
      <div className="bg-primary/10 dark:bg-card border-b border-border dark:border-border/60">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background dark:border-card shadow-xl ring-2 ring-primary/20">
                <AvatarImage
                  src={
                    user?.prefs?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`
                  }
                  alt={user?.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="dark:text-foreground">
                      Upload Avatar
                    </DialogTitle>
                    <DialogDescription>
                      Select an image to upload as your profile picture.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center p-4">
                    <UploadcareWrapper
                      onUploadSuccess={async (fileInfo) => {
                        // Delete old avatar if exists
                        if (user?.prefs?.avatar) {
                          const oldUuid = extractUuidFromUrl(user.prefs.avatar);
                          if (oldUuid) {
                            await deleteFileFromUploadcare(oldUuid);
                          }
                        }
                        dispatch(
                          updateUserAvatar({ avatarUrl: fileInfo.cdnUrl })
                        );
                      }}
                    />
                  </div>
                  {user?.prefs?.avatar && (
                    <div className="flex justify-center pb-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to remove your profile photo?"
                            )
                          ) {
                            const oldUuid = extractUuidFromUrl(
                              user.prefs.avatar
                            );
                            if (oldUuid) {
                              await deleteFileFromUploadcare(oldUuid);
                            }
                            dispatch(removeUserAvatar());
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Current Photo
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif">
                {user?.name || "Welcome Back"}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-background/50 dark:bg-muted/50 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-border/50">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </span>
                {user?.prefs?.role && (
                  <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium capitalize">
                    <Shield className="h-3.5 w-3.5" />
                    {user.prefs.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl -mt-4">
        <Tabs
          defaultValue="account"
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full md:w-64 shrink-0 space-y-4"
          >
            <div className="bg-card dark:bg-card/50 rounded-xl border shadow-sm p-4">
              <h3 className="font-semibold text-lg mb-4 px-2 text-foreground">
                Settings
              </h3>
              <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-1">
                <TabsTrigger
                  value="account"
                  className="w-full justify-start px-3 py-2 font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted/50 transition-all rounded-md"
                >
                  <User className="mr-3 h-4 w-4" />
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="w-full justify-start px-3 py-2 font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted/50 transition-all rounded-md"
                >
                  <Shield className="mr-3 h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              <div className="my-2 border-t border-border/50" />

              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 font-medium text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
                onClick={async () => {
                  try {
                    await dispatch(logoutUser()).unwrap();
                  } catch (err) {
                    toast.error("Failed to log out");
                  }
                }}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Log out
              </Button>
            </div>

            <div className="bg-card rounded-xl border shadow-sm p-5 space-y-4 hidden md:block">
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-medium text-sm text-primary mb-1">
                  Pro Tip
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Keeping your profile updated helps us provide personalized
                  recommendations for your gardening journey.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex-1"
          >
            <TabsContent value="account" className="mt-0 space-y-6">
              <Card className="shadow-sm border-border/60">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                  <CardTitle className="text-xl">Profile Details</CardTitle>
                  <CardDescription>
                    Manage your public profile information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <form onSubmit={handleUpdateName} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2.5">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Full Name
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 h-10 bg-background"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            value={user?.email || ""}
                            disabled
                            className="pl-10 h-10 bg-muted/50 font-mono text-sm text-muted-foreground shadow-none cursor-not-allowed"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {user?.emailVerification ? (
                            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-200 dark:border-green-900">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-900">
                                <AlertCircle className="h-3 w-3" />
                                Unverified
                              </div>
                              <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-xs text-primary"
                                onClick={async () => {
                                  try {
                                    await dispatch(
                                      sendEmailVerification()
                                    ).unwrap();
                                    toast.success("Verification email sent!");
                                  } catch (err) {
                                    toast.error(err || "Failed to send email");
                                  }
                                }}
                              >
                                Verify Email
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2 border-t border-border/50 mt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="px-6 min-w-[120px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card className="shadow-sm border-border/60">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                  <CardTitle className="text-xl">Password & Security</CardTitle>
                  <CardDescription>
                    Ensure your account stays secure by updating your password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form
                    onSubmit={handleUpdatePassword}
                    className="space-y-6 max-w-lg"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">Current Password</Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="oldPassword"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                oldPassword: e.target.value,
                              })
                            }
                            className="pl-10 h-10 bg-background"
                            required
                            placeholder="Enter current password"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="pl-10 h-10 bg-background"
                            required
                            minLength={8}
                            placeholder="Min. 8 characters"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="pl-10 h-10 bg-background"
                            required
                            minLength={8}
                            placeholder="Re-enter new password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-border/50 mt-6">
                      <Button
                        type="submit"
                        disabled={loading}
                        variant="destructive"
                        className="px-6 shadow-lg shadow-destructive/20 hover:shadow-destructive/30 transition-all"
                      >
                        {loading ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
