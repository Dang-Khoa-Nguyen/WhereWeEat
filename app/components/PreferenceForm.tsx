"use client";

import { useApp } from "@/app/context/AppContext";

export default function PreferenceForm() {
  const {
    travelTime, setTravelTime,
    cuisine, setCuisine,
    stars, setStars,
    showResults,
    loadingList,
    findRestaurants, pickRandom,
  } = useApp();

  return (
    <div className={`rounded-lg w-[70%] h-auto box-background self-center shadow-lg`}>
      <h2 className="text-center text-xl mt-3 mb-3 font-bold text-default-color poppi-style"> Fill your ideal restaurants </h2>

      <div className="flex justify-center">
        <div className="w-[90%]">
          <div className="flex flex-col gap-1 w-full my-2">
            <label htmlFor="travel-time" className="text-sm font-bold text-gray-600">How long are you willing to travel? (min)</label>
            <input
              id="travel-time" 
              type="number"
              value={travelTime}
              onChange={(e) => {
                const value = e.target.value;
                setTravelTime(value === "" ? "" : Number(value));
              }}
              className="w-full rounded-lg border border-[#193948] px-3 py-2 text-sm bg-[#e7edf2]
                        focus:outline-none focus:ring-2 focus:ring-[#e76268] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1 w-full my-2">
            <label htmlFor="cuisine" className="text-sm font-bold text-gray-600"> Cuisine </label>
            <select
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full rounded-lg border border-[#193948] px-3 py-2 text-sm bg-[#e7edf2]
                        focus:outline-none focus:ring-2 focus:ring-[#e76268] focus:border-transparent">
              <option value=""> Any </option>
              <option value="vietnamese"> Vietnamese </option>
              <option value="chinese"> Chinese </option>
              <option value="japanese"> Japanese </option>
              <option value="australian"> Australian </option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full my-2">
            <label htmlFor="rating" className="text-sm font-bold text-gray-600"> Minimum rating </label>
            <select
              id="rating"
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
              className="w-full rounded-lg border border-[#193948] px-3 py-2 text-sm bg-[#e7edf2]
                        focus:outline-none focus:ring-2 focus:ring-[#e76268] focus:border-transparent">
              <option value="1"> Any rating </option>
              <option value="3"> 3+ stars </option>
              <option value="4"> 4+ stars </option>
              <option value="5"> 5 stars </option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <hr className="my-5 w-[70%]" />
      </div>

      <div className="flex justify-center">
        <button
          onClick={findRestaurants}
          disabled={loadingList}
          className={`button shadow-lg ${loadingList ? "cursor-wait opacity-50" : "cursor-pointer opacity-100"}`}>
          Find restaurants
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={pickRandom}
          disabled={loadingList}
          className={`button-random shadow-lg ${loadingList ? "cursor-wait opacity-50" : "cursor-pointer opacity-100"}`}>
          Random restaurant
        </button>
      </div>
    </div>
  );
}
