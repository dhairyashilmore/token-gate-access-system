
import AuthForm from "@/components/AuthForm";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-gradient-to-b from-white to-indigo-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Create Your Account</h1>
          <AuthForm type="signup" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
