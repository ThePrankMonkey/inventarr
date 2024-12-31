import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Create from "./Create";

test("renders the select element with default options", () => {
  render(<Create />);

  const selectElement = screen.getByRole("combobox");
  expect(selectElement).toBeInTheDocument();

  // Check for default options
  const options = screen.getAllByRole("option");
  expect(options.length).toBe(5); // 1 empty option + 4 models
  expect(options[0].textContent).toBe("Select a Model");
});

test("updates selected model on select change", () => {
  render(<Create />);

  const selectElement = screen.getByRole("combobox");

  // Simulate selecting "Item"
  fireEvent.change(selectElement, { target: { value: "Item" } });

  expect(screen.getByText("Item")).toBeInTheDocument(); // Check for CreateItem rendering
});
