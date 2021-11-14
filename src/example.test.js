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

describe("Example", () => {
  test("clicking a link to /foo should redirect to /bar", async () => {
    // Arrange
    const { getHistory, getLocation } = customRender(<Example />);

    // Act
    userEvent.click(screen.queryByRole("link"));
    const history = getHistory();
    const location = getLocation();

    // Assert
    expect(history[1].pathname).toEqual("/foo");
    expect(history[2].pathname).toEqual("/bar");
    expect(location.pathname).toEqual("/bar");
  });

  test("history.push('/foo') should redirect to /bar", async () => {
    // Arrange
    const { getHistory, getLocation } = customRender(<Example />);

    // Act
    userEvent.click(screen.queryByRole("button"));
    const history = getHistory();
    const location = getLocation();

    // Assert
    expect(history[1].pathname).toEqual("/foo");
    expect(history[2].pathname).toEqual("/bar");
    expect(location.pathname).toEqual("/bar");
  });

  test("window.location", async () => {
    expect(window.location.pathname).toEqual("/");

    window.location.assign("/foo");

    expect(window.location.pathname).toEqual("/foo");
  });
});
