"use client";

import { useState, useEffect } from "react";

// Components Imports
import RestaurantMap from "./components/map/RestaurantMap";
import RestaurantList from "./components/RestaurantList";

// hook imports
import { useRecommendation } from "@/hooks/useRecommendation";
import RandomButton from "./components/buttons/randomButton";
import ScratchModel from "./components/model/ScratchModel";

export default function Home() {
  
  const [locationShow, setLocationShow] = useState(false)

  const [travelTime, setTravelTime] = useState(0)
  const [averagePrice, setAveragePrice] = useState(0)
  const [categories, setCategories] = useState("")
  const [stars, setStars] = useState(0)

  const [randomRestaurant, setRandomRestaurant] = useState([]);

  const [isOpen, setIsOpen] = useState(false)
  const [revealed, setReaveled] = useState(false)

  // Get the data recommendation.
  const { data, loading, error, refetch } = useRecommendation();

  console.log(randomRestaurant)

  const [restaurantList, setRestaurantList] = useState([
      {"id": 1, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60, "avgPrice": 20},
      {"id": 2, "name": "Golden boy", "stars" : 4, "location": "Marion", "travelTime": 60, "avgPrice": 20},
      {"id": 3, "name": "Hiro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60, "avgPrice": 20},
  ])

  const MOCK_DATA = [
      {"id": 1, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
      {"id": 2, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
      {"id": 3, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
  ]
  // // Track the change of the data
  // useEffect(() => {
  //     setRestaurantList(MOCK_DATA);
  // },[MOCK_DATA])


  function handleFindRestaurant() {
    if (!locationShow) {
      setLocationShow(true);
    }
    refetch();
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-5">
        <img src="/assets/logo-1.png" className="w-13 h-13 text-black"/>
        <h1 className="mt-10 mb-10 text-4xl poppi-style">WhereWeEat? </h1>
      </div>

      <main className={`flex flex-1 ${locationShow ? "justify-between" : "justify-center"} gap-4`} style={{ padding: "2rem" }}>
        <div className={`rounded-lg ${locationShow ? "w-500" : "w-200"} h-auto box-background self-start`}> 
            <h2 className="text-center text-xl mt-3 mb-3 font-bold text-default-color"> Fill your ideal restaurants </h2>
            <div>

                <div>
                  <label className="text-sm"> Expected travel time </label>
                  <input 
                  name="travel-time"
                  type="number"
                  className="border rounded-lg w-10"
                  onChange={(e) => setTravelTime(e.target.value)}/>
                </div>

                <div>
                  <label className="text-sm"> Average Price </label>
                  <input 
                  name="average-price"
                  type="number"
                  className="border rounded-lg w-10"
                  onChange={(e) => setAveragePrice(e.target.value)}/>
                </div>

                <div>
                  <label className="text-sm"> Categories </label>
                  <select
                  name="categories"
                  className="border rounded-lg w-60"
                  onChange={(e) => setCategories(e.target.value)}>
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
                  className="border rounded-lg w-60"
                  onChange={(e) => setStars(e.target.value)}>
                    <option value="1"> Above 1 star</option>
                    <option value="2"> Between 2 - 3 stars </option>
                    <option value="3"> Between 3 - 4 stars </option>
                    <option value="4"> Between 4 - 5 stars </option>
                  </select>
                </div>
            </div>

            {/*Button*/}
            <div 
            className="flex justify-center"
            onClick={() => handleFindRestaurant()}>
              <button className="button cursor-pointer"> Find restaurants </button>
            </div>

            <RandomButton restaurantList={restaurantList} setIsOpen={setIsOpen} setRandomRestaurant={setRandomRestaurant}/>
        </div>

        {locationShow && (
          <div className="rounded-lg w-500 h-auto box-background"> 
            
            <h3 className="text-lg font-bold text-default-color pl-4"> Live Map </h3>
            <div className="flex justify-center mt-5 mb-5 ">
              <RestaurantMap/>
            </div>
            
            {/*Restaurant List*/}
            <h3 className="text-lg font-bold text-default-color pl-4"> 
              List of restaurants 
            </h3>
              <RestaurantList 
                restaurantList={restaurantList} 
                setRestaurantList={setRestaurantList}
                loading={loading}
                error={error}/>
          </div>
        )}

        {isOpen && ( 
          <ScratchModel randomRestaurant={randomRestaurant} revealed={revealed} setRevealed={setReaveled} setIsOpen={setIsOpen}/>
        )}

      </main>
    </div>
  );
}
