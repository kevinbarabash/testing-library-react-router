/**
 * @jest-environment jsdom
 */
import * as React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-location-mock";

import { customRender } from "./custom-render.js";
import { Example } from "./example.js";

expect.extend({
  toEqualUrl(recieved, actual) {
    const {pathname, search, hash} = recieved;
    const url = `${pathname}${search}${hash}`;
    if (url === actual) {
      return {
        message: () =>
          `expected ${url} not to equal ${actual}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${url} to equal ${actual}`,
        pass: false,
      };
    }
  },
});

describe("Example", () => {
  test("clicking a link to /foo should redirect to /bar", async () => {
    // Arrange
    const { getHistory, getLocation } = customRender(<Example />);

    // Act
    userEvent.click(screen.queryByRole("link"));
    const history = getHistory();
    const location = getLocation();

    // Assert
    expect(history.entries[0]).toEqualUrl("/");
    expect(history.entries[1]).toEqualUrl("/bar?baz=123#qux");
    expect(location).toEqualUrl("/bar?baz=123#qux");
  });

  test("history.push('/foo') should redirect to /bar", async () => {
    // Arrange
    const { getHistory, getLocation } = customRender(<Example />);

    // Act
    userEvent.click(screen.queryByRole("button"));
    const history = getHistory();
    const location = getLocation();

    // Assert
    expect(history.entries[0]).toEqualUrl("/");
    expect(history.entries[1]).toEqualUrl("/bar?baz=123#qux");
    expect(location).toEqualUrl("/bar?baz=123#qux");
  });

  test("window.location", async () => {
    expect(window.location.pathname).toEqual("/");

    window.location.assign("/foo");

    expect(window.location.pathname).toEqual("/foo");
  });
});
