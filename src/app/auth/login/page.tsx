"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api_client";
import api_endpoints from "@/hooks/api_endpoints";

const NotificationModal = ({
  type,
  title,
  message,
  show,
  onClose,
}: {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  show: boolean;
  onClose: () => void;
}) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "error":
        return <XCircle className="w-12 h-12 text-red-500" />;
      case "info":
        return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          button: "bg-green-600 hover:bg-green-700",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          button: "bg-red-600 hover:bg-red-700",
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          button: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={type !== "info" ? onClose : undefined}
      />

      <div
        className={`relative rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 ${colors.border}`}
      >
        {type !== "info" && (
          <button
            onClick={onClose}
            className="absolute text-gray-400 transition-colors top-4 right-4 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className={`p-8 rounded-xl ${colors.bg}`}>
          <div className="text-center">
            <div className="flex justify-center mb-4">{getIcon()}</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p className="leading-relaxed text-gray-700">{message}</p>
          </div>
        </div>

        {/* {type !== "info" && (
          <div className="p-6 bg-white rounded-b-xl">
            <Button
              onClick={onClose}
              className={`w-full ${colors.button} text-white`}
            >
              OK
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message: string;
    show: boolean;
  }>({
    type: "info",
    title: "",
    message: "",
    show: false,
  });

  const router = useRouter();
  // notification helper.
  const showNotification = (
    type: "success" | "error" | "info",
    title: string,
    message: string
  ) => {
    setNotification({ type, title, message, show: true });

    if (type !== "info") {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showNotification(
        "error",
        "Missing Information",
        "Please enter both email and password."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification(
        "error",
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Login request
      const response = await api.post(api_endpoints.LOGIN, {
        email,
        password,
      });
      const data = response.data || response;

      // console.log("Login response:", data);

      if (data.access_token) {
        // Store token and email
        if (typeof window !== "undefined") {
          sessionStorage.setItem("RSEmail", email);
          sessionStorage.setItem("RSToken", data.access_token);
          if (data.user) {
            sessionStorage.setItem("RSUser", JSON.stringify(data.user));
          }
        }

        closeNotification();

        // Check user role
        const userRole = data.user?.role;

        // Handle admin users
        if (userRole && userRole.toLowerCase() === "admin") {
          if (data.access_token && typeof window !== "undefined") {
            localStorage.setItem("adminToken", data.access_token);
            localStorage.setItem("isAdminLoggedIn", "true");
          }

          setTimeout(() => {
            showNotification(
              "success",
              "Admin Access Granted!",
              "Welcome Administrator! Redirecting to admin panel..."
            );

            setEmail("");
            setPassword("");

            setIsLoading(false);

            setTimeout(() => {
              router.push("/Adminstration");
            }, 1500);
          }, 500);
          return;
        }

        // Fetch full profile for non-admin users
        try {
          const profileResponse = await api.get(api_endpoints.PROFILE);
          const profileData = profileResponse.data || profileResponse;

          // console.log("Profile Data: ", profileData)

          if (profileData) {
            if (typeof window !== "undefined") {
              const existingUser = JSON.parse(
                sessionStorage.getItem("RSUser") || "{}"
              );
              sessionStorage.setItem(
                "RSUser",
                JSON.stringify({ ...existingUser, ...profileData })
              );
            }

            const profileRole = profileData?.role || userRole;
            const firstName =
              profileData?.name?.split(" ")[0] ||
              data.user?.name?.split(" ")[0] ||
              "User";

            // Handle vendor users
            if (profileRole && profileRole.toLowerCase() === "vendor") {
              setTimeout(() => {
                showNotification(
                  "error",
                  "Vendor Access Required",
                  "You are a vendor. Please use the vendor login portal to access your account."
                );

                setEmail("");
                setPassword("");

                setIsLoading(false);

                setTimeout(() => {
                  router.push("/vendor/auth");
                }, 3000);
              }, 500);
            } else {
              // Regular user login success
              setTimeout(() => {
                showNotification(
                  "success",
                  `Welcome Back ${firstName}!`,
                  profileData?.business_name
                    ? `Good to see you again, ${profileData.business_name}! Redirecting to your dashboard...`
                    : "Successfully signed in to your account. Redirecting you to marketplace..."
                );

                setEmail("");
                setPassword("");

                setIsLoading(false);

                setTimeout(() => {
                  const redirectUrl =
                    sessionStorage.getItem("redirectUrl") || "/marketplace";
                  sessionStorage.removeItem("redirectUrl");
                  window.location.href = redirectUrl;
                }, 1500);
              }, 500);
            }
          }
        } catch (profileError: any) {
          console.error("Error fetching user profile:", profileError);

          // Continue with basic login if profile fetch fails
          setTimeout(() => {
            showNotification(
              "success",
              "Login Successful!",
              data.message || "Welcome back! Redirecting to your dashboard..."
            );

            setEmail("");
            setPassword("");

            setIsLoading(false);

            closeNotification();

            setTimeout(() => {
              const redirectUrl =
                sessionStorage.getItem("redirectUrl") || "/marketplace";
              sessionStorage.removeItem("redirectUrl");
              window.location.href = redirectUrl;
            }, 1500);
          }, 500);
        }
      } else {
        throw new Error("No access token received");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Invalid email or password. Please try again.";
      let errorTitle = "Login Failed";

      // Handle Axios error responses
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (data?.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.join(", ");
        }

        if (status === 400) {
          errorTitle = "Invalid Request";
        } else if (status === 401) {
          errorTitle = "Authentication Failed";
          errorMessage =
            "Invalid email or password. Please check your credentials.";
        } else if (status === 403) {
          errorTitle = "Access Denied";
          errorMessage = "Your account may be suspended or not verified.";
        } else if (status === 404) {
          errorTitle = "Account Not Found";
          errorMessage = "No account found with this email address.";
        } else if (status === 429) {
          errorTitle = "Too Many Attempts";
          errorMessage = "Too many login attempts. Please try again later.";
        } else if (status === 500) {
          errorTitle = "Server Error";
          errorMessage =
            "Our servers are experiencing issues. Please try again later.";
        }
      } else if (error.request) {
        // Network error
        errorTitle = "Connection Error";
        errorMessage =
          "Unable to connect to our servers. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      closeNotification();

      setTimeout(() => {
        showNotification("error", errorTitle, errorMessage);
        setIsLoading(false);
      }, 500);
    }
  };

  // disable button if input field is empty
  const isButtonDisabled = isLoading || !email || !password;

  return (
    <>
      <NotificationModal
        type={notification.type}
        title={notification.title}
        message={notification.message}
        show={notification.show}
        onClose={closeNotification}
      />

      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          <Card className="relative border border-gray-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2 mb-5 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-10">
              <div className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Sign up here
                </Link>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="enter@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pr-10 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full transition-all duration-200 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isButtonDisabled}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-xs text-gray-500">
                  <p>* Required fields</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
