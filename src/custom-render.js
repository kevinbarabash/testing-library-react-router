import * as React from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { render, queries } from "@testing-library/react";

const LocationTracker = ({ history, locationRef }) => {
  const location = useLocation();

  locationRef.current = location;
  history.push(location);

  return null;
};

export const customRender = (children) => {
  const history = [];
  const locationRef = React.createRef();

  const options = {
    queries: {
      ...queries,
      getHistory: () => [...history], // return a copy of the history at that point in time
      getLocation: () => locationRef.current,
    },
  };

  return render(
    <MemoryRouter>
      {children}
      <LocationTracker history={history} locationRef={locationRef} />
    </MemoryRouter>,
    options
  );
};
