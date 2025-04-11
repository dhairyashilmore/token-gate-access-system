
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FormProps {
  type: "login" | "signup";
}

const AuthForm: React.FC<FormProps> = ({ type }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [touched, setTouched] = React.useState({
    name: false,
    email: false,
    password: false,
  });
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  // Clear error when input changes
  React.useEffect(() => {
    if (error) setError("");
  }, [name, email, password]);

  const validateForm = () => {
    if (type === "signup" && !name.trim()) {
      setError("Name is required");
      return false;
    }
    
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      let success = false;

      if (type === "login") {
        success = await login(email, password);
      } else {
        success = await signup(name, email, password);
      }

      if (success) {
        toast({
          title: type === "login" ? "Logged in successfully" : "Account created",
          description: type === "login" ? "Welcome back!" : "Your account has been created successfully",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(error?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Mark field as touched when it loses focus
  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof typeof touched, value: string) => {
    if (!touched[field]) return null;
    
    switch (field) {
      case "name":
        return type === "signup" && !value.trim() ? "Name is required" : null;
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? "Please enter a valid email address" : null;
      case "password":
        if (!value.trim()) return "Password is required";
        return value.length < 6 ? "Password must be at least 6 characters" : null;
      default:
        return null;
    }
  };

  const nameError = getFieldError("name", name);
  const emailError = getFieldError("email", email);
  const passwordError = getFieldError("password", password);

  return (
    <div className="flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border-opacity-50 animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {type === "login" ? "Sign In" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {type === "login"
              ? "Enter your credentials to access your account"
              : "Enter your information to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 border border-red-200 rounded bg-red-50 flex items-center gap-2 text-red-800">
                <AlertTriangle size={16} />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur("name")}
                  required
                  className={`auth-input ${nameError ? "border-red-400" : ""}`}
                  disabled={isSubmitting}
                  aria-invalid={!!nameError}
                />
                {nameError && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertTriangle size={12} />
                    {nameError}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                required
                className={`auth-input ${emailError ? "border-red-400" : ""}`}
                disabled={isSubmitting}
                aria-invalid={!!emailError}
              />
              {emailError && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} />
                  {emailError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  required
                  className={`auth-input pr-10 ${passwordError ? "border-red-400" : ""}`}
                  disabled={isSubmitting}
                  aria-invalid={!!passwordError}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError ? (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} />
                  {passwordError}
                </p>
              ) : (
                type === "signup" && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-gray-400" />
                    Password must be at least 6 characters
                  </p>
                )
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full auth-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {type === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : type === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          {type === "login" ? (
            <p className="text-center text-sm">
              Don't have an account?{" "}
              <a onClick={() => navigate("/signup")} className="auth-link cursor-pointer">
                Sign up
              </a>
            </p>
          ) : (
            <p className="text-center text-sm">
              Already have an account?{" "}
              <a onClick={() => navigate("/login")} className="auth-link cursor-pointer">
                Sign in
              </a>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
