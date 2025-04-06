
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Types for our authentication
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API for auth (would be replaced with real API calls)
const API_DELAY = 500; // Simulate network delay

const mockUsers: User[] = [
  {
    id: "1",
    email: "test@example.com",
    name: "Test User",
  },
];

const mockAuth = {
  login: async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    
    const user = mockUsers.find((u) => u.email === email);
    if (!user || password !== "password") {
      return null;
    }
    
    // Generate a mock JWT token
    const token = `mock-jwt-${Math.random().toString(36).substring(2)}`;
    return { user, token };
  },
  
  signup: async (name: string, email: string, password: string): Promise<{ user: User; token: string } | null> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    
    if (mockUsers.some((u) => u.email === email)) {
      return null;
    }
    
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      name,
    };
    
    mockUsers.push(newUser);
    
    const token = `mock-jwt-${Math.random().toString(36).substring(2)}`;
    return { user: newUser, token };
  },
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check local storage for existing token
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await mockAuth.login(email, password);
      
      if (!result) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return false;
      }
      
      setUser(result.user);
      setToken(result.token);
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${result.user.name}!`
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await mockAuth.signup(name, email, password);
      
      if (!result) {
        toast({
          title: "Signup failed",
          description: "Email already in use",
          variant: "destructive"
        });
        return false;
      }
      
      setUser(result.user);
      setToken(result.token);
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully"
      });
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
