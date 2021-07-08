import React, { Fragment } from "react";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";

import "components/Appointment/Styles.scss";
export default function Appointment(props) {
  // console.log("Here: ", props.interview.student);

  // for (const obj in props.interview) {
  //   if (Object.hasOwnProperty.call(props.interview, key)) {
  //     const element = props.interview[obj];
  //   }
  // }

  return (
    <>
      <article className="appointment">
        <Header time={props.time} />
        {props.interview ? (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer.name}
          />
        ) : (
          <Empty />
        )}
      </article>
    </>
  );
}
