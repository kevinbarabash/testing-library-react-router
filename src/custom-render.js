import * as React from "react";
import { MemoryRouter, useHistory, useLocation } from "react-router-dom";
import { render, queries } from "@testing-library/react";

const RouteTracker = ({ historyRef, locationRef, allLocations }) => {
  const history = useHistory();
  const location = useLocation();

  historyRef.current = history;
  locationRef.current = location;
  allLocations.push(location);

  return null;
};

export const customRender = (children) => {
  const historyRef = React.createRef();
  const locationRef = React.createRef();
  const allLocations = [];

  const options = {
    queries: {
      ...queries,
      getHistory: () => historyRef.current,
      getLocation: () => locationRef.current,
      getAllLocations: () => [...allLocations],
    },
  };

  return render(
    <MemoryRouter>
      {children}
      <RouteTracker
        historyRef={historyRef}
        locationRef={locationRef}
        allLocations={allLocations}
      />
    </MemoryRouter>,
    options
  );
};
