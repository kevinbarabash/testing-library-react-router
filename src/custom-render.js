import * as React from "react";
import { MemoryRouter, useHistory, useLocation } from "react-router-dom";
import { render, queries } from "@testing-library/react";

const RouteTracker = ({ historyRef, locationRef }) => {
  const location = useLocation();
  const history = useHistory();

  locationRef.current = location;
  historyRef.current = history;

  return null;
};

export const customRender = (children) => {
  const historyRef = React.createRef();
  const locationRef = React.createRef();

  const options = {
    queries: {
      ...queries,
      getHistory: () => historyRef.current,
      getLocation: () => locationRef.current,
    },
  };

  return render(
    <MemoryRouter>
      {children}
      <RouteTracker historyRef={historyRef} locationRef={locationRef} />
    </MemoryRouter>,
    options
  );
};
