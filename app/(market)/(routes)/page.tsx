import CategorySelection from "@/components/general/category-selection";
import CategoryItems from "@/components/general/category-items";
import { AppleCardsCarouselDemo } from "@/components/general/event-carousel";
import { MapDrawer } from "@/components/general/map-drawer";
import { getCategories } from "@/app/actions/get-categories";
import { getEvents } from "@/app/actions/get-events";
import Image from "next/image";
import { Suspense } from "react";

export default async function Home() {
  // Fetch data in the server component itself
  const categoriesPromise = getCategories();
  const eventsPromise = getEvents();

  // Use Suspense to show loading states while waiting for the data
  return (
    <div className="w-full h-auto min-h-[100vh] flex flex-col relative">
      <div className="h-[20rem] md:h-[40rem]">
        <div className="w-full h-full relative">
          <Image
            src="/home-image.png"
            alt="Home Page"
            layout="fill"
            className="object-cover"
          />
        </div>
      </div>
      <div className="bg-transparent h-auto min-h-[20rem] -mt-[6rem]"> 
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategorySelection categories={await categoriesPromise} />
        </Suspense>
        <Suspense fallback={<div>Loading events...</div>}>
          <AppleCardsCarouselDemo events={await eventsPromise} />
        </Suspense>
        <div className="w-full h-auto px-2 md:px-10" id="item-storage">
          <CategoryItems />
        </div>
      </div>
      <MapDrawer />
    </div>
  );
}
