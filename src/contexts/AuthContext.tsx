import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { mongoClient, setCurrentUserEmail } from "@/utils/mongodb";

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
      
      const userData = await mongoClient.users.getProfile(authToken);
      setUser(userData);
      setToken(authToken);
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
      
      const response = await mongoClient.users.login(email, password);
      
      // Store the email for profile fetching
      setCurrentUserEmail(email);
      
      setUser(response.user);
      setToken(response.token);
      
      // Store token in localStorage
      localStorage.setItem("token", response.token);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`
      });
      
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error?.message || "Invalid email or password",
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
      
      const response = await mongoClient.users.signup(name, email, password);
      
      // Store the email for profile fetching
      setCurrentUserEmail(email);
      
      setUser(response.user);
      setToken(response.token);
      
      // Store token in localStorage
      localStorage.setItem("token", response.token);
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error?.message || "An unexpected error occurred",
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
      
      const updatedUser = await mongoClient.users.updateProfile(token, userData);
      
      // Update user data in state
      setUser(prev => prev ? { ...prev, ...updatedUser } : null);
      
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

      const clientData = await mongoClient.clients.getAll(token);
      setClients(clientData);
      
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

      const newClient = await mongoClient.clients.add(token, clientData);
      
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
