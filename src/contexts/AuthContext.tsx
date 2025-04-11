import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Types for our authentication
interface User {
  id: string;
  email: string;
  name: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "active" | "inactive";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  clients: Client[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  fetchClients: () => Promise<boolean>;
  addClient: (clientData: Omit<Client, "id">) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL - Replace this with your actual MongoDB backend URL
const API_URL = "http://localhost:5000/api"; // Example backend URL

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  // On mount, check local storage for existing token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (storedToken) {
      // Verify token and get user data
      fetchUserData(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch user data with the token
  const fetchUserData = async (authToken: string) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would be an API call to validate the token
      // and return the user data
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setToken(authToken);
      } else {
        // If token is invalid, clear storage
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // This would be replaced with an actual API call to your MongoDB backend
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Login failed",
          description: data.message || "Invalid email or password",
          variant: "destructive"
        });
        return false;
      }
      
      setUser(data.user);
      setToken(data.token);
      
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`
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
      
      // This would be replaced with an actual API call to your MongoDB backend
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Signup failed",
          description: data.message || "Email already in use",
          variant: "destructive"
        });
        return false;
      }
      
      setUser(data.user);
      setToken(data.token);
      
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      
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

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      
      if (!token) {
        toast({
          title: "Update failed",
          description: "You must be logged in to update your profile",
          variant: "destructive"
        });
        return false;
      }
      
      // This would be replaced with an actual API call to your MongoDB backend
      const response = await fetch(`${API_URL}/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Update failed",
          description: data.message || "Failed to update profile",
          variant: "destructive"
        });
        return false;
      }
      
      // Update user data in state
      setUser(prev => prev ? { ...prev, ...data.user } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
      return true;
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Update failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch clients function
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      
      if (!token) {
        toast({
          title: "Failed to load clients",
          description: "You must be logged in to view clients",
          variant: "destructive"
        });
        return false;
      }

      // For demo purposes, we'll use mock data instead of an actual API call
      // In a real app, you'd fetch from your API
      // const response = await fetch(`${API_URL}/clients`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock client data
      const mockClients: Client[] = [
        { 
          id: "cl-001", 
          name: "John Smith", 
          email: "john.smith@example.com", 
          company: "Acme Inc.", 
          status: "active" 
        },
        { 
          id: "cl-002", 
          name: "Sarah Johnson", 
          email: "sarah.j@company.co", 
          company: "Tech Solutions", 
          status: "active" 
        },
        { 
          id: "cl-003", 
          name: "Michael Brown", 
          email: "m.brown@consultants.org", 
          company: "Global Consulting", 
          status: "inactive" 
        },
        { 
          id: "cl-004", 
          name: "Emma Wilson", 
          email: "emma@wilsondesign.com", 
          company: "Wilson Design", 
          status: "active" 
        }
      ];
      
      setClients(mockClients);
      
      return true;
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Failed to load clients",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add client function
  const addClient = async (clientData: Omit<Client, "id">) => {
    try {
      setIsLoading(true);
      
      if (!token) {
        toast({
          title: "Failed to add client",
          description: "You must be logged in to add clients",
          variant: "destructive"
        });
        return false;
      }

      // For demo purposes, we'll use mock data instead of an actual API call
      // In a real app, you'd post to your API
      // const response = await fetch(`${API_URL}/clients`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify(clientData)
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a new client with a generated ID
      const newClient: Client = {
        ...clientData,
        id: `cl-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      };
      
      // Add to the clients list
      setClients(prev => [...prev, newClient]);
      
      toast({
        title: "Client added",
        description: `${clientData.name} has been added successfully`
      });
      
      return true;
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Failed to add client",
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
    setClients([]);
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
    clients,
    login,
    signup,
    logout,
    updateProfile,
    fetchClients,
    addClient,
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
