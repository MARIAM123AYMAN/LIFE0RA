import {MapPin,Navigation,ExternalLink} from "lucide-react";
import { useEffect, useState } from 'react';

export function NearbyWaterSources() {
  const [userLocation, setUserLocation] = useState({
  lat: 0,
  lon: 0,
});
const [showAll, setShowAll] = useState(false);
  const [waterSources, setWaterSources] = useState<any[]>([]);
  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setUserLocation({
    lat,
    lon,
  });

  const query = `
[out:json];
(
  node["amenity"="drinking_water"](around:3000,${lat},${lon});
  node["amenity"="cafe"](around:3000,${lat},${lon});
  node["shop"="supermarket"](around:3000,${lat},${lon});
);
out;
`;

const response = await fetch(
  "https://overpass-api.de/api/interpreter",
  {
    method: "POST",
    body: query,
  }
);

const data = await response.json();

console.log(data);
console.log(data.elements[0]);
console.log(data.elements[1]);
setWaterSources(data.elements);
}
  );
}, []);
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );
    return (R * c).toFixed(1);
  };
  const displayedSources = showAll
    ? waterSources.slice(0, 10)
    : waterSources.slice(0, 3);
  return (
<div className="bg-white rounded-xl p-6 shadow-md">
  <div className="flex items-center justify-between mb-4">
      <h2 className="text-sky-900">Nearby Water Sources</h2>
      <button
  onClick={() => setShowAll(!showAll)}
  className="px-3 py-2 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 text-sm"
>
  {showAll ? "View Less" : "View More"}
</button>
  </div>

  <div className="space-y-3">
      {displayedSources.map((source) => (
        <div key={source.id} className="flex items-center gap-4 p-4 rounded-xl bg-sky-50 hover:bg-sky-100 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <Navigation className="w-5 h-5 text-sky-600" />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="mb-2 text-sky-900 truncate">
                    {source.tags?.name || "Unknown Place"}
                </h3>

                <p className="text-sm text-sky-600">
                      {source.tags?.amenity || source.tags?.shop ||"Water Source"}
                </p>
                <a href={`https://www.google.com/maps?q=${source.lat},${source.lon}`} target="_blank" rel="noreferrer" className="inline-flex mt-2 text-sky-600 hover:text-sky-800">
                      <ExternalLink className="w-4 h-4" />
                </a>
            </div>

            <div className="flex items-center gap-1 text-sm text-sky-700">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {calculateDistance(userLocation.lat,userLocation.lon,source.lat,source.lon)}km
                  </span>
            </div>
           
        </div>
     
))}
      {/* {waterSources.length > 3 && (
        <button
        onClick={() => setShowAll(!showAll)}
        >
    {showAll ? "Show Less" : "Show More"}
  </button>
  )} */}
</div>
</div>
  );
}
