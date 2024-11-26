"use client";
import { CircleHelp } from "lucide-react";
import { inter } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import useBusinessFormContext from "../hooks/useBusinessFormContext";

const LocationDetails = () => {
  const { form } = useBusinessFormContext();

  const steps = [
    {
      title: "Go to Google Maps",
      description:
        "Visit maps.google.com and search for your business location",
    },
    {
      title: "Share Location",
      description: "Click the 'Share' button in the left sidebar",
    },
    {
      title: "Get Embed Code",
      description: "Select 'Embed a map' tab in the sharing dialog",
    },
    {
      title: "Copy Code",
      description: "Click 'COPY HTML' to get the iframe code",
    },
    {
      title: "Paste Code Here",
      description: "Paste the copied code in the input field above",
    },
  ];

  return (
    <div className="mb-6">
      <h1 className="mb-4 text-2xl font-semibold">Location Details</h1>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="location.address"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                placeholder="Jhamshikhel, Kathmandu"
                {...field}
                value={field.value}
                id="address"
              />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="location.city"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                placeholder="Kathmandu"
                {...field}
                value={field.value}
                id="city"
              />
            </div>
          )}
        />
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="location.lat"
          render={({ field }) => (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="lat">Latitude</Label>
                <div className="text-sm text-slate-500">
                  (Required for location based searches)
                </div>
              </div>
              <div className="relative">
                <Input
                  placeholder="27.7103"
                  {...field}
                  value={field.value}
                  id="lat"
                />

                <Button
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition((position) => {
                      form.setValue("location.lat", position.coords.latitude);
                      form.setValue("location.lng", position.coords.longitude);
                    });
                  }}
                >
                  Auto Detect
                </Button>
              </div>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="location.lng"
          render={({ field }) => (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="lng">Lognitude</Label>
                <div className="text-sm text-slate-500">
                  (Required for location based searches)
                </div>
              </div>
              <div className="relative">
                <Input
                  placeholder="85.3222"
                  {...field}
                  value={field.value}
                  id="lng"
                />
                <Button
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition((position) => {
                      form.setValue("location.lat", position.coords.latitude);
                      form.setValue("location.lng", position.coords.longitude);
                    });
                  }}
                >
                  Auto Detect
                </Button>
              </div>
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <p className="text-base text-slate-600">Embed a google map</p>
          <Dialog>
            <DialogTrigger className="flex items-center gap-1">
              <span className="text-sm text-secondary underline">Help</span>
              <CircleHelp className="h-4 w-4 cursor-pointer text-secondary transition-colors" />
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="mb-4 text-xl font-semibold text-slate-700">
                  How to Embed Google Maps
                </DialogTitle>
              </DialogHeader>

              <div className={cn(inter.className, "space-y-6")}>
                <div className="grid gap-6">
                  {steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-secondary/20">
                        <span className="font-semibold text-secondary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-medium text-gray-700">
                          {step.title}
                        </h3>
                        <p className="text-base text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-900">
                    Example iframe code:
                  </h4>
                  <code className="block rounded border border-gray-200 bg-white p-3 text-sm text-gray-600">
                    &lt;iframe
                    src=&quot;https://www.google.com/maps/embed?...&quot;
                    width=&quot;600&quot; height=&quot;450&quot;
                    style=&quot;border:0;&quot; allowfullscreen=&quot;&quot;
                    loading=&quot;lazy&quot;
                    referrerpolicy=&quot;no-referrer-when-downgrade&quot;&gt;&lt;/iframe&gt;
                  </code>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <FormField
          control={form.control}
          name="location.map"
          render={({ field }) => (
            <Input
              placeholder="<iframe src='...' />"
              id="map"
              {...field}
              onChange={(e) => {
                const data = e.target.value.split('src="')[1]?.split(`" `)[0];
                form.setValue("location.map", data ?? "");
              }}
              className="font-mono text-sm"
            />
          )}
        />
        <div className="h-96 rounded-md border border-border bg-slate-50">
          {form.getValues("location.map") ? (
            <iframe
              src={form.getValues("location.map")}
              width="100%"
              height="100%"
              style={{ border: 0 }}
            ></iframe>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              No map provided
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
