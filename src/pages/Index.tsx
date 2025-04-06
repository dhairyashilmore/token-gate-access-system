
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
              <span className="block">Secure Authentication</span>
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                With JWT Tokens
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              A modern authentication system with secure token-based access control.
              Perfect for protecting your sensitive data and resources.
            </p>
            <div className="mt-10">
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                  <Button 
                    onClick={() => navigate("/login")}
                    className="px-8 py-3 bg-white text-gray-800 font-medium rounded-lg text-lg shadow-md hover:shadow-lg border border-gray-200 transition-all duration-200"
                  >
                    Log In
                  </Button>
                  <Button 
                    onClick={() => navigate("/signup")}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Secure by Design</h3>
                <p className="mt-2 text-gray-600">
                  JWT tokens provide stateless authentication with strong security guarantees.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-md bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Fast & Efficient</h3>
                <p className="mt-2 text-gray-600">
                  Token-based authentication eliminates database lookups for each request.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Modern Standards</h3>
                <p className="mt-2 text-gray-600">
                  Built with the latest web standards and security best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
