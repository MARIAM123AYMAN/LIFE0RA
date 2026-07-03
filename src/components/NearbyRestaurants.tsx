import { MapPin, Star, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';


const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return (R * c).toFixed(1);
};


export function NearbyRestaurants() {
  const scrollRef = useRef<HTMLDivElement>(null);
const [userLocation, setUserLocation] = useState<{lat: number;lon: number;} | null>(null);
const [showAll, setShowAll] = useState(false);
const [restaurants, setRestaurants] = useState<any[]>([]);
const getNearbyRestaurants = () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      //  مكان الحالي
      const lat = position.coords.latitude;
      // مكان  api
      const lon = position.coords.longitude;
setUserLocation({
  lat,
  lon,
});
      const query = `
      [out:json];
      (
        node["amenity"="restaurant"](around:30000,${lat},${lon});
        node["amenity"="fast_food"](around:30000,${lat},${lon});
        node["amenity"="cafe"](around:30000,${lat},${lon});
      );
      out;
      `;
try {
  const response = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      body: query,
    }
  );

  const text = await response.text();

  if (!text.startsWith("{")) {
    console.log("Overpass returned XML");
    return;
  }

  const data = JSON.parse(text);

  const filteredRestaurants =
    data.elements.filter(
      (item: any) => item.tags?.name
    );

  const sortedRestaurants =
    filteredRestaurants.sort(
      (a: any, b: any) => {
        const distanceA = Number(
          calculateDistance(
            lat,
            lon,
            a.lat,
            a.lon
          )
        );

        const distanceB = Number(
          calculateDistance(
            lat,
            lon,
            b.lat,
            b.lon
          )
        );

        return distanceA - distanceB;
      }
    );

  setRestaurants(
    sortedRestaurants.slice(0, 30)
  );

} catch (error) {
  console.error(error);
}},
(error) => {
  console.error(error);
}
);}

useEffect(() => {
  getNearbyRestaurants();
}, []);
console.log(restaurants);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sky-900 mb-1">Nearby Restaurants</h2>
          <p className="text-sm text-sky-600">Healthy options near you</p>
        </div>
        <button
  onClick={() => setShowAll(!showAll)}
  className="text-sky-600 hover:text-sky-700 transition-colors"
>
  {showAll ? "Show Less" : "View All"}
</button>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(showAll ? restaurants : restaurants.slice(0, 5)).map((restaurant) => (
          
          <RestaurantCard key={restaurant.id} restaurant={restaurant}    userLocation={userLocation}/>
        ))}
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto -mx-4 px-4" ref={scrollRef}>
        <div className="flex gap-4 pb-4">
          {(showAll ? restaurants : restaurants.slice(0, 5)).map((restaurant) => (
            <div key={restaurant.id} className="flex-shrink-0 w-80">
              <RestaurantCard
  restaurant={restaurant}
  userLocation={userLocation}
/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function RestaurantCard({
  restaurant,
  userLocation,
}: {
  restaurant: any;
  userLocation: any;
}) {

  const distance =
    userLocation
      ? calculateDistance(
          userLocation.lat,
          userLocation.lon,
          restaurant.lat,
          restaurant.lon
        )
      : null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Restaurant Image */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-mint-100 flex-shrink-0 overflow-hidden">
            <div className="w-full h-full bg-sky-100 flex items-center justify-center text-3xl">
  🍽️
</div>
          </div>

          {/* Restaurant Info */}
         <div className="flex-1 min-w-0">
  <h3 className="text-sky-900 mb-1">
    {restaurant.tags?.["name:en"] ||
 restaurant.tags?.name}
  </h3>

  <p className="text-sm text-sky-600">
    {restaurant.tags?.amenity}
  </p>

  <p className="text-sm text-sky-600">
    {distance} km
  </p>
</div>
        </div>

        {/* Delivery Time */}
        <div className="mt-4 pt-4 border-t border-sky-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-sky-600">
              <Clock className="w-4 h-4" />
               <span>{distance} km away</span>
              </div>
           <button
  onClick={() =>
    window.open(
      `https://www.google.com/maps?q=${restaurant.lat},${restaurant.lon}`,
      "_blank"
    )
  }
  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-mint-500 text-white"
>
  Open Maps
</button>
          </div>
        </div>
      </div>
    </div>
  );
}
