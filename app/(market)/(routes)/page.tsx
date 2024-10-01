import CategorySelection from "@/components/general/category-selection";
import ClientSlider from "../_components/client-slider";
import CategoryItems from "@/components/general/category-items";
import EventCarousel from "@/components/general/event-carousel";
import { MapDrawer } from "@/components/general/map-drawer";

export default function Home() {

  return (
    <div className="w-full h-auto min-h-[100vh] flex flex-col relative">
      {/* image slider */}
      <div className="h-[20rem] md:h-[40rem]">
        <ClientSlider />
      </div>
      {/* category selection */}
      <div className="bg-transparent h-auto min-h-[20rem] -mt-[6rem]"> 
          <CategorySelection />
        {/* 3 column dashboard */}
        <div className="w-full h-auto p-4">
          <EventCarousel />
        </div>
        {/* items add to cart */}
        <div className="w-full h-auto px-2 md:px-10" id="item-storage">
          <CategoryItems />
        </div>
      </div>
      <MapDrawer />
    </div>
  );
}
