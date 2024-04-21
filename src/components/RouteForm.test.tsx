import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { customRender, mockContextState } from "@/test/test";

import { RouteForm } from "./RouteForm";

import type { FetchPathResponse } from "@/types";

vi.mock("@/context/MapContext", () => ({
  useMapContext: () => ({
    ...mockContextState,
  }),
}));

const renderWithMockContext = (contextOverrides = {}) => {
  return customRender(<RouteForm />, {
    providerProps: contextOverrides,
  });
};

describe("RouteForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form inputs and buttons", () => {
    renderWithMockContext();
    expect(screen.getByPlaceholderText(/Pickup/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Drop-off/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Get Route/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset/i })).toBeInTheDocument();
  });

  it("calls getRouteBetweenPoints on form submission", async () => {
    renderWithMockContext();

    fireEvent.change(screen.getByPlaceholderText(/Pickup/i), {
      target: { value: "Origin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Drop-off/i), {
      target: { value: "Destination" },
    });
    fireEvent.submit(screen.getByText("Get Route"));

    await vi.waitFor(() => {
      expect(mockContextState.getRouteBetweenPoints).toHaveBeenCalledWith(
        "Origin",
        "Destination"
      );
    });
  });

  it("calls resetMap and clearResponseMessage on reset button click", () => {
    renderWithMockContext();

    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));
    expect(mockContextState.resetMap).toHaveBeenCalled();
    expect(mockContextState.clearResponseMessage).toHaveBeenCalled();
  });

  it("displays loading spinner when isLoading is true", () => {
    renderWithMockContext((mockContextState.isLoading = true));
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows appropriate response message when a route is calculated", () => {
    const responseMessage = {
      status: "success",
      total_distance: 20000,
      total_time: 1800,
    } as FetchPathResponse;

    renderWithMockContext((mockContextState.responseMessage = responseMessage));

    expect(screen.getByText(/Total Distance:/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Time:/i)).toBeInTheDocument();
    expect(screen.getByText(/20000/i)).toBeInTheDocument();
    expect(screen.getByText(/1800/i)).toBeInTheDocument();
  });

  it("displays error message when there is a failure", () => {
    const responseMessage = {
      status: "failure",
      error: "Location not accessible by car",
    } as FetchPathResponse;

    renderWithMockContext((mockContextState.responseMessage = responseMessage));

    expect(
      screen.getByText(/Location not accessible by car/i)
    ).toBeInTheDocument();
  });
});
