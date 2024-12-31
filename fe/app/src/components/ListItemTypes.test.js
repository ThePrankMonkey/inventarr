// ListRooms.test.js
import nock from "nock";
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import ListItemTypes from "./ListItemTypes";

// Mock data for rooms
const mockItemTypes = ["dog food", "farm equipment"];
const backend_url = "http://localhost:3000/api";

// Mock config
jest.mock("../config", () => ({
  BACKEND_URL: backend_url,
}));

// // Mock the global fetch
nock(backend_url).get("/items/types").reply(200, mockItemTypes, {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
});

// Mock the bubbleUp function
const bubbleUp = jest.fn();

test("ListItemTypes renders options", async () => {
  render(<ListItemTypes bubbleUp={bubbleUp} />);

  // Wait for the fetch to resolve and options to render
  await waitFor(() => screen.getByText("dog food"));

  // Check if options are rendered
  expect(screen.getByText("dog food")).toBeInTheDocument();
  expect(screen.getByText("farm equipment")).toBeInTheDocument();

  // Simulate selecting an item type
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "dog food" },
  });

  // Check if bubbleUp is called
  expect(bubbleUp).toHaveBeenCalledWith("dog food");
});
