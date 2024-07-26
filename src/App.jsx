import { useRef, useState, useEffect, useCallback } from "react";
import { sortPlacesByDistance } from "./loc.js";
import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";

// To load localStorage data which contains previous data
const prevStoredIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const SELECTED_PLACES = prevStoredIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id == id)
);

function App() {
  const selectedPlace = useRef(); //useRef hook instead of useEffect is used because it doesn't effect the UI
  const [availbalePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(SELECTED_PLACES);
  const [isModelOpen, setIsModelOpen] = useState(false);

  // to get current location and display them in sorted order
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        pos.coords.latitude,
        pos.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setIsModelOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsModelOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces"));
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(
        storedIds.filter((placeId) => placeId !== selectedPlace.current)
      )
    );
    setIsModelOpen(false);
  }, []);

  return (
    <>
      <Modal open={isModelOpen} onCancel={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText={"Places Loading ..."}
          places={availbalePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
