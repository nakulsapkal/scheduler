import { useState, useEffect } from "react";
import Axios from "axios";

export default function useApplicationData(params) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    const p1 = Promise.resolve(Axios.get("/api/days"));
    const p2 = Promise.resolve(Axios.get("/api/appointments"));
    const p3 = Promise.resolve(Axios.get("/api/interviewers"));

    Promise.all([p1, p2, p3]).then((all) => {
      const [first, second, third] = all;
      console.log("First:", first.data);
      console.log("Second:", second.data);
      console.log("Third:", third.data);

      setState((prev) => ({
        ...prev,
        days: first.data,
        appointments: second.data,
        interviewers: Object.values(third.data),
      }));
    });
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const dayObj = state.days.find((day) => day.name === state.day);

    const remainingSpots = spots(dayObj, appointments);

    state.days[dayObj.id - 1].spots = remainingSpots;

    return Axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      setState({
        ...state,
        appointments,
      });
    });
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const dayObj = state.days.find((day) => day.name === state.day);

    const remainingSpots = spots(dayObj, appointments);
    console.log("dayObj:-->", appointments, appointment);

    state.days[dayObj.id - 1].spots = remainingSpots;

    return Axios.delete(`/api/appointments/${id}`, { interview }).then(
      (results) => {
        setState({
          ...state,
          appointments,
        });
      }
    );
  }

  const setDay = (day) => setState({ ...state, day });

  function spots(dayObj, appointments) {
    let count = 0;
    for (const id of dayObj.appointments) {
      if (appointments[id].interview === null) {
        count++;
      }
    }
    return count;
  }

  return { state, bookInterview, cancelInterview, setDay };
}
