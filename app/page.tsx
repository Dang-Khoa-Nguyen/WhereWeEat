"use client";
import { useState } from "react";

export default function Home() {
  
  const [locationShow, setLocationShow] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-center gap-5">
        <img src="/assets/logo-1.png" className="w-13 h-13 text-black"/>
        <h1 className="mt-10 mb-10 poppi-style">WhereWeEat? </h1>
      </div>

      <main className={`flex flex-1 items-center ${locationShow ? "justify-between" : "justify-center"} gap-4`} style={{ padding: "2rem" }}>
        <div className={`rounded-lg ${locationShow ? "w-500" : "w-200"} h-auto box-background`}> 
            <h2 className="text-center text-xl mt-3 mb-3 font-bold"> Fill your ideal restaurants </h2>
            <div>

                <div>
                  <label className="text-sm"> Expected travel time </label>
                  <input 
                  name="travel-time"
                  type="number"
                  className="border rounded-lg w-10"/>
                </div>

                <div>
                  <label className="text-sm"> Average Price </label>
                  <input 
                  name="average-price"
                  type="number"
                  className="border rounded-lg w-10"/>
                </div>

                <div>
                  <label className="text-sm"> Categories </label>
                  <select
                  name="categories"
                  className="border rounded-lg w-60">
                    <option> Vietnamese </option>
                    <option> Chinese </option>
                    <option> Japanese </option>
                    <option> Fine Dining </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm"> Stars </label>
                  <select
                  name="categories"
                  className="border rounded-lg w-60">
                    <option> Above 1 star</option>
                    <option> Between 2 - 3 stars </option>
                    <option> Between 3 - 4 stars </option>
                    <option> Between 4 - 5 stars </option>
                  </select>
                </div>
            </div>

            {/*Button*/}
            <div className="flex justify-center">
              <button className="button"> Find restaurants </button>
            </div>

            <div className="flex justify-center">
              <button className="button-random"> Random restaurant </button>
            </div>
        </div>

        {locationShow && (
          <div className="rounded-lg  w-500 h-100 box-background"> 
            {/*TODO: map and routing*/}

            {/*TODO: List of restaurants*/}

          </div>
        )}
      </main>
    </div>
  );
}
