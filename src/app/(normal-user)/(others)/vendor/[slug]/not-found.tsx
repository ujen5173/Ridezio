"use client";

import { Button } from "~/components/ui/button";

const NotFound = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/background-pattern.png')",
      }}
      className="flex h-screen flex-col items-center justify-center"
    >
      <h1 className="text-center text-4xl font-semibold text-foreground">
        404 Vendor Not Found: Must Be Stuck in Traffic!
      </h1>
      <p className="mb-6 mt-4 text-center text-lg text-slate-600">
        Whoops! This vendor took the exit to nowhere. 🛣️ Maybe try searching for
        another?
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
