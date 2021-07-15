//Helper Function For Getting Appointments Of The Day
export function getAppointmentsForDay(state, current_day) {
  let resultAppointmentObj = [];
  //Looping through state.days to find the current day's appointments
  for (const key in state.days) {
    if (Object.hasOwnProperty.call(state.days, key)) {
      const day = state.days[key];
      if (day.name === current_day) {
        const currentDayAppointments = [...day.appointments];

        //Looping through state.appointments to fetch all details for multiple appointments for the current day
        for (const key in state.appointments) {
          if (Object.hasOwnProperty.call(state.appointments, key)) {
            const appointment = state.appointments[key];
            currentDayAppointments.forEach((currentDayAppointmentId) => {
              if (appointment.id === currentDayAppointmentId) {
                resultAppointmentObj.push(appointment);
              }
            });
          }
        }
      }
    }
  }
  return resultAppointmentObj;
}

//Fetching An Interview For Every Appointment If Any Exists
export function getInterview(state, interview) {
  let resultInterviewObj = {};

  if (interview) {
    for (const interviewer in state.interviewers) {
      if (Object.hasOwnProperty.call(state.interviewers, interviewer)) {
        const interviewingPerson = state.interviewers[interviewer];
        if (interviewingPerson.id === interview.interviewer) {
          resultInterviewObj.student = interview.student;
          resultInterviewObj.interviewer = interviewingPerson;
        }
      }
    }
    return resultInterviewObj;
  } else {
    return null;
  }
}

//Fetching An Interviews For Every Day In Schedule
export function getInterviewersForDay(state, current_day) {
  let resultInterviewersObj = [];
  //Looping through state.days to find the current day's interviewers
  for (const key in state.days) {
    if (Object.hasOwnProperty.call(state.days, key)) {
      const day = state.days[key];
      if (day.name === current_day) {
        const currentDayInterviewers = [...day.interviewers];

        //Looping through state.appointments to fetch all details for multiple appointments for the current day
        for (const key in state.interviewers) {
          if (Object.hasOwnProperty.call(state.interviewers, key)) {
            const interview = state.interviewers[key];
            currentDayInterviewers.forEach((currentDayInterviewerId) => {
              if (interview.id === currentDayInterviewerId) {
                resultInterviewersObj.push(interview);
              }
            });
          }
        }
      }
    }
  }
  return resultInterviewersObj;
}
