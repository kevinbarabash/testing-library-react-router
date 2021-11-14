/**
 * @jest-environment jsdom
 */
import * as React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";

import {Example} from "./example.js";

describe("Example", () => {
    it("should render", () => {
        render(<Example />);

        expect(screen.queryByText("Hello, world!")).toBeInTheDocument();
    });
});
