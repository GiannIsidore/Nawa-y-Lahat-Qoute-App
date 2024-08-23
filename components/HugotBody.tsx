"use client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, MessageCircleMore } from "lucide-react";
import CommentsSection from "./Comments";

interface Post {
  postID: number;
  userID: number;
  hugotID: number;
  created_at: string;
  updated_at: string;
  username: string;
  fname: string;
  mname: string;
  lname: string;
  title: string;
  content: string;
  type: string;
  fullName: string;
  profilePic: string; // Add this property to your Post interface
  likes_count: number;
  isLiked?: boolean; // Add this property
}
interface HugotBodyProps {
  filterType?: string | null; // Optional prop to filter posts by type
}
export default function HugotBody({ filterType }: HugotBodyProps) {
  const [post, setPost] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [animatingPostID, setAnimatingPostID] = useState<number | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost/qouteNia/php/getPost.php${
            filterType ? `?type=${filterType}` : ""
          }`
        );
        if (response.data.status === "success") {
          setPost(response.data.data);
        } else {
          console.error("Error fetching posts:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPosts();
  }, [filterType]); // Re-fetch posts whenever filterType changes

  // Function to fetch liked posts for the current user
  async function fetchLikedPosts(userId: Post["userID"]) {
    try {
      const response = await axios.get(
        `http://localhost/qouteNia/php/likes/get_liked_post.php?userId=${userId}`
      );
      const likedPosts = response.data; // This should return an array of post IDs the user has liked
      return likedPosts;
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      return [];
    }
  }

  // Function to render posts
  useEffect(() => {
    async function renderPosts() {
      const currentUserString = localStorage.getItem("currentUser");
      if (!currentUserString) {
        console.error("Current user not found in local storage");
        return;
      }

      const currentUser = JSON.parse(currentUserString);
      const userId = currentUser.id;

      const likedPosts = await fetchLikedPosts(userId);

      setLikedPosts(new Set(likedPosts)); // Update the likedPosts state

      post.forEach((post) => {
        const isLiked = likedPosts.includes(post.postID);
        // console.log(`Post ${post.postID} is liked: ${isLiked}`);
      });
    }

    renderPosts();
  }, [post]); // Add 'post' as a dependency if the posts can change
  const currentUser = JSON.parse(localStorage.getItem("currentUser") ?? "");

  async function handleLike(postID: number, isCurrentlyLiked: boolean) {
    setAnimatingPostID(postID);
    setTimeout(() => setAnimatingPostID(null), 300);
    const currentUserString = localStorage.getItem("currentUser");
    if (!currentUserString) {
      console.error("Current user not found in local storage");
      return;
    }

    const currentUser = JSON.parse(currentUserString);
    const userId = currentUser.id;

    const payload = {
      postID,
      userId,
    };

    try {
      let response;
      if (isCurrentlyLiked) {
        // Unlike the post
        response = await axios.post(
          "http://localhost/qouteNia/php/likes/unlike_post.php",
          payload
        );
        // Remove the postID from the likedPosts state and decrement the likes count
        setLikedPosts((prevLikedPosts) => {
          const updatedLikedPosts = new Set(prevLikedPosts);
          updatedLikedPosts.delete(postID);
          return updatedLikedPosts;
        });
        setPost((prevPosts) =>
          prevPosts.map((p) =>
            p.postID === postID ? { ...p, likes_count: p.likes_count - 1 } : p
          )
        );
      } else {
        // Like the post
        response = await axios.post(
          "http://localhost/qouteNia/php/likes/like_post.php",
          payload
        );
        // Add the postID to the likedPosts state and increment the likes count
        setLikedPosts((prevLikedPosts) => {
          const updatedLikedPosts = new Set(prevLikedPosts);
          updatedLikedPosts.add(postID);
          return updatedLikedPosts;
        });
        setPost((prevPosts) =>
          prevPosts.map((p) =>
            p.postID === postID ? { ...p, likes_count: p.likes_count + 1 } : p
          )
        );
      }

      if (response.data.success) {
        console.log(
          `Post ${postID} successfully ${
            isCurrentlyLiked ? "unliked" : "liked"
          }.`
        );
      } else {
        console.error("Server error:", response.data.error);
        alert("An error occurred: " + response.data.error);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      alert("A network or client-side error occurred. Please try again later.");
    }
  }

  return (
    <section className="flex flex-col gap-2 max-w-4xl w-full">
      {post.map((post) => (
        <div
          key={post.postID}
          className="grid gap-3 rounded-lg bg-muted p-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 justify-between drop-shadow-xl">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.profilePic} alt={post.fullName} />
                <AvatarFallback>{post.fname.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.fullName}</div>
                <div className="text-sm text-muted-foreground">
                  @{post.username} ·{" "}
                  {new Date(post.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
            {post.userID === currentUser.id && (
              <div>
                <Select>
                  <SelectTrigger aria-label="Options">
                    <svg
                      className="w-6 h-6 text-gray-500 dark:text-gray-200"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delete">Delete post</SelectItem>
                    <SelectItem value="edit">Edit post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div>
            <h1 className="font-bold text-2xl">{post.title}</h1>
            <p className="max-w-2xl w-full">{post.content}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <CommentsSection postID={post.postID} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  handleLike(
                    post.postID,
                    likedPosts.has(post.postID) // Only pass postID and the like status
                  )
                }
              >
                <Heart
                  className={`h-5 w-5 heart ${
                    likedPosts.has(post.postID)
                      ? "text-red-500"
                      : "text-gray-500"
                  } ${animatingPostID === post.postID ? "liked" : ""}`}
                  fill={likedPosts.has(post.postID) ? "red" : "none"} // Fill the heart when liked
                />
                <span className="sr-only">Like</span>
              </Button>
              <span className="text-sm">{post.likes_count}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
