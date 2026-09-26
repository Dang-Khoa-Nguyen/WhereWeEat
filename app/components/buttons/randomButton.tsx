"use client";

import { useRandomRestaurant } from "@/hooks/useRandom";

export default function RandomButton({restaurantList}) {
    const {randomRestaurant, loading, error, pickRandom} = useRandomRestaurant();

    function handlePickRandom(restaurants) {
        pickRandom(restaurants);
    }

    console.log(randomRestaurant);
    return(
        <div 
            className={`flex justify-center`}
            onClick={() => handlePickRandom(restaurantList)}>
            <button className="button-random cursor-pointer"> Random restaurant </button>
        </div>
    );
}