/**
 * @jest-environment jsdom
 */
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { StaticRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-location-mock";

import { customRender } from "./custom-render.js";
import { Example } from "./example.js";
import { getElements } from "./fiber-utils.js";

const urlFromLocation = (location) => {
  const { pathname, search, hash } = location;
  return `${pathname}${search}${hash}`;
};

expect.extend({
  toEqualUrl(recieved, actual) {
    const url = urlFromLocation(recieved);
    if (url === actual) {
      return {
        message: () => `expected ${url} not to equal ${actual}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${url} to equal ${actual}`,
        pass: false,
      };
    }
  },
});

describe("Example", () => {
  test("clicking a link to /foo should redirect to /bar", async () => {
    // Arrange
    const { getHistory, getLocation, getAllLocations } = customRender(
      <Example />
    );

    // Act
    userEvent.click(screen.queryByRole("link"));
    const history = getHistory();
    const location = getLocation();
    const allLocations = getAllLocations();

    // Assert
    expect(history.entries[0]).toEqualUrl("/");
    expect(history.entries[1]).toEqualUrl("/bar?baz=123#qux");
    expect(location).toEqualUrl("/bar?baz=123#qux");
    // getHistory doesn't track redirects, but getAllLocations does
    expect(allLocations.map(urlFromLocation)).toEqual([
      "/",
      "/foo",
      "/bar?baz=123#qux",
    ]);
  });

  test("history.push('/foo') should redirect to /bar", async () => {
    // Arrange
    const { getHistory, getLocation, getAllLocations } = customRender(
      <Example />
    );

    // Act
    userEvent.click(screen.queryByRole("button"));
    const history = getHistory();
    const location = getLocation();
    const allLocations = getAllLocations();

    // Assert
    expect(history.entries[0]).toEqualUrl("/");
    expect(history.entries[1]).toEqualUrl("/bar?baz=123#qux");
    expect(location).toEqualUrl("/bar?baz=123#qux");
    // getHistory doesn't track redirects, but getAllLocations does
    expect(allLocations.map(urlFromLocation)).toEqual([
      "/",
      "/foo",
      "/bar?baz=123#qux",
    ]);
  });

  test("window.location", async () => {
    // Arrange
    expect(window.location.pathname).toEqual("/");

    // Act
    window.location.assign("/foo");

    // Assert
    expect(window.location.pathname).toEqual("/foo");
  });

  test("access react instances from DOM nodes", async () => {
    // Arrange
    const { container } = render(
      <StaticRouter location={{ pathname: "/foo" }}>
        <Example />
      </StaticRouter>
    );

    // Act
    const [fiberKey] = Object.keys(container.firstElementChild);
    const fiber = container.firstElementChild[fiberKey];

    const elements = getElements(fiber);
    expect(elements).toEqual([
      { name: "div", props: {}, state: [] },
      { name: "Switch", props: {}, state: [] },
      {
        name: "Route",
        props: {
          computedMatch: {
            isExact: true,
            params: {},
            path: "/foo",
            url: "/foo",
          },
          location: { hash: "", pathname: "/foo", search: "" },
          path: "/foo",
        },
        state: [],
      },
      { name: "Redirect", props: { to: "/bar?baz=123#qux" }, state: [] },
      { name: "Counter", props: {}, state: [0, 1] },
      { name: "div", props: {}, state: [] },
    ]);
  });
});
