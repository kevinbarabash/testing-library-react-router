/**
 * @jest-environment jsdom
 */
import * as React from "react";
import { screen } from "@testing-library/react";
import { MemoryRouter, StaticRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-location-mock";

import { customRender } from "./custom-render.js";
import { Example } from "./example.js";
import { Counter, ClassCounter } from "./counter.js";

const urlFromLocation = (location) => {
  const { pathname, search, hash } = location;
  return `${pathname}${search}${hash}`;
};

expect.extend({
  toEqualUrl(received, actual) {
    const url = urlFromLocation(received);
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
  toHaveProps(received, actual) {
    return {
      message: () => this.utils.diff(received.props, actual),
      pass: this.equals(received.props, actual),
    };
  },
});

describe("Example", () => {
  test("clicking a link to /foo should redirect to /bar", async () => {
    // Arrange
    const { getHistory, getLocation, getAllLocations } = customRender(
      <Example />,
      { wrapper: MemoryRouter }
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
      <Example />,
      { wrapper: MemoryRouter }
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

  test("getByComponentName('Redirect')", async () => {
    // Arrange
    const { getByComponentName } = customRender(<Example />, {
      wrapper: ({ children }) => (
        <StaticRouter location={{ pathname: "/foo" }}>{children}</StaticRouter>
      ),
    });

    // Assert
    expect(getByComponentName("Redirect")).toHaveProps({
      to: "/bar?baz=123#qux",
    });
  });

  test("getByComponentName('Counter')", async () => {
    // Arrange
    const { getByComponentName } = customRender(<Example />, {
      wrapper: MemoryRouter,
    });

    // Act
    userEvent.click(screen.queryByRole("button"));

    // Assert
    expect(getByComponentName("Counter")).toBeTruthy();
  });

  test("getByComponent(Counter)", async () => {
    // Arrange
    const { getByComponent } = customRender(<Example />, {
      wrapper: MemoryRouter,
    });

    // Act
    userEvent.click(screen.queryByRole("button"));

    // Assert
    expect(getByComponent(Counter)).toBeTruthy();
  });

  test("getByComponent(ClassCounter)", async () => {
    // Arrange
    const { getAllByComponent } = customRender(<Example />, {
      wrapper: MemoryRouter,
    });

    // Act
    userEvent.click(screen.queryByRole("button"));

    // Assert
    expect(getAllByComponent(ClassCounter)).toHaveLength(1);
  });

  test("getAllByComponentName", async () => {
    // Arrange
    const { getAllByComponentName } = customRender(<Example />, {
      wrapper: ({ children }) => (
        <StaticRouter location={{ pathname: "/foo" }}>{children}</StaticRouter>
      ),
    });

    // Assert
    expect(getAllByComponentName("div")).toHaveLength(2);
  });
});
