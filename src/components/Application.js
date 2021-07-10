import React, { useState, useEffect } from "react";
import Axios from "axios";
import Appointment from "components/Appointment";
import "components/Application.scss";
import DayList from "./DayList";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";

export default function Application(props) {
  // const [day, setDay] = useState("Monday");

  // const [days, setDays] = useState([]);

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

    console.log("Here:--->", appointments);
    return Axios.delete(`/api/appointments/${id}`, { interview })
      .then((results) => {
        setState({
          ...state,
          appointments,
        });
      })
      .catch((error) => {
        console.log(error.response.status);
        console.log(error.response.headers);
        console.log(error.response.data);
      });
  }

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  // const appointment = dailyAppointments.map((ele, index) => (
  //   <Appointment
  //     key={ele.id}
  //     {...ele}
  //     // id={ele.id}
  //     // time={ele.time}
  //     // interview={ele.interview}
  //   />
  // ));

  const setDay = (day) => setState({ ...state, day });
  // const setDays = (days) => {
  //   setState((prev) => ({ ...prev, days }));
  // };

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
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
