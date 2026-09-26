"user client";

// icon imports
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/outline";

export default function RestaurantList({restaurantList, setRestaurantList, loading, error}) {

    function handleDelete(id) {
        setRestaurantList(prev => 
        prev.filter(restaurant => restaurant.id !== id))
    }

    return(
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {restaurantList.length === 0 ? (
                <div className="text-sm font-light text-center p-5 text-gray-500"> No restaurant recommendations </div>
                ) : (
                    <div>
                        {restaurantList.map((restaurant) => {
                        return(
                        <div key={restaurant.id} className="flex justify-between text-xs rounded-lg list-items">
                            <div> {restaurant.name} </div>
                            <div className="flex justify-evenly w-50">
                            <div> {restaurant.travelTime}mins </div>
                            <div> {restaurant.location} </div>
                            <div className="flex"> {restaurant.stars}  <StarIcon className="text-yellow-500"/> </div>
                            <XMarkIcon onClick={() => handleDelete(restaurant.id)} className="w-4 h-4 text-red-400 cursor-pointer"/>
                            </div>
                        </div>)
                        })}
                    </div>
                )}  
        </div>
    )
}