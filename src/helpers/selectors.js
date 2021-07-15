export function getAppointmentsForDay(state, day) {
  let resultObj = [];
  for (const key in state.days) {
    if (Object.hasOwnProperty.call(state.days, key)) {
      const element = state.days[key];
      if (element.name === day) {
        const arr = [...element.appointments];

        for (const appointment in state.appointments) {
          if (Object.hasOwnProperty.call(state.appointments, appointment)) {
            const element = state.appointments[appointment];
            arr.forEach((ele) => {
              if (element.id === ele) {
                resultObj.push(element);
              }
            });
          }
        }
      }
    }
  }
  return resultObj;
}

export function getInterview(state, interview) {
  let resultObj = {};

  if (interview) {
    for (const interviewer in state.interviewers) {
      if (Object.hasOwnProperty.call(state.interviewers, interviewer)) {
        const interviewingPerson = state.interviewers[interviewer];
        if (interviewingPerson.id === interview.interviewer) {
          resultObj.student = interview.student;
          resultObj.interviewer = interviewingPerson;
        }
      }
    }
    return resultObj;
  } else {
    return null;
  }
}

export function getInterviewersForDay(state, day) {
  let resultObj = [];
  for (const key in state.days) {
    if (Object.hasOwnProperty.call(state.days, key)) {
      const element = state.days[key];
      if (element.name === day) {
        const arr = [...element.interviewers];

        for (const interview in state.interviewers) {
          if (Object.hasOwnProperty.call(state.interviewers, interview)) {
            const element = state.interviewers[interview];
            arr.forEach((ele) => {
              if (element.id === ele) {
                resultObj.push(element);
              }
            });
          }
        }
      }
    }
  }
  return resultObj;
}
