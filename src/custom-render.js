import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { render, queries } from "@testing-library/react";

import { getElements } from "./fiber-utils.js";

const RouteTracker = ({ historyRef, locationRef, allLocations, children }) => {
  const history = useHistory();
  const location = useLocation();

  historyRef.current = history;
  locationRef.current = location;
  allLocations.push(location);

  return children;
};

export const customRender = (children, options) => {
  const historyRef = React.createRef();
  const locationRef = React.createRef();
  const allLocations = [];

  const mergedOptions = {
    ...options,
    queries: {
      ...queries,
      getHistory: () => historyRef.current,
      getLocation: () => locationRef.current,
      getAllLocations: () => [...allLocations],
      getByComponentName: (screen, name) => {
        const elements = getElements(container);
        const element = elements.find(elem => elem.name === name);
        // TODO:
        // - throw if there's more than one result
        // - throw if there's no results
        return element;
      },
      getByComponent: (screen, component) => {
        const elements = getElements(container);
        const element = elements.find(elem => elem.component === component);
        // TODO:
        // - throw if there's more than one result
        // - throw if there's no results
        return element;
      },
      getAllByComponentName: (screen, name) => {
        const elements = getElements(container);
        return elements.filter(elem => elem.name === name);
      },
      getAllByComponent: (screen, component) => {
        const elements = getElements(container);
        return elements.filter(elem => elem.component === component);
      },
    },
  };

  const result = render(
    <RouteTracker
      historyRef={historyRef}
      locationRef={locationRef}
      allLocations={allLocations}
    >
      {children}
    </RouteTracker>,
    mergedOptions
  );

  const { container } = result;

  return result;
};
