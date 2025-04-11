
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ClientForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addClient } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await addClient({
        name,
        email,
        company,
        status
      });
      
      if (success) {
        // Reset form
        setName("");
        setEmail("");
        setCompany("");
        setStatus("active");
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error adding client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Client Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Smith"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="client@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Acme Inc."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(value: "active" | "inactive") => setStatus(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Client...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" /> Add Client
          </>
        )}
      </Button>
    </form>
  );
};

export default ClientForm;
