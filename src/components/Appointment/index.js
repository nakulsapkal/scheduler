import React from "react";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import useVisualMode from "hooks/useVisualMode";
import "components/Appointment/Styles.scss";
import Status from "./Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETE = "DELETE";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //Function handles saving  and editing of an interview appointment and the mode related to those
  function save(name, interviewer, edit = false) {
    const interview = {
      student: name,
      interviewer,
    };

    /*Handling transition in case of edit state mode as the appointment 
    already exists so nned to go in edit state instead of saving state*/
    if (edit) {
      transition(EDIT);
    } else {
      transition(SAVING);
    }

    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch((error) => {
        console.log("error", error);

        transition(ERROR_SAVE, true);
      });
  }

  /*Handling transition in case of delete state mode of the appointment */
  function destroy() {
    transition(DELETE, true);
    props
      .cancelInterview(props.id, null)
      .then(() => {
        transition(EMPTY);
      })
      .catch((error) => {
        console.log("error", error);
        transition(ERROR_DELETE, true);
      });
  }

  //This return function handles all the modes of the state and depending on that rendering the components as per the mode and props
  return (
    <>
      <article className="appointment" data-testid="appointment">
        <Header time={props.time} />
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={() => {
              transition(CONFIRM);
            }}
            onEdit={() => {
              transition(EDIT);
            }}
          />
        )}
        {mode === EDIT && (
          <Form
            name={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onSave={save}
            onCancel={back}
          />
        )}
        {mode === CONFIRM && (
          <Confirm
            message="Are you sure you would like to delete?"
            onConfirm={destroy}
            onCancel={back}
          />
        )}
        {mode === DELETE && <Status message="Deleting.." />}
        {mode === ERROR_DELETE && (
          <Error
            message="Could not cancel appointment"
            onClose={() => transition(SHOW)}
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
            onCancel={back}
          />
        )}
        {mode === SAVING && <Status message={SAVING} />}
        {mode === ERROR_SAVE && (
          <Error
            message="Could not save appointment"
            onClose={() => {
              if (props.interview) transition(SHOW);
              else transition(EMPTY);
            }}
          />
        )}
      </article>
    </>
  );
}
