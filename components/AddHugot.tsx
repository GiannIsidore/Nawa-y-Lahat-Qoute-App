"use client";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface qoute {
  title: string;
  type: number;
  content: string;
  user_id: number;
  date: Date;
}
interface qouteType {
  typeID: number;
  type: string;
}

interface Post {
  postID: number;
  userID: number;
  hugotID: number;
  created_at: string;
  username: string;
  fname: string;
  mname: string;
  lname: string;
  title: string;
  content: string;
  type: string;
  fullName: string; // New property for full name
}
export default function AddHugot() {
  const [title, setTitle] = useState("");
  const [types, setTypes] = useState<qouteType[]>([]);
  const [qouteType, setQouteType] = useState(0);
  const [content, setContent] = useState("");
  const [id, setId] = useState<number | null>(null); // Use number type
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mname, setMname] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const toast = useToast();
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setId(user.id);
      setFname(user.fname);
      setLname(user.lname);
      setMname(user.mname);
      setUsername(user.username);
    }
  }, []);
  useEffect(() => {
    const getTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost/qouteNia/php/getType.php"
        );
        if (response.data) {
          //   console.log("Fetched types:", response.data); // Log fetched types for debugging
          setTypes(response.data);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    getTypes();
  }, []);

  const [post, setPost] = useState<Post[]>([]);

  const getPost = async () => {
    try {
      const response = await axios.get(
        "http://localhost/qouteNia/php/getPost.php"
      );
      if (response.data) {
        console.log("Fetched types:", response.data.data); // Log fetched types for debugging
        const postsWithFullName = response.data.data.map((post: Post) => ({
          ...post,
          fullName: `${post.fname} ${post.mname} ${post.lname}`,
        }));
        setPost(postsWithFullName);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleTypeChange = (value: string) => {
    console.log("Selected type:", value);
    const selectedType = types.find((type) => type.type === value);
    if (selectedType) {
      console.log("Selected type ID:", selectedType.typeID);
      setQouteType(selectedType.typeID);
    } else {
      console.error("Type not found:", value);
    }
  };

  const sendPost = async () => {
    try {
      // Log input data for debugging
      console.log("Sending POST request with data:", {
        title,
        qouteType,
        content,
        user_id: id,
        date: new Date().toISOString().split("T")[0], // Formatting date to YYYY-MM-DD
      });

      const payLoad = {
        title: title,
        type: qouteType,
        content: content,
        user_id: id,
        date: new Date().toISOString().split("T")[0],
      };

      // Making POST request with axios
      const response = await axios.post(
        "http://localhost/qouteNia/php/addPost.php",
        payLoad,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful response
      if (response.data.status === "success") {
        console.log("Data successfully inserted:", response.data.message);
        toast.toast({ description: "yess", variant: "success" });
        setTitle("");
        setContent("");
        router.refresh();
        getPost();
      } else {
        console.error("Error inserting data:", response.data.message);
        toast.toast({ description: "nooo", variant: "destructive" });
      }
    } catch (error: any) {
      // Handle any errors that occur during the request
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Server error:", error.response.data.message);
        toast.toast({ description: "oh no", variant: "warning" });
      } else if (error.request) {
        // No response received
        toast.toast({
          description: "nooo response recieved",
          variant: "destructive",
        });
      } else {
        // Something else caused an error
        toast.toast({
          description: `${error.message}`,
          variant: "destructive",
        });

        console.error("Error:", error.message);
      }
    }
  };

  return (
    <div className="flex items-center w-full max-w-2xl max-h-[20vh] h-full p-4 ">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="what are you feeling today...?"
              className="w-full h-[3vh] rounded-md border border-input bg-secondary px-10 py-5 text-sm ring-offset-background border-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="grid grid-cols-2 gap-1">
              <label className="col-span-2">
                What is on your mind, {fname}?
              </label>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            <div className="grid gap-4">
              <Input
                type="text"
                placeholder="Post Title"
                className="w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex">
                <ToggleGroup type="single" onValueChange={handleTypeChange}>
                  {types.map((type) => (
                    <ToggleGroupItem
                      key={type.typeID}
                      value={type.type}
                      aria-label={`Toggle ${type.type}`}
                    >
                      <p>{type.type}</p>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <Textarea
                placeholder="Write your post..."
                className="w-full rounded-md border border-input bg-transparent px-4 py-6 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button onClick={sendPost}>Post</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
