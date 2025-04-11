
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "active" | "inactive";
}

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
}

const ClientList: React.FC<ClientListProps> = ({ clients, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No clients found. Add your first client to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A list of your clients.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.company}</TableCell>
            <TableCell>
              <Badge 
                variant={client.status === "active" ? "default" : "outline"}
                className={
                  client.status === "active" 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "text-gray-500"
                }
              >
                {client.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientList;
