"use client";

import { useRandomRestaurant } from "@/hooks/useRandom";

export default function RandomButton({restaurantList, setIsOpen, setRandomRestaurant, setHiddenMap}) {
    const {randomRestaurant, loading, error, pickRandom} = useRandomRestaurant();

    async function handlePickRandom(restaurants) {
        const res = await pickRandom(restaurants);
        setRandomRestaurant(res);
        setIsOpen(true);
        setHiddenMap(false);
    }

    return(
        <div 
            className={`flex justify-center`}
            onClick={() => handlePickRandom(restaurantList)}>
            <button className="button-random cursor-pointer shadow-lg"> Random restaurant </button>
        </div>
    );
}