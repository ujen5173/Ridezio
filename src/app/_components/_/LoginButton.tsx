"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { getAuthErrorMessage } from "~/app/utils/auth-errors";
import { chakra_petch } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { toast } from "~/hooks/use-toast";
import { Icons } from "~/lib/Icons";
import { cn } from "~/lib/utils";

const LoginButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="py-12 sm:max-w-[655px]">
        <Tabs defaultValue="normal-user" className="w-full sm:min-w-[400px]">
          <TabsContent value="normal-user" className="py-16">
            <div className="mx-auto max-w-[455px]">
              <div className="mb-8">
                <h1
                  className={cn(
                    "mb-2 text-center text-4xl font-semibold",
                    chakra_petch.className,
                  )}
                >
                  Welcome to Velocit
                </h1>
                <p className="text-center text-base text-slate-600">
                  Log in to rent or list vehicles for rent. Convenient rentals,
                  all in one place.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="flex flex-1 flex-col gap-2 text-center">
                  <p className="font-medium">Personal Account</p>
                  <Button
                    className="w-full"
                    onClick={async () => {
                      await axios.post("/api/set-role", {
                        role: "USER",
                      });

                      const result = await signIn("google", {
                        callbackUrl: "/",
                        redirect: true,
                      });

                      if (result?.error) {
                        toast({
                          title: getAuthErrorMessage(result.error),
                          variant: "destructive",
                        });
                        return;
                      }
                    }}
                    variant={"outline"}
                  >
                    <Icons.google className="mr-2 size-6" />
                    Continue with Google
                  </Button>
                </div>
                <Separator
                  orientation="vertical"
                  className="hidden h-16 sm:block"
                />
                <div className="flex flex-1 flex-col gap-2 text-center">
                  <p className="font-medium">Business Acccount</p>

                  <Button
                    className="w-full"
                    onClick={async () => {
                      await axios.post("/api/set-role", {
                        role: "VENDOR",
                      });

                      const result = await signIn("google", {
                        callbackUrl: "/vendor/profile",
                        redirect: true,
                      });

                      if (result?.error) {
                        toast({
                          title: getAuthErrorMessage(result.error),
                          variant: "destructive",
                        });
                        return;
                      }
                    }}
                    variant={"outline"}
                  >
                    <Icons.google className="mr-2 size-6" />
                    Continue with Google
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-center">
                By signing up, you agree to our{" "}
                <Link href="/terms-of-service">
                  <span className="text-secondary underline hover:text-secondary/80">
                    terms of service
                  </span>
                </Link>
                .
              </p>
            </div>
          </TabsContent>
          <TabsContent value="vendor">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you&apos;ll be logged
                  out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
export default LoginButton;
