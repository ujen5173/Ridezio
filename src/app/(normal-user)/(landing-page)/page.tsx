// export const dynamic = "force-static";

import { Map } from "lucide-react";
import Link from "next/link";
import HeroSection from "~/app/_components/_/HeroSection";
import PopularShops from "~/app/_components/_/PopularShops";
import UpcomingEvent from "~/app/_components/_/UpcomingEvent";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import ShopsAround from "./_components/ShopsAround";

const Home = async () => {
  const [popularShops, events, shopsAround] = await Promise.all([
    api.business.getPopularShops(),
    api.events.getUpcomingEvents(),
    api.business.getVendorAroundLocation(),
  ]);

  return (
    <>
      <HeroSection />
      <ShopsAround shopsAroundData={shopsAround} />
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
