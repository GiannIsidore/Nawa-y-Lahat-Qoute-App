"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useRef, useState, useEffect } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { Pencil, Save, X, LogOut, Camera, Upload } from "lucide-react";
import CameraCapture from "./CameraCapture";
import axios from "axios";
import { ScrollArea } from "./ui/scroll-area";

export default function ProfilePic() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState({
    id: 0,
    fname: "",
    mname: "",
    lname: "",
    username: "",
    profilePic: "/placeholder-user.jpg",
  });
  const [userPosts, setUserPosts] = useState([]);
  const [image, setImage] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // console.log(parsedUser.id);
      fetchUserPosts(parsedUser.id); // Correctly pass the user ID
    }
  }, []);

  const fetchUserPosts = async (userID: number) => {
    console.log("Fetching posts for User ID:", userID); // Debugging: Check if userId is passed correctly
    try {
      const response = await axios.get(
        `http://localhost/qouteNia/php/get_user_posts.php?userID=${userID}` // Ensure correct userId is passed
      );
      if (response.data.status === "success") {
        setUserPosts(response.data.data);
      } else {
        console.error("Failed to fetch user posts:", response.data.message);
        toast({
          description: "Failed to fetch user posts",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast({
        description: "Error fetching user posts",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageSrc: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      profilePic: imageSrc,
    }));
    setImage(null); // Clear file input if using camera
    setShowCamera(false);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    toast({ description: "Logged out successfully", variant: "success" });
    window.location.href = "/login";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      const payload = {
        userID: user.id,
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        username: user.username,
      };

      const response = await axios.post(
        "http://localhost/qouteNia/php/update/update_user_profile.php",
        payload
      );

      if (response.data.status === "success") {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.reload();
        toast({
          description: "Profile updated successfully",
          variant: "success",
        });
        setEditMode(false);
      } else {
        toast({
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ description: "Error updating profile", variant: "destructive" });
    }
  };

  const changeProfilePic = async () => {
    if (!image && !user.profilePic) {
      toast({
        description: "Please select an image first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = new FormData();

      if (image) {
        payload.append("profile_pic", image);
      } else if (user.profilePic.startsWith("data:image")) {
        const base64Response = await fetch(user.profilePic);
        const blob = await base64Response.blob();
        payload.append("profile_pic", blob, "profile_pic.jpg");
      }

      payload.append("userID", user.id.toString());

      const response = await axios.post(
        "http://localhost/qouteNia/php/update/upload_profile_pic.php",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        const updatedUser = { ...user, profilePic: user.profilePic };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.location.reload();
        toast({
          description: "Profile picture updated successfully",
          variant: "success",
        });
      } else {
        toast({
          description: "Failed to update profile picture",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast({
        description: "Error updating profile picture",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePic} alt={user.fname} />
            <AvatarFallback>
              {user.fname.charAt(0)}
              {user.lname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-3xl mx-auto">
        <DrawerHeader className="text-left">
          <div className="flex items-center space-x-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent">
                  <Avatar className="h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={user.profilePic} alt={user.fname} />
                    <AvatarFallback className="text-3xl">
                      {user.fname.charAt(0)}
                      {user.lname.charAt(0)}
                    </AvatarFallback>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-full">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </Avatar>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Change Profile Picture</AlertDialogTitle>
                  <AlertDialogDescription>
                    Take a new photo or choose an image from your files.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {showCamera ? (
                  <CameraCapture
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                  />
                ) : (
                  <>
                    <div className="flex justify-center space-x-4 my-4">
                      <Button
                        onClick={() => setShowCamera(true)}
                        className="flex-1"
                      >
                        <Camera className="mr-2 h-4 w-4" /> Take Photo
                      </Button>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1"
                      >
                        <Upload className="mr-2 h-4 w-4" /> Choose File
                      </Button>
                      <input
                        placeholder="Choose file"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    {user.profilePic && (
                      <div className="mt-4 flex justify-center">
                        <Avatar className="h-32 w-32">
                          <AvatarImage src={user.profilePic} alt={user.fname} />
                          <AvatarFallback>
                            {user.fname.charAt(0)}
                            {user.lname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={changeProfilePic}>
                    Update Picture
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div>
              <h2 className="text-3xl font-bold">{`${user.fname} ${user.lname}`}</h2>
              <p className="text-lg text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          <DrawerClose className="absolute right-4 top-4">
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <Carousel>
          <CarouselContent>
            <CarouselItem>
              {" "}
              <div className="px-6 py-4 space-y-6">
                <form className="grid grid-cols-2 gap-6">
                  {["fname", "mname", "lname", "username"].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="text-sm font-medium">
                        {field === "fname"
                          ? "First Name"
                          : field === "mname"
                          ? "Middle Name"
                          : field === "lname"
                          ? "Last Name"
                          : "Username"}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        value={user[field as keyof typeof user]}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className={`bg-secondary ${
                          editMode ? "border-primary" : ""
                        }`}
                      />
                    </div>
                  ))}
                </form>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="px-6 py-4 space-y-6">
                <ScrollArea className="h-[30vh] px-6">
                  <div className="space-y-6">
                    {userPosts.length > 0 ? (
                      userPosts.map((post) => (
                        <div
                          key={post.postID}
                          className="border rounded-lg p-4 space-y-2"
                        >
                          <h3 className="font-bold">{post.title}</h3>
                          <p>{post.content}</p>
                          <div className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No posts found.</p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <DrawerFooter>
          <div className="flex justify-between w-full space-x-4">
            {editMode ? (
              <>
                <Button onClick={saveProfile} className="w-full text-lg py-6">
                  <Save className="mr-2 h-5 w-5" /> Save Changes
                </Button>
                <Button
                  onClick={() => setEditMode(false)}
                  variant="outline"
                  className="w-full text-lg py-6"
                >
                  <X className="mr-2 h-5 w-5" /> Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setEditMode(true)}
                  className="w-full text-lg py-6"
                  variant="outline"
                >
                  <Pencil className="mr-2 h-5 w-5" /> Edit Profile
                </Button>
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="w-full text-lg py-6"
                >
                  <LogOut className="mr-2 h-5 w-5" /> Logout
                </Button>
              </>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
