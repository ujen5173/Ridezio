import { useEffect } from "react";
import { api } from "~/trpc/react";

interface ViewTrackerProps {
  slug: string;
  delay?: number;
  cooldownHours?: number;
}

const useViewTracker = ({
  slug,
  delay = 500,
  cooldownHours = 24,
}: ViewTrackerProps) => {
  const { refetch } = api.business.views.useQuery(
    { slug },
    {
      enabled: false,
    },
  );

  useEffect(() => {
    const storageKey = `view_${slug}_timestamp`;
    const lastView = localStorage.getItem(storageKey);

    if (lastView) {
      const hoursSinceLastView =
        (new Date().getTime() - new Date(lastView).getTime()) /
        (1000 * 60 * 60);
      if (hoursSinceLastView < cooldownHours) return;
    }
    const timeout = setTimeout(() => {
      void refetch();
      localStorage.setItem(storageKey, new Date().toISOString());
    }, delay);

    return () => clearTimeout(timeout);
  }, [slug]);
};

export default useViewTracker;
