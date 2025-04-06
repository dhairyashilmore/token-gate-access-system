
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, token } = useAuth();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
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
            <Button variant="outline" className="w-full mt-4">
              Refresh Token
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
