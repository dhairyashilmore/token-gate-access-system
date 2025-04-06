
import AuthForm from "@/components/AuthForm";
import React from "react";

const Login = () => {
  return (
    <div className="bg-gradient-to-b from-white to-indigo-50 min-h-screen">
      <div className="container mx-auto">
        <AuthForm type="login" />
      </div>
    </div>
  );
};

export default Login;
