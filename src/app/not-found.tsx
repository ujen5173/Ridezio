"use client";
import { Button } from "~/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-semibold text-foreground">
        404 - Page Not Found
      </h1>
      <p className="mb-6 mt-4 text-center text-lg text-slate-600">
        404 page is under construction. Please check back later for better UI.
      </p>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            window.location.reload();
          }}
          variant={"outline"}
        >
          Retry
        </Button>
        <Button
          variant={"primary"}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Back to Homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
