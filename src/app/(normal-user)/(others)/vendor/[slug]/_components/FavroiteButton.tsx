"use client";

import { Heart, HeartCrack, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import { type userRoleEnum } from "~/server/db/schema";
import { api } from "~/trpc/react";

const FavroiteButton = ({
  role,
  id,
}: {
  role: (typeof userRoleEnum.enumValues)[number];
  id: string;
}) => {
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
      disabled={role === "VENDOR"}
      onClick={async () => {
        if (role === "VENDOR") {
          toast({
            title: "Vendors can't add to favourites",
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
          Remove from favourites
        </>
      ) : (
        <>
          {status === "pending" ? (
            <Loader size={16} className="mr-2 animate-spin" />
          ) : (
            <Heart size={16} className="mr-2" />
          )}
          Add to favourites
        </>
      )}
    </Button>
  );
};

export default FavroiteButton;
