"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { UserPlus } from "lucide-react";

interface User {
  id: number;
  username: string;
  fname: string;
  lname: string;
}

const People = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost/qouteNia/php/get_random_users.php"
        );
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          console.error("Error fetching users:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Card className="border-none shadow-md bg-secondary/30">
      <CardHeader className="p-4 bg-primary text-primary-foreground">
        <h3 className="text-lg font-bold flex items-center">
          <UserPlus className="mr-2 h-5 w-5" />
          Who to follow
        </h3>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[250px] w-full pr-4">
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-background p-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user.fname[0]}
                      {user.lname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-foreground">
                      {user.fname} {user.lname}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      @{user.username}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default People;
