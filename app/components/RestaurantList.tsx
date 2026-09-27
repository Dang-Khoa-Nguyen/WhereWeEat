"user client";

// icon imports
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/outline";

export default function RestaurantList({restaurantList, setRestaurantList, loading, error, handleShowRoute}) {

    function handleDelete(id) {
        setRestaurantList(prev => 
        prev.filter(restaurant => restaurant.id !== id))
    }

    return(
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!restaurantList || restaurantList.length === 0 ? (
                <div className="text-sm font-light text-center p-5 text-gray-500"> No restaurant recommendations </div>
                ) : (
                    <div>
                        {restaurantList.map((restaurant) => {
                        return(
                        <div key={restaurant.id} 
                        onClick={() => handleShowRoute(restaurant)}
                        className="flex justify-between text-xs rounded-lg list-items">
                            <div className="flex-1"> {restaurant.name} </div>
                            <div className="flex justify-evenly w-100">
                            <div className="flex-3"> {restaurant.address} </div>
                            <div className="flex flex-1 gap-2 justify-end w-50">
                                <div className="flex"> {restaurant.rating}  <StarIcon className="text-yellow-500"/> </div>
                                <XMarkIcon onClick={() => handleDelete(restaurant.id)} className="w-4 h-4 text-red-400 cursor-pointer"/>
                                </div>
                            </div>
                        </div>)
                        })}
                    </div>
                )}  
        </div>
    )
}