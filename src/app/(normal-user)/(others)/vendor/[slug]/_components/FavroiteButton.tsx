"use client";

import { Heart, Loader } from "lucide-react";
import { useUser } from "~/app/_components/contexts/root";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const FavroiteButton = ({ id }: { id: string }) => {
  const { mutateAsync, status } = api.user.bookmark.useMutation();
  const { user: data } = useUser();

  return (
    <Button
      onClick={async () => {
        if (!!data?.user) {
          await mutateAsync({
            id,
          });
        } else {
          toast({
            title: "Sign in to add to Favrorites",
            variant: "destructive",
          });
        }
      }}
      className="w-full"
      variant={"outline-secondary"}
    >
      {status === "pending" ? (
        <Loader size={16} className="mr-2 animate-spin" />
      ) : (
        <Heart size={16} className="mr-2" />
      )}
      Add to Favroite
    </Button>
  );
};

export default FavroiteButton;
