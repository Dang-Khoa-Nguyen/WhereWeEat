"use client";

import { useState, useEffect } from "react";

// Components Imports
import RestaurantMap from "./components/map/RestaurantMap";
import RestaurantList from "./components/RestaurantList";

// hook imports
import { useRecommendation } from "@/hooks/useRecommendation";
import RandomButton from "./components/buttons/randomButton";
import ScratchModel from "./components/model/ScratchModel";

// utils
import { getCoords } from "@/lib/geo";

// Icon Imports
import { GiPathDistance } from "react-icons/gi";
import { IoTimeOutline } from "react-icons/io5";

export default function Home() {
  
  const [locationShow, setLocationShow] = useState(false)
  const [hiddenMap, setHiddenMap] = useState(true)

  const [travelTime, setTravelTime] = useState("")
  const [averagePrice, setAveragePrice] = useState(0)
  const [categories, setCategories] = useState("vietnamese")
  const [stars, setStars] = useState(1)

  const [randomRestaurant, setRandomRestaurant] = useState([]);

  const [isOpen, setIsOpen] = useState(false)
  const [revealed, setReaveled] = useState(false)

  const [routes, setRoutes] = useState(null);   
  const [mode, setMode] = useState("walking");

  const [selectedRestaurant, setSelectedRestaurant] = useState(null); 

  const [transport, setTransport] = useState("walking");

  const userInput = {
    travelTime: travelTime,
    categories: categories,
    stars: stars,
  }

  // Get the data recommendation.
  const { data, loading, error, search } = useRecommendation();

  const [restaurantList, setRestaurantList] = useState([])

  console.log(restaurantList)

  // const MOCK_DATA = [
  //     {"id": 1, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60, "avgPrice": 20, "cuisine": "Vietnamese"},
  //     {"id": 2, "name": "Golden boy", "stars" : 4, "location": "Marion", "travelTime": 60, "avgPrice": 20, "cuisine": "Japanese"},
  //     {"id": 3, "name": "Hiro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60, "avgPrice": 20, "cuisine": "Chinese"},
  // ]
  // Track the change of the data
  useEffect(() => {
      setRestaurantList(data);
  },[data])


  function handleFindRestaurant() {
    if (!locationShow) {
      setLocationShow(true);
    }
    search({travelTime,categories,stars});
  }

  // Shared by BOTH the list click (Find) and the Random button:
  // given a restaurant, fetch its route (all modes) and store it.
  async function handleShowRoute(restaurant: any) {
    if (!restaurant) return;

    setSelectedRestaurant(restaurant);
    try {
      const c = await getCoords();
      const res = await fetch(
        `http://127.0.0.1:8000/route?from_lat=${c.lat}&from_lng=${c.lng}&to_lat=${restaurant.lat}&to_lng=${restaurant.lng}`
      );
      if (!res.ok) throw new Error("Failed to fetch route");
      setRoutes(await res.json());
    } catch (err: any) {
      console.log(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-5">
        <img src="/assets/logo-1.png" className="w-13 h-13 text-black"/>
        <h1 className="mt-10 mb-10 text-4xl poppi-style">WhereWeEat? </h1>
      </div>

      <main className={`flex flex-1 ${locationShow ? "justify-between" : "justify-center"} gap-4`} style={{ padding: "2rem" }}>
        <div className={`rounded-lg ${locationShow ? "w-500" : "w-200"} h-auto box-background self-start shadow-lg`}> 
            <h2 className="text-center text-xl mt-3 mb-3 font-bold text-default-color poppi-style"> Fill your ideal restaurants </h2>
            <div className="flex justify-center">
              <div className="w-[90%]">
                <div className="flex justify-center">
                  {/* <div  className="flex flex-col w-full">
                    <label className="text-sm"> Average Price </label>
                    <input 
                    name="average-price"
                    type="number"
                    className="border rounded-lg w-[50%] h-10"
                    onChange={(e) => setAveragePrice(Number(e.target.value))}/>
                  </div> */}

                 <div className="flex flex-col gap-1 w-full my-2">
                  <label className="text-sm font-bold text-gray-600">How long are you willing to travel? (min)</label>
                  <input
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

                </div>

                  <div className="flex flex-col gap-1 w-full my-2">
                    <label className="text-sm font-bold text-gray-600"> Cuisine </label>
                    <select
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        className="w-full rounded-lg border border-[#193948] px-3 py-2 text-sm bg-[#e7edf2]
                              focus:outline-none focus:ring-2 focus:ring-[#e76268] focus:border-transparent">
                      <option value="vietnamese"> Vietnamese </option>
                      <option value="chinese"> Chinese </option>
                      <option value="japanese"> Japanese </option>
                      <option value="australian"> Australian </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 w-full my-2">
                    <label className="text-sm font-bold text-gray-600"> Average Rating </label>
                    <select
                    name="stars"
                    className="w-full rounded-lg border border-[#193948] px-3 py-2 text-sm bg-[#e7edf2]
                              focus:outline-none focus:ring-2 focus:ring-[#e76268] focus:border-transparent"
                    onChange={(e) => setStars(Number(e.target.value))}>
                      <option value="1"> Above 1 star</option>
                      <option value="2"> Between 2 - 3 stars </option>
                      <option value="3"> Between 3 - 4 stars </option>
                      <option value="4"> Between 4 - 5 stars </option>
                    </select>
                  </div>

                  {/* <div className="flex flex-col gap-1 w-full my-2">
                    <label className="text-sm font-bold text-gray-600"> Expected Transport </label>
                    <select
                        value={transport}
                        onChange={(e) => setTransport(e.target.value)}
                        className="w-full rounded-lg border border-[#193948] px-3 py-2 text-sm bg-[#e7edf2]
                              focus:outline-none focus:ring-2 focus:ring-[#e76268] focus:border-transparent">
                      <option value="walking"> Walking </option>
                      <option value="biking"> Biking </option>
                      <option value="driving"> Driving </option>
                    </select>
                  </div> */}
              </div>
            </div>
            
            <div className="flex justify-center">
              <hr className="my-5 w-[70%]"/>
            </div>
            {/*Button*/}
            <div 
            className="flex justify-center"
            onClick={() => handleFindRestaurant()}>
              <button className={`button shadow-lg ${loading ? "cursor-wait opacity-50" : "cursor-pointer opacity-100"}`}> Find restaurants </button>
            </div>

            <RandomButton
            userInput={userInput}
            restaurantList={restaurantList} setIsOpen={setIsOpen} setRandomRestaurant={setRandomRestaurant}
            setHiddenMap={setHiddenMap}
            onChosen={handleShowRoute}/>
        </div>

        {locationShow && (
          <div className="rounded-lg w-500 h-auto box-background shadow-lg"> 
            
            <h3 className="text-lg font-bold text-default-color pl-4"> Live Map </h3>
            <div className="flex justify-center mt-5 mb-5 ">
              {hiddenMap ? (
<RestaurantMap route={routes ? routes[mode].geometry : null} destination={selectedRestaurant}/>
              ) : ( 
                <div className="flex items-center border border-dotted rounded-lg text-2xl"
                style={{ height: "400px",width: "550px"}}>

                </div>
              )}
            </div>

            {routes && (
              <div className="flex flex-col items-center">
                <div className="flex gap-3">
                {["walking","biking","driving"].map(m => (
                  <button 
                    key={m} 
                    onClick={() => setMode(m)}
                    className={`cursor-pointer select-transport py-2 shadow-lg ${mode === m ? "bg-[#e76268] text-[#e7edf2]": "bg-[#e7edf2] text-[#193948]"}  text-center`}>{m}</button>
                ))}
                </div>
                <div className="flex gap-4 mt-4">
                  <p className="flex items-center justify-center gap-2 bg-white rounded-xl w-25 shadow-lg "> <IoTimeOutline/> {routes[mode].duration_min} min</p>
                  <p className="flex items-center justify-center gap-2 bg-white rounded-xl w-25 shadow-lg"> <GiPathDistance/> {routes[mode].distance_km} km</p>
                </div>
              </div>
            )}
            
            {/*Restaurant List*/}
            <h3 className="text-lg font-bold text-default-color pl-4"> 
              List of restaurants 
            </h3>
              <RestaurantList 
                restaurantList={restaurantList} 
                setRestaurantList={setRestaurantList}
                loading={loading}
                error={error}
                handleShowRoute={handleShowRoute}/>
          </div>
        )}

        {isOpen && ( 
          <ScratchModel 
            randomRestaurant={randomRestaurant} 
            revealed={revealed} 
            setRevealed={setReaveled} 
            setIsOpen={setIsOpen}
            setHiddenMap={setHiddenMap}
            routes={routes} />
        )}
      </main>
    </div>
  );
}
