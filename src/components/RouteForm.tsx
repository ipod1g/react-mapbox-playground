import { useContext, useRef, useState } from "react";

import ArrowRight from "@/components/ArrowRight";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Input } from "@/components/Input";
import Spinner from "@/components/Spinner";
import { MapContext } from "@/context/MapContext";
import { cn } from "@/utils";

import type { FetchPathResponse } from "@/types";

export const RouteForm = () => {
  const {
    responseMessage,
    isLoading,
    clearResponseMessage,
    getRouteBetweenPoints,
    resetMap,
  } = useContext(MapContext);

  const [open, setOpen] = useState(true);
  const pickupRef = useRef<HTMLInputElement>(null);
  const dropoffRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    getRouteBetweenPoints(
      (e.target as HTMLFormElement)["pickup"].value,
      (e.target as HTMLFormElement)["dropoff"].value
    );
  }

  function handleReset() {
    if (pickupRef.current) {
      pickupRef.current.value = "";
    }
    if (dropoffRef.current) {
      dropoffRef.current.value = "";
    }
    clearResponseMessage();
    resetMap();
  }

  return (
    <form
      className={cn(
        "fixed z-10 w-1/3 h-[100svh] max-w-screen-sm min-w-96 bg-white bg-clip-padding backdrop-blur-sm bg-opacity-80 shadow-lg rounded-r-md flex transition-all duration-500 ease-in-out",
        {
          "-translate-x-full ml-8": !open,
        }
      )}
      onSubmit={handleSubmit}
    >
      <div className="px-[5%] py-14 w-full text-black relative">
        <h1 className="text-3xl mb-8">Start your search</h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="pickup">
            <p className="">Starting point</p>
            <Input
              className="my-2"
              name="pickup"
              placeholder="Pickup"
              ref={pickupRef}
              required
              type="text"
            />
          </label>
          <label htmlFor="dropoff">
            <p className="">Drop-off point</p>
            <Input
              className="my-2"
              name="dropoff"
              placeholder="Drop-off"
              ref={dropoffRef}
              required
              type="text"
            />
          </label>
        </div>
        <div>
          <div className="flex w-full gap-10 mt-10 mb-20">
            <Button disabled={isLoading} type="submit">
              Get Route
            </Button>
            <Button disabled={isLoading} onClick={handleReset} type="button">
              Reset
            </Button>
          </div>
          <ResponsePresenter data={responseMessage} />
          {isLoading && <Spinner />}
        </div>
      </div>
      <FormCollapseButton open={open} setOpen={setOpen} />
    </form>
  );
};

const ResponsePresenter = ({ data }: { data: FetchPathResponse | null }) => {
  if (!data) return null;
  switch (data.status) {
    case "success":
      return (
        <Chip className="flex flex-col gap-1" variant="success">
          <p>
            Total Distance:
            <span className="mx-2 font-semibold text-lg">
              {data.total_distance}
            </span>
            units
          </p>
          <p>
            Total Time:
            <span className="mx-2 font-semibold text-lg">
              {data.total_time}
            </span>
            units
          </p>
        </Chip>
      );
    case "500":
      return (
        <Chip variant="error">
          <p>Internal Server Error. Please try again</p>
        </Chip>
      );
    case "failure":
      return (
        <Chip variant="error">
          <p>{data.error}</p>
        </Chip>
      );
    case "in progress":
      return <Chip>Calculating route...</Chip>;
    default:
      break;
  }
};

const FormCollapseButton = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <button
      className="w-8 h-full bg-gradient-to-br from-gray-200/20 to-gray-200/80 flex justify-center items-center hover:opacity-60 transition-opacity"
      onClick={() => setOpen((prev) => !prev)}
      type="button"
    >
      <ArrowRight
        className={cn(
          "aspect-square max-w-6 text-gray-400 transition-transform duration-300 ease-in-out transform",
          open ? "rotate-180" : "rotate-0"
        )}
      />
    </button>
  );
};
