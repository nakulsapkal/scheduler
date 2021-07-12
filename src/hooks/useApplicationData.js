import { useState, useEffect } from "react";
import Axios from "axios";

export default function useApplicationData(params) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
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

    updateSpots(state, appointments);
    //console.log("dayObj:-->", state, days);

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

    updateSpots(state, appointments);

    // const dayObj = state.days.find((day) => day.name === state.day);
    // const remainingSpots = spots(dayObj, appointments);
    // state.days[dayObj.id - 1].spots = remainingSpots;

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

  function updateSpots(incomingState, appointments) {
    let count = 0;
    const state = { ...incomingState };
    const dayObj = state.days.find((day) => day.name === state.day);
    const dayObjIndex = state.days.findIndex((day) => day.name === state.day);
    for (const id of dayObj.appointments) {
      if (appointments[id].interview === null) {
        count++;
      }
    }

    // const day = {
    //   ...dayObj,
    //   spots: count,
    // };

    // const days = {
    //   ...state.days,
    //   [dayObjIndex]: day,
    // };

    // console.log("dayObj", dayObj, day, dayObjIndex);
    state.days[dayObjIndex].spots = count;
    //return count;
    //return days;
  }

  return { state, bookInterview, cancelInterview, setDay };
}
