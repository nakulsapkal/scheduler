import React from "react";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import useVisualMode from "hooks/useVisualMode";
import "components/Appointment/Styles.scss";
import Status from "./Status";
export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    });
  }

  return (
    <>
      <article className="appointment">
        <Header time={props.time} />
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer.name}
          />
        )}
        {mode === EMPTY && (
          <Empty
            onAdd={() => {
              transition(CREATE);
            }}
          />
        )}
        {mode === CREATE && (
          <Form
            interviewers={props.interviewers}
            onSave={save}
            onCancel={() => {
              back();
            }}
          />
        )}
        {mode === SAVING && <Status message={SAVING} />}
      </article>
    </>
  );
}
