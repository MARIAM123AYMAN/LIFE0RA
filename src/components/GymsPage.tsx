import { ArrowLeft, MapPin, Star, Clock, Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function GymsPage() {
  const navigate = useNavigate();
  const [gyms, setGyms] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState({
  lat: 0,
  lon: 0,
});
useEffect(() => {
  loadGyms();
}, []);

const loadGyms = () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
setUserLocation({
  lat: latitude,
  lon: longitude,
});
    const query = `
    [out:json];
    (
      node["leisure"="fitness_centre"](around:30000,${latitude},${longitude});
      way["leisure"="fitness_centre"](around:30000,${latitude},${longitude});
      relation["leisure"="fitness_centre"](around:30000,${latitude},${longitude});

      node["amenity"="gym"](around:10000,${latitude},${longitude});
      way["amenity"="gym"](around:10000,${latitude},${longitude});
      relation["amenity"="gym"](around:10000,${latitude},${longitude});
    );
    out center tags;
    `;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: query,
      }
    );

    const data = await response.json();

    console.log(data.elements);

    setGyms(data.elements);
  });
};
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

  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};
  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/sports')}
          className="flex items-center gap-2 text-sky-600 hover:text-sky-900 mb-4 transition-colors"
          title="Back to Sports Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-sky-900 mb-2">Nearby Gyms</h1>
        <p className="text-sky-600">Find gyms and fitness centers near you</p>
      </div>

      {/* Gyms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gyms.map((gym, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            {/* Gym Header */}
            <div className="mb-4">
              <h2 className="text-sky-900 mb-2">{gym.tags?.name || "Fitness Center"}</h2>
              {/* <p className="text-sm text-sky-600">{gym.tags?.["addr:street"] || "No address available"}</p> */}
            </div>

            {/* Gym Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3  w-50 h-20 bg-sky-50 rounded-2xl" title="Distance from your location">
                <div className="flex items-center gap-2 text-sky-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <p className="text-xs">Distance</p>
                </div>
              <p className="text-sky-900 p-3 w-100  h-25">
  {calculateDistance(
    userLocation.lat,
    userLocation.lon,
    gym.lat ?? gym.center?.lat,
    gym.lon ?? gym.center?.lon
  )}{" "}
  km
</p>
              </div>
{/* 
<div className="p-3 bg-sky-50 rounded-2xl">
  <div className="flex items-center gap-2 text-sky-600 mb-1">
    <Star className="w-4 h-4 text-amber-400" />
    <p className="text-xs">Rating</p>
  </div>
  <p className="text-sky-900">Not Available</p>
</div> */}

       {/* <div className="mb-4 p-3 bg-sky-50 rounded-2xl">
  <div className=" h-4 w-50 flex items-center gap-2 mb-1">
    <Clock className="w-4 h-4 text-sky-600" />
    <p className="text-xs text-sky-600">Hours</p>
  </div>

  <p className="text-sky-900">
    {gym.tags?.opening_hours || "Opening hours unavailable"}
  </p>
</div> */}


            {/* Action Button */}
            <button
  onClick={() =>
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${gym.lat},${gym.lon}`,
      "_blank"
    )
  }
  className="w-100  h-20 rounded-2xl bg-sky-900 text-white hover:bg-sky-800 transition-all flex items-center justify-center gap-2"
>
  <Navigation className="w-4 h-4" />
  <span>Get Directions</span>
</button>
          </div>
        </div>
        ))}
      </div>
      </div>
  );
}
