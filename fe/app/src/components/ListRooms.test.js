// ListRooms.test.js
import nock from "nock";
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import ListRooms from "./ListRooms";

// Mock data for rooms
const mockRooms = [
  { id: 1, name: "Meeting Room 1", location: "Floor 1" },
  { id: 2, name: "Conference Room", location: "Floor 2" },
];
const backend_url = "http://localhost:3000/api";
// Mock config
jest.mock("../config", () => ({
  BACKEND_URL: backend_url,
}));

// // Mock the global fetch
nock(backend_url).get("/rooms").reply(200, mockRooms, {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
});

// Mock the bubbleUp function
const bubbleUp = jest.fn();

test("ListRooms renders options and calls bubbleUp", async () => {
  render(<ListRooms bubbleUp={bubbleUp} />);

  // Wait for the fetch to resolve and options to render
  await waitFor(() => screen.getByText("1, Meeting Room 1 in Floor 1"));

  // Check if options are rendered
  expect(screen.getByText("1, Meeting Room 1 in Floor 1")).toBeInTheDocument();
  expect(screen.getByText("2, Conference Room in Floor 2")).toBeInTheDocument();

  // Simulate selecting a room
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });

  // Check if bubbleUp is called
  expect(bubbleUp).toHaveBeenCalledWith("1");
});
