import React, { useState, useEffect } from "react";
import Axios from "axios";
import Appointment from "components/Appointment";
import "components/Application.scss";
import DayList from "./DayList";
import { getAppointmentsForDay } from "helpers/selectors";

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       },
//     },
//   },
//   {
//     id: 3,
//     time: "2pm",
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Jones",
//       interviewer: {
//         id: 3,
//         name: "Mildred Nazir",
//         avatar: "https://i.imgur.com/T2WwVfS.png",
//       },
//     },
//   },
//   {
//     id: 5,
//     time: "4pm",
//     interview: {
//       student: "Lydia Jones",
//       interviewer: {
//         id: 4,
//         name: "Cohana Roy",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       },
//     },
//   },
// ];

export default function Application(props) {
  // const [day, setDay] = useState("Monday");

  // const [days, setDays] = useState([]);

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {},
  });
  useEffect(() => {
    const url = `/api/days`;
    Axios.get(url).then((response) => {
      console.log("response:", response.data);
      setDays([...response.data]);
    });
  }, []);

  const appointment = appointments.map((ele, index) => (
    <Appointment
      key={ele.id}
      {...ele}
      // id={ele.id}
      // time={ele.time}
      // interview={ele.interview}
    />
  ));

  const setDay = (day) => setState({ ...state, day });
  const setDays = (days) => {
    setState((prev) => ({ ...prev, days }));
  };
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointment}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
