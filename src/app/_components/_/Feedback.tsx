"use client";

import { Loader } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const FeedbackDialog = ({ children }: { children: ReactNode }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<
    "bad" | "good" | "amazing" | "okay" | "terrible"
  >("okay");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutateAsync, status } = api.feedback.send.useMutation();
  const [from, setFrom] = useState<
    "github" | "twitter" | "none" | "google" | "friends" | undefined
  >();

  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    const response = inputRef.current?.value;

    if (!response || !selectedEmoji) return;

    const res = await mutateAsync({
      rating: selectedEmoji,
      feedback: response,
      from,
    });

    if (res) {
      toast({ title: "Feedback submitted successfully!" });
      inputRef.current!.value = "";
      setSelectedEmoji("okay");
      setFrom(undefined);
      setOpen(false);
    } else {
      toast({ title: "An error occurred. Please try again later." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Give Feedback</DialogTitle>
          <DialogDescription>
            What do you think of our website? Let us know your thoughts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            onValueChange={(value) =>
              setFrom(
                value as
                  | "github"
                  | "twitter"
                  | "none"
                  | "google"
                  | "friends"
                  | undefined,
              )
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Where did you hear us?" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                {["github", "twitter", "none", "google", "friends"].map((f) => (
                  <SelectItem key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="mb-4 flex items-center gap-2">
            {["Terrible", "Bad", "Okay", "Good", "Amazing"].map((rating) => (
              <button
                onClick={() =>
                  setSelectedEmoji(
                    rating.toLowerCase() as
                      | "bad"
                      | "good"
                      | "amazing"
                      | "okay"
                      | "terrible",
                  )
                }
                key={rating}
                className={cn(
                  "rounded-md border bg-white p-4 transition hover:bg-zinc-100",
                  selectedEmoji === rating.toLowerCase()
                    ? "border-secondary/60 bg-secondary/10"
                    : "border-border",
                )}
              >
                <Image
                  src={`/feedback-icons/${rating.toLowerCase()}.svg`}
                  width={60}
                  height={60}
                  alt={rating}
                />
              </button>
            ))}
          </div>
          <div className="">
            <Label htmlFor="name" className="mb-2 block">
              Response
            </Label>
            <Textarea
              id="response"
              required
              ref={inputRef}
              placeholder="Your feedback here..."
              className="h-32"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              disabled={status === "pending"}
              type="button"
              variant={"outline"}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={"secondary"}
            disabled={status === "pending"}
            onClick={onSubmit}
          >
            {status === "pending" ? (
              <Loader className="mr-2 size-5 animate-spin" />
            ) : null}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
