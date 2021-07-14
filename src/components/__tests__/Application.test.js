import React from "react";

import {
  act,
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const Tuesday = jest.fn();
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));

      expect(getByText("Leopold Silvers")).toBeInTheDocument();
      expect(Tuesday).not.toHaveBeenCalled();
    });
  });

  //async awit example
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    act(() => {
      fireEvent.click(getByAltText(appointment, "Add"));
    });

    act(() => {
      fireEvent.change(
        getByPlaceholderText(appointment, /Enter Student Name/i),
        {
          target: { value: "Lydia Miller-Jones" },
        }
      );
    });

    act(() => {
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    });

    act(() => {
      fireEvent.click(getByText(appointment, "Save"));
    });

    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    await waitForElement(() => getByText, "Lydia Miller-Jones");

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(queryByText(day, /no spots reamaining/i)).toBeInTheDocument;
  });
});
