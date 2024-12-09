import { Map } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import HeroSection from "~/app/_components/_/HeroSection";
import PopularShops from "~/app/_components/_/PopularShops";
import ShopsAroundWrapper from "~/app/_components/_/ShopsAroundWrapper";
import UpcomingEvent from "~/app/_components/_/UpcomingEvent";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import ShopsAroundLoading from "./_components/ShopsAroundLoading";

const Home = async () => {
  const [popularShops, events] = await Promise.all([
    api.business.getPopularShops(),
    api.events.getUpcomingEvents(),
  ]);

  return (
    <>
      <HeroSection />
      <Suspense fallback={<ShopsAroundLoading />}>
        <ShopsAroundWrapper />
      </Suspense>
      <PopularShops popularShopsData={popularShops} />
      <UpcomingEvent events={events} />
      <Button
        asChild
        className="fixed bottom-5 right-5 z-50 gap-1"
        variant="outline"
      >
        <Link href="/search">
          <Map size={18} className="text-slate-600" />
          Explore Shops Around you
        </Link>
      </Button>
    </>
  );
};

export default Home;
