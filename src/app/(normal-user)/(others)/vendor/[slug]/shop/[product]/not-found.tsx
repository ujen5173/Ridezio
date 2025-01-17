"use client";

import { useRouter } from "next/dist/client/components/navigation";
import { Button } from "~/components/ui/button";
import Logo from "~/svg/logo";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Logo tw="h-10 fill-secondary mb-10" />
      <h1 className="text-center text-4xl font-semibold text-foreground">
        404: Off the Map and Off the Grid!
      </h1>
      <p className="mb-6 mt-4 text-center text-lg text-slate-600">
        This page has disappeared faster than a sports car at full throttle. Try
        something else!
      </p>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            router.refresh();
          }}
          variant={"outline"}
        >
          Retry
        </Button>
        <Button
          variant={"primary"}
          onClick={() => {
            router.push("/");
          }}
        >
          Back to Homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
