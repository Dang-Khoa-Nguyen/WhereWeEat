"use client";

import { useStore } from "@/store/useStore";
import PreferenceForm from "./components/PreferenceForm";
import ResultsPanel from "./components/ResultsPanel";
import ScratchModel from "./components/model/ScratchModel";
import RestaurantList from "./components/RestaurantList";
import Image from "next/image";

export default function Home() {
  // One selector per field — each re-renders this component only when that field changes.
  const results = useStore((s) => s.results);
  const loadingList = useStore((s) => s.loadingList);
  const error = useStore((s) => s.error);
  const selectRestaurant = useStore((s) => s.selectRestaurant);
  const removeRestaurant = useStore((s) => s.removeRestaurant);
  const showResults = useStore((s) => s.showResults);
  const isRevealOpen = useStore((s) => s.isRevealOpen);

  return (
    <div>
      <div className="flex items-center justify-center gap-5">
        <Image alt="WhereWeEat logo" src="/assets/logo-1.png" className="w-13 h-13 text-black" width={40} height={50} />
        <h1 className="mt-10 mb-10 text-4xl poppi-style">WhereWeEat? </h1>
      </div>

      <main className={`flex flex-col gap-4`} style={{ padding: "2rem" }}>
        <PreferenceForm />
        {showResults && (
          <div className="flex flex-col items-center gap-4 w-full">
            <ResultsPanel />
            <div className={`rounded-lg  w-[70%] h-auto box-background shadow-lg`}>
              <h3 className="text-lg font-bold text-default-color pl-4 poppi-style text-center align-center h-7"> List of restaurants </h3>
              <RestaurantList
                restaurantList={results}
                onSelect={selectRestaurant}
                onDelete={removeRestaurant}
                loading={loadingList}
                error={error}
              />
            </div>
          </div>
        )}
      </main>

      {isRevealOpen && <ScratchModel />}
    </div>
  );
}
