"use client";

import { useStore } from "@/store/useStore";
import RestaurantMap from "./map/RestaurantMap";
import { TransportMode } from "@/lib/types";

import { IoTimeOutline } from "react-icons/io5";
import { GiPathDistance } from "react-icons/gi";

const MODES: TransportMode[] = ["walking", "biking", "driving"];

export default function ResultsPanel() {
  const selected = useStore((s) => s.selected);
  const routes = useStore((s) => s.routes);
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const showMainMap = useStore((s) => s.showMainMap);

  return (
    <div className="rounded-lg w-[70%] h-auto box-background shadow-lg self-center">
      <h3 className="text-lg font-bold text-default-color pl-4 text-center poppi-style"> Live Map </h3>

      <div className="flex justify-center mt-5 mb-5">
        {showMainMap ? (
          <RestaurantMap
            route={routes ? routes[mode].geometry : null}
            destination={selected}
          />
        ) : (
          <div
            className="flex items-center border border-dotted rounded-lg text-2xl"
            style={{ height: "400px", width: "550px" }}
          />
        )}
      </div>

      {routes && (
        <div className="flex flex-col items-center">
          <div className="flex gap-3">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`cursor-pointer select-transport py-2 shadow-lg ${
                  mode === m ? "bg-[#e76268] text-[#e7edf2]" : "bg-[#e7edf2] text-[#193948]"
                } text-center`}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <p className="flex items-center justify-center gap-2 bg-white rounded-xl w-25 shadow-lg">
              <IoTimeOutline aria-label="Duration" /> {routes[mode].duration_min} min
            </p>
            <p className="flex items-center justify-center gap-2 bg-white rounded-xl w-25 shadow-lg">
              <GiPathDistance aria-label="Distance" /> {routes[mode].distance_km} km
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
