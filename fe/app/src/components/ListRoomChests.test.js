// ListRooms.test.js
import nock from "nock";
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import ListRoomChests from "./ListRoomChests";

// Mock data for rooms
const mockChests = [
  { id: 1, name: "Chest 1", label_width: 1.5, label_height: 1.0, room_id: 1 },
  { id: 2, name: "Chest 2", label_width: 1.5, label_height: 1.0, room_id: 1 },
];
const backend_url = "http://localhost:3000/api";

// Mock config
jest.mock("../config", () => ({
  BACKEND_URL: backend_url,
}));

// // Mock the global fetch
nock(backend_url).get("/rooms/1/chests").reply(200, mockChests, {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
});

// Mock the bubbleUp function
const bubbleUp = jest.fn();

test("ListRoomChests renders options and calls bubbleUp", async () => {
  render(<ListRoomChests roomId={1} bubbleUp={bubbleUp} />);

  // Wait for the fetch to resolve and options to render
  await waitFor(() => screen.getByText("1, Chest 1"));

  // Check if options are rendered
  expect(screen.getByText("1, Chest 1")).toBeInTheDocument();
  expect(screen.getByText("2, Chest 2")).toBeInTheDocument();

  // Simulate selecting a chest
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });

  // Check if bubbleUp is called
  expect(bubbleUp).toHaveBeenCalledWith("1");
});

// test('Displays "Select Chest" initially, even without roomId', () => {
//   render(<ListRoomChests bubbleUp={jest.fn()} />);
//   expect(getByText("Select Chest")).toBeInTheDocument();
// });

// test("Handles fetch errors gracefully", async () => {
//   const consoleErrorMock = jest
//     .spyOn(console, "error")
//     .mockImplementation(() => {}); // Suppress console errors during test

//   global.fetch.mockRejectedValueOnce(new Error("Network error"));
//   render(<ListRoomChests roomId={1} bubbleUp={jest.fn()} />);
//   await waitFor(() => expect(consoleErrorMock).toHaveBeenCalled());
//   consoleErrorMock.mockRestore(); // Restore console.error
// });
