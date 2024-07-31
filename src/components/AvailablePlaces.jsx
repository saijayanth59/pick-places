import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { sortPlacesByDistance } from "../loc.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/places");
      navigator.geolocation.getCurrentPosition((pos) => {
        const sortedPlaces = sortPlacesByDistance(
          res.data.places,
          pos.coords.latitude,
          pos.coords.longitude
        );
        setData(sortedPlaces);
        setIsLoading(false);
      });

      toast.success("Available Places Successfully Loaded :)");
    } catch (error) {
      toast.error("Error fetching Available Data");
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Places
        title="Available Places"
        places={data}
        fallbackText="No places available."
        onSelectPlace={onSelectPlace}
        isLoading={isLoading}
        loadingText="Fecting data"
      />
    </>
  );
}
