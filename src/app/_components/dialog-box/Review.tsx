import { Loader } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import Rating from "~/components/ui/ratting";
import { Textarea } from "~/components/ui/textarea";

const ReviewModel = ({
  isOpen,
  setIsOpen,
  vendorName,
  setRating,
  setReview,
  status,
  submitReview,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  vendorName: string | null;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  setReview: React.Dispatch<React.SetStateAction<string>>;
  status: "idle" | "pending" | "error" | "success";
  submitReview: () => Promise<void>;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="line-clamp-1 text-xl">
            Review for <span className="text-secondary">{vendorName}</span>
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="mb-4 space-y-2">
            <Label>
              <span className="text-slate-600">Rating</span>
            </Label>
            <Rating onChange={setRating} defaultValue={0} />
          </div>
          <div className="mb-4 space-y-2">
            <Label>
              <span className="text-slate-600">Review</span>
            </Label>
            <Textarea
              onChange={(e) => setReview(e.target.value)}
              placeholder={`How was your experience on ${vendorName}?`}
              className="h-60 w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              disabled={status === "pending"}
              type="button"
              variant={"outline"}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={submitReview}
            disabled={status === "pending"}
            type="button"
            variant={"secondary"}
          >
            {status === "pending" && (
              <Loader size={16} className="mr-2 animate-spin" />
            )}
            {status === "pending" ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModel;
