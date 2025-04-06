
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, User, Users } from "lucide-react";

const Dashboard = () => {
  const { user, token, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    const success = await updateProfile({ name, email });
    if (success) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="mr-2 h-4 w-4" /> Clients
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-base bg-gray-50 p-2 rounded-md">{user?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-base bg-gray-50 p-2 rounded-md">{user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Account ID</p>
                    <p className="text-base bg-gray-50 p-2 rounded-md">{user?.id}</p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)} 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateProfile} 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline" 
                  className="w-full"
                >
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Your current session information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-base">Authenticated</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">JWT Token</p>
                <p className="text-xs bg-gray-50 p-2 rounded-md break-all font-mono">{token}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client List</CardTitle>
              <CardDescription>View and manage your clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="text-center text-gray-500">Client data will be loaded from your MongoDB backend</h3>
                </div>
                <div className="p-4">
                  <p className="text-center text-muted-foreground">
                    Connect your backend to display client data here
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>
                Refresh Client Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
