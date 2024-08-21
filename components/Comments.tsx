import { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { MessageCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Comment {
  commentID: number;
  username: string;
  fullName: string;
  comment: string;
  created_at: string;
}

function CommentsSection({ postID }: { postID: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost/qouteNia/php/comments/get_comments.php?postID=${postID}`
        );
        if (response.data && Array.isArray(response.data.data)) {
          setComments(response.data.data);
        } else {
          setComments([]); // Set to empty array if response is not as expected
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]); // Set to empty array in case of error
      }
    };

    fetchComments();
  }, [postID]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUserString = localStorage.getItem("currentUser");
    if (!currentUserString) {
      console.error("Current user not found in local storage");
      return;
    }

    const currentUser = JSON.parse(currentUserString);
    const userId = currentUser.id;
    const payload = {
      postID: postID,
      userId: userId,
      comment: newComment,
    };
    console.log("Payload being sent:", payload);

    try {
      const response = await axios.post(
        "http://localhost/qouteNia/php/comments/add_comment.php",
        payload
      );

      if (response.data.success) {
        setComments((prevComments) => {
          if (Array.isArray(prevComments)) {
            return [
              ...prevComments,
              {
                commentID: response.data.commentID,
                username: currentUser.username,
                fullName: `${currentUser.fname} ${currentUser.mname} ${currentUser.lname}`,
                comment: newComment,
                created_at: new Date().toISOString(),
              },
            ];
          } else {
            // Handle case where prevComments is not an array
            return [
              {
                commentID: response.data.commentID,
                username: currentUser.username,
                fullName: `${currentUser.fname} ${currentUser.mname} ${currentUser.lname}`,
                comment: newComment,
                created_at: new Date().toISOString(),
              },
            ];
          }
        });

        setNewComment(""); // Clear the input field
      } else {
        console.error("Error adding comment:", response.data.error);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <MessageCircle className="h-4 w-4" />
          <span className="sr-only">Open comments</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Comments ({comments.length})</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-[400px] w-full pr-4 border rounded-md p-4">
            {Array.isArray(comments) &&
              comments.map((comment) => (
                <div
                  key={comment.commentID}
                  className="flex items-start space-x-4 mb-4 last:mb-0"
                >
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="Anonymous" />
                    <AvatarFallback>{comment.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {comment.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {comment.comment}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false, // Use 24-hour format
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </ScrollArea>

          <form className="grid gap-4" onSubmit={handleAddComment}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right">
                Comment
              </Label>
              <Input
                id="comment"
                className="col-span-3"
                placeholder="Type your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentsSection;
