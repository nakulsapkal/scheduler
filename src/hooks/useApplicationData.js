import React, { useState, useEffect } from "react";
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
    // const url = `/api/days`;
    // Axios.get(url).then((response) => {
    //   console.log("response:", response.data);
    //   setDays([...response.data]);
    //});
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
      interview: {},
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

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

  return { state, bookInterview, cancelInterview, setDay };
}
