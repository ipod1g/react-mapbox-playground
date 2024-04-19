import { useContext } from "react";

import Spinner from "@/components/Spinner";
import { MapContext } from "@/context/MapContext";

export const RouteForm = () => {
  const { getRouteBetweenPoints } = useContext(MapContext);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form submitted");

    // getRouteBetweenPoints(
    //   (e.target as HTMLFormElement)["pickup"].value,
    //   (e.target as HTMLFormElement)["dropoff"].value
    // );

    getRouteBetweenPoints([114.107877, 22.372081], [114.167811, 22.326442]);
  }

  return (
    <form
      className="fixed z-10 w-1/3 bg-white h-full shadow-lg rounded-md"
      onSubmit={handleSubmit}
    >
      <h1>Route Form</h1>
      <input
        className="bg-red-200"
        name="pickup"
        placeholder="Pickup"
        type="text"
      />
      <input
        className="bg-red-200"
        name="dropoff"
        placeholder="Drop-off"
        type="text"
      />
      <button className="bg-blue-500" type="submit">
        Get Route
      </button>
      <Spinner />
    </form>
  );
};
