"use client";

import { useSearchParams } from "next/navigation";
import { getAuthErrorMessage } from "~/app/utils/auth-errors";
import { Button } from "~/components/ui/button";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Authentication Error</h1>
      <p className="mb-6">
        {error ? getAuthErrorMessage(error) : "An unknown error occurred"}
      </p>
      <Button onClick={() => (window.location.href = "/auth/signin")}>
        Try Again
      </Button>
    </div>
  );
}
