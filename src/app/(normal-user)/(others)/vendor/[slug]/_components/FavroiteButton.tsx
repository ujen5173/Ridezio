"use client";

import { Heart, HeartCrack, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const FavroiteButton = ({ id }: { id: string }) => {
  const { data } = useSession();
  const { mutateAsync, status } = api.user.bookmark.useMutation();
  const { data: favroite, refetch } = api.user.favourite.useQuery(
    {
      vendor: id,
    },
    {
      enabled: !!id,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <Button
      disabled={data?.user.role === "VENDOR"}
      onClick={async () => {
        if (data?.user.role === "VENDOR") {
          toast({
            title: "Vendors can't add to Favourites",
            variant: "destructive",
          });
          return;
        }

        if (!!data?.user) {
          await mutateAsync({
            id,
          });

          void refetch();

          toast({
            title: `${favroite ? "Removed from" : "Added to"} favourites`,
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
      {favroite ? (
        <>
          {status === "pending" ? (
            <Loader size={16} className="mr-2 animate-spin" />
          ) : (
            <HeartCrack size={16} className="mr-2" />
          )}
          Remove favourite
        </>
      ) : (
        <>
          {status === "pending" ? (
            <Loader size={16} className="mr-2 animate-spin" />
          ) : (
            <Heart size={16} className="mr-2" />
          )}
          Add to Favourites
        </>
      )}
    </Button>
  );
};

export default FavroiteButton;
