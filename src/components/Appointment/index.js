import React from "react";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import useVisualMode from "hooks/useVisualMode";
import "components/Appointment/Styles.scss";
import Status from "./Status";
import Confirm from "components/Appointment/Confirm";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETE = "DELETE";
  const EDIT = "EDIT";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer, edit = false) {
    const interview = {
      student: name,
      interviewer,
    };

    if (edit) {
      transition(EDIT);
    } else {
      transition(SAVING);
    }
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    });
  }

  function confirmDelete() {
    transition(DELETE);
    props.cancelInterview(props.id, null).then(() => {
      transition(EMPTY);
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
            onDelete={() => {
              transition(CONFIRM);
            }}
            onEdit={save}
          />
        )}
        {mode === EDIT && (
          <Form
            name={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onSave={save}
            onCancel={() => {
              back();
            }}
          />
        )}
        {mode === CONFIRM && (
          <Confirm
            message="Delete the appointment?"
            onConfirm={confirmDelete}
          />
        )}
        {mode === DELETE && <Status message="Deleting.." />}
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
