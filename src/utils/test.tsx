import { render } from "@testing-library/react";
import { createContext } from "react";

import type { MapContextProps } from "@/context/MapContext";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const mockContextState: MapContextProps = {
  map: undefined,
  markers: [],
  isMapReady: false,
  isLoading: false,
  responseMessage: null,
  setMap: vi.fn(),
  resetMap: vi.fn(),
  clearResponseMessage: vi.fn(),
  getRouteBetweenPoints: vi.fn(),
};

export const MockMapContext = createContext<MapContextProps>(mockContextState);
export const MockMapProvider: React.FC<{
  children: ReactNode;
  initialState?: Partial<MapContextProps>;
  // eslint-disable-next-line react/prop-types
}> = ({ children, initialState = {} }) => {
  const providerValue = { ...mockContextState, ...initialState };
  return (
    <MockMapContext.Provider value={providerValue}>
      {children}
    </MockMapContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const customRender = (
  ui: ReactElement,
  {
    providerProps,
    ...renderOptions
  }: { providerProps?: Partial<MapContextProps> } & Omit<
    RenderOptions,
    "wrapper"
  >
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <MockMapProvider initialState={providerProps}>{children}</MockMapProvider>
    ),
    ...renderOptions,
  });
};
