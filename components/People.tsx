"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

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
    <div>
      <Card className="rounded-2xl">
        <CardHeader className="p-4">
          <h3 className="text-lg font-bold">Who to follow</h3>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <ScrollArea className="h-[200px] w-full pr-4  border rounded-md p-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center  pb-3  justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="p-2 w-10 border rounded-full">
                    <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                    <AvatarFallback>
                      {user.fname[0]}
                      {user.lname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold">
                      {user.fname} {user.lname}
                    </div>
                    <div className="text-muted-foreground">
                      @{user.username}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 py-1 text-sm"
                >
                  Follow
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default People;
