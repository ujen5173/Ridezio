"use client";

import { Share, Users } from "lucide-react";
import Image from "next/image";
import HeaderHeight from "~/app/_components/_/HeaderHeight";
import { nunito } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { eventDetail } from "~/lib/data";
import { cn } from "~/lib/utils";

const EventPage = () => {
  return (
    <>
      <HeaderHeight />
      <section className="relative">
        <div className="mx-auto max-w-[1440px] px-4 py-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-10">
            <h1 className={cn("mb-6 text-4xl font-bold lg:text-5xl")}>
              {eventDetail.title}
            </h1>
            <Button variant={"outline"} className="hidden md:flex">
              Share
              <Share size={16} className="ml-2" />
            </Button>
          </div>
          <div className="mb-4 flex items-center space-x-4">
            <Image
              alt=""
              width={100}
              height={100}
              src={eventDetail.hostedBy.logo}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <p className="text-gray-500">Hosted by</p>
              <h2 className="text-lg font-semibold">
                {eventDetail.hostedBy.name}
              </h2>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-slate-50 py-8 md:py-12">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 lg:flex-row lg:gap-20">
              <div className={cn("flex-1", nunito.className)}>
                {eventDetail.details.content.map((block, index) => {
                  if (block.type === "heading") {
                    return (
                      <h2 key={index} className="mb-4 text-2xl font-semibold">
                        {block.content[0]!.text}
                      </h2>
                    );
                  } else if (block.type === "paragraph") {
                    return (
                      <p key={index} className="mb-4 text-lg">
                        {block.content.map((text, index) => {
                          if (text.type === "text") {
                            return text.text;
                          }
                        })}
                      </p>
                    );
                  }

                  return null;
                })}
              </div>
              <div className="w-full space-y-8 lg:w-96">
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h1 className="mb-4 text-2xl font-bold">
                    Participate this event
                  </h1>
                  <div className="mb-4 flex items-center gap-2">
                    <Users size={18} className="text-slate-600" />
                    <span>10 people are attending</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button className="lg:w-full" variant={"secondary"}>
                      Participate Now
                    </Button>
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow-md">
                  <div className="p-6">
                    <h2 className="mb-2 text-lg font-medium">
                      {eventDetail.starting.place}
                    </h2>
                    <p className="text-gray-500">{eventDetail.starting.city}</p>
                  </div>
                  {/* Map */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3119.1624748120644!2d85.3040208749192!3d27.67988217619825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1836464c6a77%3A0x17dcfae97cc9d583!2sThe%20Bike%20Farm%20Nepal!5e1!3m2!1sen!2snp!4v1729957562437!5m2!1sen!2snp"
                    className="h-96 w-full md:h-72"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow-md">
                  <div className="p-6">
                    <div>
                      <h2 className="mb-2 text-lg font-medium">
                        Date and time
                      </h2>
                      <p className="text-gray-500">{eventDetail.date}</p>
                    </div>
                    <Separator className="my-4" />
                    <div>
                      <h2 className="mb-2 text-lg font-medium">
                        {eventDetail.destination.place}
                      </h2>
                      <p className="text-gray-500">
                        {eventDetail.destination.city}
                      </p>
                    </div>
                  </div>
                  {/* Map */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12464.301092321493!2d85.38059229661384!3d27.78779486818061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1c5a26c6abb9%3A0x20241c5624adb472!2sShivapuri%20Hill!5e1!3m2!1sen!2snp!4v1729957584878!5m2!1sen!2snp"
                    className="h-96 w-full md:h-72 lg:h-60"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 left-0 hidden w-full bg-white shadow-sm md:block">
            <div className="mx-auto flex max-w-[1440px] gap-4 px-4 py-4">
              <div className="flex-1">
                <p className="text-lg text-slate-600">
                  {new Date(eventDetail.date).toLocaleString()}
                </p>
                <h2 className="text-xl font-black text-slate-700 md:text-2xl">
                  {eventDetail.title}{" "}
                  <span className="underline">
                    By {eventDetail.hostedBy.name}
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={"outline"}>
                  Share
                  <Share size={16} className="ml-2" />
                </Button>
                <Button variant={"secondary"}>Participate</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventPage;
