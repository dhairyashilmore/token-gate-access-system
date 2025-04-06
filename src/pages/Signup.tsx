
import AuthForm from "@/components/AuthForm";
import React from "react";

const Signup = () => {
  return (
    <div className="bg-gradient-to-b from-white to-indigo-50 min-h-screen">
      <div className="container mx-auto">
        <AuthForm type="signup" />
      </div>
    </div>
  );
};

export default Signup;
