import { Map } from "lucide-react";
import HeroSection from "~/app/_components/_/HeroSection";
import PopularShops from "~/app/_components/_/PopularShops";
import UpcomingEvent from "~/app/_components/_/UpcomingEvent";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const Home = async () => {
  const popularShopsData = await api.business.getPopularShops();

  return (
    <>
      <HeroSection />
      <PopularShops popularShopsData={popularShopsData} />
      {/* <Shops /> */}
      <UpcomingEvent />

      <Button className="fixed bottom-5 right-5 z-50 gap-1" variant="outline">
        <Map size={18} className="text-slate-600" />
        Explore Shops Around you
      </Button>
    </>
  );
};

export default Home;
