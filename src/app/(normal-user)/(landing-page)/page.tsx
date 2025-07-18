import { Map } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import HeroSection from "~/app/_components/_/HeroSection";
import ShopsAroundWrapper from "~/app/_components/_/ShopsAroundWrapper";
import { Button } from "~/components/ui/button";
import BecomePartner from "./_components/BecomePartner";
import ExplorePopularPlaces from "./_components/ExplorePopularPlaces";
import Faqs from "./_components/Faqs";
import JoinAffiateProgram from "./_components/JoinAffiateProgram";
import ShopsAroundLoading from "./_components/ShopsAroundLoading";

const Home = async () => {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<ShopsAroundLoading />}>
        <ShopsAroundWrapper />
      </Suspense>
      <ExplorePopularPlaces />
      <BecomePartner />
      <JoinAffiateProgram />
      <Faqs />
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
