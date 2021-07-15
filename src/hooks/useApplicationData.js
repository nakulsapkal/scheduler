import { useState, useEffect } from "react";
import Axios from "axios";

//This hook is to manage data for application
export default function useApplicationData(params) {
  //State Declaration
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  //This useEffect is ran only once at the initial app start to fetch the data from API via axioms
  useEffect(() => {
    const p1 = Promise.resolve(Axios.get("/api/days"));
    const p2 = Promise.resolve(Axios.get("/api/appointments"));
    const p3 = Promise.resolve(Axios.get("/api/interviewers"));

    Promise.all([p1, p2, p3]).then((all) => {
      const [first, second, third] = all;
      console.log("First:", first.data);
      console.log("Second:", second.data);
      console.log("Third:", third.data);

      //For purpose of immutability copying the prev state first
      setState((prev) => ({
        ...prev,
        days: first.data,
        appointments: second.data,
        interviewers: Object.values(third.data),
      }));
    });
  }, []);

  //This function does all the work while new interview appointment is being booked
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    //Spots remaining (Refactoring Pending)
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

  //This function does all the work to delete/cancel interview appointment for any day
  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    //Spots remaining (Refactoring Pending)
    const dayObj = state.days.find((day) => day.name === state.day);
    const remainingSpots = spots(dayObj, appointments);
    state.days[dayObj.id - 1].spots = remainingSpots;

    return Axios.delete(`/api/appointments/${id}`, { interview }).then(() => {
      setState({
        ...state,
        appointments,
      });
    });
  }

  const setDay = (day) => setState({ ...state, day });

  //Spots count calculation for every day.(refactor pending)
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
