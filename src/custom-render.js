import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { render, queries } from "@testing-library/react";

import { getComponentNodes, getTreeStringRep } from "./fiber-utils.js";

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
        const nodes = getComponentNodes(container);
        const node = nodes.find(elem => elem.name === name);
        // TODO:
        // - throw if there's more than one result
        // - throw if there's no results
        return node;
      },
      getByComponent: (screen, component) => {
        const nodes = getComponentNodes(container);
        const node = nodes.find(elem => elem.component === component);
        // TODO:
        // - throw if there's more than one result
        // - throw if there's no results
        return node;
      },
      getAllByComponentName: (screen, name) => {
        const nodes = getComponentNodes(container);
        return nodes.filter(elem => elem.name === name);
      },
      getAllByComponent: (screen, component) => {
        const nodes = getComponentNodes(container);
        return nodes.filter(elem => elem.component === component);
      },
      debugReact: (screen) => {
        const stringRep = getTreeStringRep(container);
        return stringRep;
      }
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
