
// MongoDB connection utility
// This file provides a MongoDB client for connecting to MongoDB Atlas

// MongoDB Atlas connection string
// Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
const MONGODB_URI = "YOUR_MONGODB_CONNECTION_STRING"; // Replace with your MongoDB Atlas connection string

// We're using a client-side application, so we need to use a REST API approach
// rather than direct MongoDB driver connection (which would expose credentials)
const API_BASE_URL = "https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1";
const API_KEY = "YOUR_API_KEY"; // Replace with your Data API Key

export const mongoClient = {
  // User operations
  users: {
    login: async (email: string, password: string) => {
      try {
        console.log("Authenticating with MongoDB...");
        
        // For real MongoDB integration, you would use MongoDB Data API or a custom backend API
        // Example using fetch with MongoDB Data API:
        const response = await fetch(`${API_BASE_URL}/action/findOne`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
          },
          body: JSON.stringify({
            dataSource: "Cluster0", // Replace with your cluster name
            database: "your_database",
            collection: "users",
            filter: { email }
          })
        });
        
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        
        const data = await response.json();
        
        if (!data.document || data.document.password !== password) { // In production, use proper password hashing
          throw new Error("Invalid email or password");
        }
        
        const user = data.document;
        
        // Return user data without sensitive information
        return {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email
          },
          token: `mongodb_token_${Date.now()}` // In a real app, generate a proper JWT
        };
      } catch (error) {
        console.error("MongoDB login error:", error);
        throw error;
      }
    },
    
    signup: async (name: string, email: string, password: string) => {
      try {
        console.log("Creating user in MongoDB...");
        
        // First check if user exists
        const checkResponse = await fetch(`${API_BASE_URL}/action/findOne`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
          },
          body: JSON.stringify({
            dataSource: "Cluster0", // Replace with your cluster name
            database: "your_database",
            collection: "users",
            filter: { email }
          })
        });
        
        if (!checkResponse.ok) {
          throw new Error("Failed to check existing user");
        }
        
        const existingUser = await checkResponse.json();
        
        if (existingUser.document) {
          throw new Error("Email already in use");
        }
        
        // Create new user
        const response = await fetch(`${API_BASE_URL}/action/insertOne`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
          },
          body: JSON.stringify({
            dataSource: "Cluster0", // Replace with your cluster name
            database: "your_database",
            collection: "users",
            document: {
              name,
              email,
              password, // In production, use proper password hashing
              createdAt: new Date()
            }
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to create user");
        }
        
        const result = await response.json();
        
        return {
          user: {
            id: result.insertedId,
            name,
            email
          },
          token: `mongodb_token_${Date.now()}` // In a real app, generate a proper JWT
        };
      } catch (error) {
        console.error("MongoDB signup error:", error);
        throw error;
      }
    },
    
    getProfile: async (token: string) => {
      try {
        console.log("Fetching profile from MongoDB...");
        
        // In a real app, you would verify the JWT and extract the user ID
        // For simplicity, we'll just use the email from localStorage
        // This is NOT secure and is just for demonstration
        
        const email = localStorage.getItem("current_user_email");
        
        if (!email) {
          throw new Error("User not found");
        }
        
        const response = await fetch(`${API_BASE_URL}/action/findOne`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
          },
          body: JSON.stringify({
            dataSource: "Cluster0", // Replace with your cluster name
            database: "your_database",
            collection: "users",
            filter: { email },
            projection: { password: 0 } // Exclude password
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        
        const data = await response.json();
        
        if (!data.document) {
          throw new Error("User not found");
        }
        
        const user = data.document;
        
        return {
          id: user._id.toString(),
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
        console.log("Updating profile in MongoDB...");
        
        // In a real app, you would verify the JWT and extract the user ID
        const email = userData.email || localStorage.getItem("current_user_email");
        
        if (!email) {
          throw new Error("User not found");
        }
        
        // Create update object without the id field
        const updateData = { ...userData };
        delete updateData.id;
        
        const response = await fetch(`${API_BASE_URL}/action/updateOne`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
          },
          body: JSON.stringify({
            dataSource: "Cluster0", // Replace with your cluster name
            database: "your_database",
            collection: "users",
            filter: { email },
            update: { 
              $set: updateData
            }
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to update profile");
        }
        
        return userData;
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
        
        // In a real app, you would verify the JWT and extract the user ID to filter by owner
        const response = await fetch(`${API_BASE_URL}/action/find`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
          },
          body: JSON.stringify({
            dataSource: "Cluster0", // Replace with your cluster name
            database: "your_database",
            collection: "clients",
            limit: 100
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        
        const data = await response.json();
        
        return data.documents.map((client: any) => ({
          id: client._id.toString(),
          name: client.name,
          email: client.email,
          company: client.company,
          status: client.status
        }));
      } catch (error) {
        console.error("MongoDB get clients error:", error);
        throw error;
      }
    },
    
    add: async (token: string, clientData: any) => {
      try {
        console.log("Adding client to MongoDB...");
        
        const response = await fetch(`${API_BASE_URL}/action/insertOne`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
          },
          body: JSON.stringify({
            dataSource: "Cluster0", // Replace with your cluster name
            database: "your_database",
            collection: "clients",
            document: {
              ...clientData,
              createdAt: new Date()
            }
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to add client");
        }
        
        const result = await response.json();
        
        return {
          id: result.insertedId,
          ...clientData
        };
      } catch (error) {
        console.error("MongoDB add client error:", error);
        throw error;
      }
    }
  }
};

// Helper function to maintain backward compatibility with localStorage
const initializeLocalStorage = () => {
  if (!localStorage.getItem("mongo_users")) {
    localStorage.setItem("mongo_users", "[]");
  }
  if (!localStorage.getItem("mongo_clients")) {
    localStorage.setItem("mongo_clients", "[]");
  }
};

// Initialize localStorage for development fallback
initializeLocalStorage();

// Store current user email for profile fetching
export const setCurrentUserEmail = (email: string) => {
  localStorage.setItem("current_user_email", email);
};

// Update AuthContext login/signup functions to also call this
