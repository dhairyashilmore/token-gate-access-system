
// MongoDB connection utility
// Note: In a production environment, these credentials should be stored securely
// This is a simplified implementation for demonstration purposes

// MongoDB Atlas connection string
// Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
const MONGODB_URI = "YOUR_MONGODB_CONNECTION_STRING";

// Simple function to wrap fetch calls to your MongoDB API
export const mongoClient = {
  // User operations
  users: {
    login: async (email: string, password: string) => {
      try {
        // In a real implementation, you'd have an API endpoint for authentication
        // For now, we're simulating this with localStorage
        console.log("Attempting login with MongoDB...");
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // This is where you'd normally make a fetch call to your MongoDB API
        // return await fetch(`${API_URL}/auth/login`, {...})
        
        // For demo purposes, we'll use localStorage to simulate persistence
        const users = JSON.parse(localStorage.getItem("mongo_users") || "[]");
        const user = users.find((u: any) => u.email === email);
        
        if (!user || user.password !== password) {
          throw new Error("Invalid email or password");
        }
        
        // Return a simulated response similar to what your API would return
        return {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          },
          token: `demo_token_${Date.now()}`
        };
      } catch (error) {
        console.error("MongoDB login error:", error);
        throw error;
      }
    },
    
    signup: async (name: string, email: string, password: string) => {
      try {
        console.log("Attempting signup with MongoDB...");
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, you'd make a fetch call to your MongoDB API
        // return await fetch(`${API_URL}/auth/signup`, {...})
        
        // For demo purposes, we'll use localStorage to simulate persistence
        const users = JSON.parse(localStorage.getItem("mongo_users") || "[]");
        
        // Check if user already exists
        if (users.some((u: any) => u.email === email)) {
          throw new Error("Email already in use");
        }
        
        // Create new user
        const newUser = {
          id: `user_${Date.now()}`,
          name,
          email,
          password // In a real app, this would be hashed
        };
        
        // Add user to "database"
        users.push(newUser);
        localStorage.setItem("mongo_users", JSON.stringify(users));
        
        // Return simulated response
        return {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
          },
          token: `demo_token_${Date.now()}`
        };
      } catch (error) {
        console.error("MongoDB signup error:", error);
        throw error;
      }
    },
    
    getProfile: async (token: string) => {
      try {
        console.log("Fetching user profile from MongoDB...");
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real implementation, you'd verify the token and fetch user data
        // For demo purposes, we'll extract the user from localStorage
        const users = JSON.parse(localStorage.getItem("mongo_users") || "[]");
        
        // This is a simplified token validation
        // In a real app, you'd decode and validate the JWT
        if (!token.startsWith("demo_token_")) {
          throw new Error("Invalid token");
        }
        
        // Since we can't actually validate the token, we'll just return the first user
        // In a real app, the token would contain the user ID
        if (users.length === 0) {
          throw new Error("No users found");
        }
        
        const user = users[0];
        
        return {
          id: user.id,
          name: user.name,
          email: user.email
        };
      } catch (error) {
        console.error("MongoDB get profile error:", error);
        throw error;
      }
    },
    
    updateProfile: async (token: string, userData: any) => {
      try {
        console.log("Updating user profile in MongoDB...");
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // For demo purposes, we'll update in localStorage
        const users = JSON.parse(localStorage.getItem("mongo_users") || "[]");
        
        // Find and update user (in a real app, we'd use the token to identify the user)
        const updatedUsers = users.map((u: any) => {
          if (u.id === userData.id) {
            return { ...u, ...userData };
          }
          return u;
        });
        
        localStorage.setItem("mongo_users", JSON.stringify(updatedUsers));
        
        return {
          ...userData
        };
      } catch (error) {
        console.error("MongoDB update profile error:", error);
        throw error;
      }
    }
  },
  
  // Client operations
  clients: {
    getAll: async (token: string) => {
      try {
        console.log("Fetching clients from MongoDB...");
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // In a real implementation, you'd fetch clients from MongoDB
        // For demo, we'll use localStorage
        const clients = JSON.parse(localStorage.getItem("mongo_clients") || "[]");
        
        return clients;
      } catch (error) {
        console.error("MongoDB get clients error:", error);
        throw error;
      }
    },
    
    add: async (token: string, clientData: any) => {
      try {
        console.log("Adding client to MongoDB...");
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demo, we'll add to localStorage
        const clients = JSON.parse(localStorage.getItem("mongo_clients") || "[]");
        
        // Create new client with ID
        const newClient = {
          ...clientData,
          id: `cl-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        };
        
        // Add to "database"
        clients.push(newClient);
        localStorage.setItem("mongo_clients", JSON.stringify(clients));
        
        return newClient;
      } catch (error) {
        console.error("MongoDB add client error:", error);
        throw error;
      }
    }
  }
};
