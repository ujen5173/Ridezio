// general.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "~/app/_components/contexts/root";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/hooks/use-toast";
import { useUploadFile } from "~/hooks/useUploadthing";
import { type userRoleEnum } from "~/server/server.types";
import { api } from "~/trpc/react";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
  phoneNumber: z.string().max(11).optional().nullable(),
  email: z.string().email(),
  image: z.string().url(),
});

const GeneralSettings = ({
  user,
}: {
  user: {
    name: string;
    email: string;
    image: string;
    phoneNumber: string | undefined | null;
    role: userRoleEnum;
  };
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: user,
  });

  const { mutateAsync, status } = api.user.update.useMutation();
  const { data, update } = useSession();
  const { setUser } = useUser();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync({
      ...values,
    });

    const newUser = {
      ...data,
      user: {
        ...data!.user,
        ...form.getValues(),
      },
    } as Session | null;

    // this works
    void update(newUser);

    setUser(newUser);

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  }

  const { uploadFiles, progresses, uploadedFile, isUploading } =
    useUploadFile("imageUploader");

  useEffect(() => {
    if (uploadedFile) {
      toast({
        title: "Image uploaded",
        description: "Image uploaded successfully",
      });
    }
  }, [uploadedFile]);

  useEffect(() => {
    if (uploadedFile && uploadedFile.length > 0 && uploadedFile[0]?.url) {
      form.setValue("image", uploadedFile[0].url);
    }
  }, [uploadedFile, form]);

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">General</h2>
      <p className="mb-6 text-base text-slate-600">
        Settings and options for your account.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={form.getValues("email")} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Profile</Label>
            <div className="flex items-center gap-2">
              <div
                style={{
                  backgroundImage: `url(${uploadedFile ? (uploadedFile[0]?.url ?? user.image) : (user.image ?? "")})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="size-16 rounded-full border border-slate-200 bg-slate-100"
              ></div>
              <Button
                disabled={isUploading}
                type="button"
                variant="outline"
                className="p-0"
                size="sm"
              >
                <label
                  className="inline-block h-8 px-3 leading-[2.5]"
                  htmlFor="image"
                >
                  {isUploading ? `Uploading ${progresses}%` : "Upload"}
                </label>
              </Button>
            </div>
            <input
              accept={"image/png, image/jpeg, image/jpg"}
              type="file"
              hidden
              id="image"
              max={1}
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  void uploadFiles(Array.from(files));
                }
              }}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Phone Number
                    <span className="text-xs italic text-slate-500">
                      (Will be used while booking)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+977 9*********"
                      autoComplete="off"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-10 flex justify-start gap-2">
            <Button
              disabled={status === "pending" || isUploading}
              // type="submit"
              onClick={() => onSubmit(form.getValues())}
              variant={"primary"}
            >
              {status === "pending" ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GeneralSettings;
