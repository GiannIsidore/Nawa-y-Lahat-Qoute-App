"use client";
import { Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState([]);
  const toast = useToast();
  const router = useRouter();

  const login = async () => {
    console.log(username, password);
    try {
      const response = await axios.post(
        "http://localhost/qouteNia/php/loginUsers.php",
        {
          username: username,
          password: password,
        }
      );
      if (response.data.status === "success") {
        toast.toast({ title: "yehey (～￣▽￣)～", variant: "success" });
        // console.log(response.data);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(response.data.currentUser)
        );
        // console.log("User stored in local storage:", response.data.currentUser);

        router.push("/qoute");
      } else if (response.data.status === "error") {
        toast.toast({ title: "oh noo! ＞﹏＜", variant: "destructive" });
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="joksan123"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <>
                      <EyeOffIcon className="h-4 w-4" />
                      <span className="sr-only">Hide password</span>
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">Show password</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Button type="button" onClick={login} className="w-full">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="register/" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {/* <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 p-8">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <Quote className="text-purple-600 w-10 h-10 mr-2" />
              <h1 className="text-3xl font-bold text-gray-800">Nawa'y Lahat</h1>
            </div>
            <p className="text-center text-xl font-semibold text-pink-600">
              Qoute App
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
