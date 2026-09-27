"use client";

import { useRandomRestaurant } from "@/hooks/useRandom";

export default function RandomButton({userInput, restaurantList, setIsOpen, setRandomRestaurant, setHiddenMap, onChosen}) {

    const {randomRestaurant, loading, error, pickRandom} = useRandomRestaurant();

    async function handlePickRandom(restaurants) {
        const restaurant = await pickRandom(restaurants, userInput);
        if (!restaurant) return;   

        setRandomRestaurant(restaurant);
        await onChosen(restaurant);             
        setIsOpen(true);                        
        setHiddenMap(false);
    }

    return(
        <div 
            className={`flex justify-center`}
            onClick={() => handlePickRandom(restaurantList)}>
            <button className={`button-random shadow-lg ${loading ? "cursor-wait opacity-50" : "cursor-pointer opacity-100"}`}> Random restaurant </button>
        </div>
    );
}