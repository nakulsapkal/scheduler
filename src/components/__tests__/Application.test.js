import React from "react";

import axios from "axios";

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
  getByTestId,
  queryByAltText,
  queryByPlaceholderText,
  queryByDisplayValue,
  queryByTestId,
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

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(queryByText(day, /no spots reamaining/i)).toBeInTheDocument;
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting..")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // We want to start by finding an existing interview.
    // With the existing interview we want to find the edit button.
    // We change the name and save the interview.
    // We don't want the spots to change for "Monday", since this is an edit.
    // Read the errors because sometimes they say that await cannot be outside of an async function.

    // 1.Render a application.
    const { container, debug } = render(<Application />);

    // 2.wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3.click the Edit button on booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4.Check if the form has earlier student name
    expect(getByTestId(appointment, "student-name-input"));

    // 5.Change the interviewr or name or both for apointment.

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    // 6.Click the save button.
    act(() => {
      fireEvent.click(getByText(appointment, "Save"));
    });

    // 7. Check the element with the text "Saving" is displayed.
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    // 8. Wait until the element with new name is displyed on the appointment.
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    // 9. Check that the dayListItem with thetext "Monday" also has the test "1 spot remaining"
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  /* test number five */
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

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

    await waitForElement(() => getByText(appointment, "Error"));
    expect(
      queryByText(appointment, "Could not save appointment")
    ).toBeInTheDocument();

    fireEvent.click(queryByAltText(appointment, "Close"));

    await waitForElement(() => getByAltText(appointment, "Add"));

    // const day = getAllByTestId(container, "day").find((day) =>
    //   queryByText(day, "Monday")
    // );

    // expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting..")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error"));

    expect(
      queryByText(appointment, "Could not cancel appointment")
    ).toBeInTheDocument();

    fireEvent.click(queryByAltText(appointment, "Close"));

    await waitForElement(() => getByText(container, "Archie Cohen"));

    // const day = getAllByTestId(container, "day").find((day) =>
    //   queryByText(day, "Tuesday")
    // );

    // expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
});
