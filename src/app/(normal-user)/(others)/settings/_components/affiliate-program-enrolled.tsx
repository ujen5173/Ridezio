"use client";
import {
  CheckCircle,
  Copy,
  Gift,
  Loader2,
  QrCode,
  Store,
  UserPlus,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { useState } from "react";
import { chakra_petch } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const MILESTONE = 10;

const AffiliateProgramEnrolled = () => {
  const { data: user, status: userLoading } = useSession();
  const { data: stats, isLoading: statsLoading } =
    api.affiliate.getStats.useQuery(undefined, { enabled: !!user?.user?.id });
  const { data: history, isLoading: historyLoading } =
    api.affiliate.getHistory.useQuery(undefined, { enabled: !!user?.user?.id });
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (
    userLoading === "loading" ||
    !user?.user?.id ||
    statsLoading ||
    historyLoading
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  const referralCode = user.user.id;
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/signin?ref=${referralCode}`
      : `https://yourdomain.com/auth/signin?ref=${referralCode}`;
  const referralMessage = `Join me on Ridezio! Use my referral link to sign up: ${referralLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyMsg = () => {
    navigator.clipboard.writeText(referralMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 1500);
  };

  const progress = stats ? Math.min((stats.users + stats.vendors) / 10, 1) : 0;
  const milestoneLeft = stats
    ? Math.max(0, 10 - (stats.users + stats.vendors))
    : 10;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2
          className={cn(
            "mb-2 flex items-center gap-2 text-2xl font-bold text-slate-700",
            chakra_petch.className,
          )}
        >
          <Gift className="h-7 w-7 text-secondary" /> Affiliate Program
        </h2>
        <p className="mb-6 text-base text-slate-600">
          Help us grow the Ridezio community and get rewarded! Choose your path:
        </p>
      </div>

      {/* Milestone Progress */}
      <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-gradient-to-r from-secondary/10 to-white p-4">
        <div className="flex items-center gap-2">
          <CheckCircle
            className={progress === 1 ? "text-green-500" : "text-slate-400"}
          />
          <span className="font-medium text-slate-700">
            {progress === 1
              ? "Milestone reached!"
              : `Refer ${milestoneLeft} more to unlock a bonus reward!`}
          </span>
        </div>
        <div className="relative h-3 w-full max-w-md overflow-hidden rounded-full bg-slate-200">
          <div
            className="absolute left-0 top-0 h-full bg-secondary transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Referral Link Generator */}
      <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex w-full max-w-xl items-center gap-2">
          <Input
            type="text"
            value={referralLink}
            readOnly
            onClick={handleCopy}
            className="h-[2.1rem]"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            disabled={!referralCode}
          >
            <Copy className="mr-1 h-4 w-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQR((v) => !v)}
            className="rounded-r-md border-l-0"
            disabled={!referralCode}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyMsg}
            disabled={!referralCode}
          >
            {copiedMsg ? "Message Copied!" : "Copy Invite Message"}
          </Button>
        </div>
        {showQR && (
          <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2">
            <QRCode value={referralLink} size={120} />
          </div>
        )}
        <span className="text-xs text-slate-500">
          Share this link or QR code to invite users or vendors.
        </span>
      </div>

      {/* Referral Stats */}
      {stats && (
        <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <div className="flex flex-col items-center">
            <Users className="mb-1 h-6 w-6 text-secondary" />
            <div className="text-lg font-bold text-secondary">
              {stats.users}
            </div>
            <div className="text-xs text-slate-500">Users Referred</div>
          </div>
          <div className="flex flex-col items-center">
            <Store className="mb-1 h-6 w-6 text-secondary" />
            <div className="text-lg font-bold text-secondary">
              {stats.vendors}
            </div>
            <div className="text-xs text-slate-500">Vendors Referred</div>
          </div>
          <div className="flex flex-col items-center">
            <Gift className="mb-1 h-6 w-6 text-secondary" />
            <div className="text-lg font-bold text-secondary">
              {stats.points}
            </div>
            <div className="text-xs text-slate-500">Points Earned</div>
          </div>
        </div>
      )}

      {/* Affiliate Options */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Onboard New Vendors */}
        <div className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-6 shadow-md transition hover:scale-[1.02] hover:shadow-lg">
          <div className="mb-2 flex items-center gap-2">
            <Store className="h-5 w-5 text-secondary" />
            <h3 className="text-xl font-bold text-slate-700">
              Onboard New Vendors
            </h3>
          </div>
          <p className="mb-4 text-slate-600">
            Refer a vehicle rental vendor to Ridezio and they’ll get{" "}
            <span className="font-bold text-secondary">
              1 day of free rentals
            </span>{" "}
            when they join.
          </p>
          <span className="inline-block rounded border border-secondary/10 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
            Free rental for a day
          </span>
        </div>

        {/* Onboard New Users */}
        <div className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-6 shadow-md transition hover:scale-[1.02] hover:shadow-lg">
          <div className="mb-2 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-secondary" />
            <h3 className="text-xl font-bold text-slate-700">
              Onboard New Users
            </h3>
          </div>
          <p className="mb-4 text-slate-600">
            Invite friends to Ridezio! Both you and your friend can{" "}
            <span className="font-bold text-secondary">claim points</span> and
            use them for free rides.
          </p>
          <span className="inline-block rounded border border-secondary/10 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
            Redeem points, win a free 1-day rental
          </span>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-secondary" />
          <span className="font-semibold text-slate-700">Referral History</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Type</th>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">Status</th>
                <th className="px-2 py-1 text-left">Reward</th>
              </tr>
            </thead>
            <tbody>
              {history && history.length > 0 ? (
                history.map((r: any, i: number) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-2 py-1">{r.name}</td>
                    <td className="px-2 py-1">
                      {r.type === "user" ? (
                        <UserPlus className="mr-1 inline h-4 w-4 text-secondary" />
                      ) : (
                        <Store className="mr-1 inline h-4 w-4 text-secondary" />
                      )}
                      {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                    </td>
                    <td className="px-2 py-1">{r.date}</td>
                    <td className="px-2 py-1">
                      {r.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-500">
                          <Gift className="h-4 w-4" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1">{r.reward}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-2 py-4 text-center text-slate-400"
                  >
                    No referral history yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleCopy}
          disabled={!referralCode}
        >
          {copied ? "Copied!" : "Get Your Referral Link"}
        </Button>
        <p className="max-w-lg text-center text-sm text-slate-500">
          Share your referral link with vendors or users. When they sign up and
          complete their first booking, you both get rewarded!
        </p>
      </div>
    </div>
  );
};

export default AffiliateProgramEnrolled;
