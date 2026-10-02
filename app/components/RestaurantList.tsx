"use client";

// icon imports
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/outline";

// Animation imports
import { OrbitProgress } from "react-loading-indicators";

import { Restaurant } from "@/lib/types";

type RestaurantListProps = {
  restaurantList: Restaurant[];
  onSelect: (r: Restaurant) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  error: string | null;
};

export default function RestaurantList({restaurantList, onSelect, onDelete, loading, error}: RestaurantListProps) {

    if (error) {
        return(
            <p>Error: {error}</p>
        )
    }

    return(
        <div>
            {loading ? (
                <div className="flex flex-col items-center gap-2">
                    <OrbitProgress color="#193948" size="medium" text="" textColor="" />
                    <p>Loading...</p>
                </div>
            ) : (
            <div>
 {!restaurantList || restaurantList.length === 0 ? (
                <div className="text-sm font-light text-center p-5 text-gray-500"> No restaurant recommendations </div>
                ) : (
                    <div className="max-h-110 overflow-y-auto">
                        {restaurantList.map((restaurant) => {
                        return(
                        <button key={restaurant.id}
                        onClick={() => onSelect(restaurant)}
                        className="flex items-center justify-between gap-2 text-xs rounded-lg list-items cursor-pointer">
                            {/* Name + address stacked so they don't collide */}
                            <div className="flex flex-col min-w-0">
                                <span className="font-semibold truncate">{restaurant.name}</span>
                                <span className="text-gray-300 truncate">{restaurant.address}</span>
                            </div>
                            {/* Rating + delete, kept together on the right */}
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="flex items-center gap-1">
                                    {restaurant.rating}
                                    <StarIcon aria-label="Rating" className="w-4 h-4 md:w-5 md:h-5 text-yellow-500"/>
                                </span>
                                <XMarkIcon
                                    onClick={(e) => { e.stopPropagation(); onDelete(restaurant.id); }}
                                    aria-label="Delete"
                                    className="w-4 h-4 text-red-400 cursor-pointer"/>
                            </div>
                        </button>)
                        })}
                    </div>
                )}  
            </div>)}

           
        </div>
    )
}