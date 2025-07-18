"use client";
import {
  ArrowRight,
  Gift,
  Loader2,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import AffiliateProgramEnrolled from "./affiliate-program-enrolled";

const AffiliateProgram = () => {
  const {
    data: enrolled,
    isLoading,
    refetch,
  } = api.affiliate.isUserEnrolled.useQuery();
  const enrollMutation = api.affiliate.enroll.useMutation();
  const [enrolling, setEnrolling] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (enrolled) {
    return <AffiliateProgramEnrolled />;
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="flex flex-col items-center gap-2">
        <div className="mb-2 rounded-full bg-secondary/10 p-4">
          <Gift className="h-10 w-10 text-secondary" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800">
          Join the Ridezio Affiliate Program!
        </h2>
        <p className="max-w-xl text-center text-lg text-slate-600">
          Help us grow the Ridezio community and get rewarded for every friend
          or vendor you bring on board. Unlock exclusive perks, points, and
          more!
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-6 shadow">
          <Users className="mb-2 h-8 w-8 text-secondary" />
          <h3 className="mb-1 text-lg font-bold">Earn Points</h3>
          <p className="text-center text-slate-500">
            Get points for every user or vendor you refer. Redeem them for free
            rides and rewards!
          </p>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-6 shadow">
          <Store className="mb-2 h-8 w-8 text-secondary" />
          <h3 className="mb-1 text-lg font-bold">Exclusive Vendor Perks</h3>
          <p className="text-center text-slate-500">
            Vendors you refer get a{" "}
            <span className="font-semibold text-secondary">
              free day of rentals
            </span>{" "}
            when they join.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-6 shadow">
          <Sparkles className="mb-2 h-8 w-8 text-secondary" />
          <h3 className="mb-1 text-lg font-bold">Unlock Milestone Bonuses</h3>
          <p className="text-center text-slate-500">
            Hit referral milestones to unlock special rewards and recognition in
            the community!
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl rounded-xl border border-slate-100 bg-slate-50 p-6">
        <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-700">
          <ArrowRight className="h-5 w-5 text-secondary" /> How It Works
        </h4>
        <ol className="list-inside list-decimal space-y-2 text-slate-600">
          <li>
            Click the{" "}
            <span className="font-semibold text-secondary">Enroll</span> button
            below.
          </li>
          <li>
            Get your unique referral link and share it with friends or vendors.
          </li>
          <li>
            Earn points and rewards when they sign up and complete their first
            booking!
          </li>
        </ol>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <Button
          variant="secondary"
          size="lg"
          disabled={enrolling || enrollMutation.status === "pending"}
          onClick={async () => {
            setEnrolling(true);
            await enrollMutation.mutateAsync();
            setEnrolling(false);
            refetch();
          }}
        >
          {enrolling || enrollMutation.status === "pending" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Enrolling...
            </>
          ) : (
            "Enroll Now"
          )}
        </Button>
        {enrollMutation.error && (
          <span className="mt-2 text-sm text-red-500">
            {enrollMutation.error.message}
          </span>
        )}
        <div className="mt-8 max-w-lg text-center italic text-slate-500">
          “Over <span className="font-bold text-secondary">500+</span> users
          have already earned rewards through our affiliate program. Join them
          today!”
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram;
