//Helper Function For Getting Appointments Of The Day
export function getAppointmentsForDay(state, current_day) {
  //Looping through state.days to find the current day's Obj
  const currentDayObj = state.days.find(
    (dayObj) => dayObj.name === current_day
  );

  if (state.days.length === 0 || currentDayObj === undefined) return [];

  //mapping through currentDayObj.appointments to fetch all details for multiple appointments for the current day
  return currentDayObj.appointments.map((id) => state.appointments[id]);
}

//Fetching An Interview For Every Appointment If Any Exists
export function getInterview(state, interviewDetails) {
  if (interviewDetails) {
    return {
      ...interviewDetails,
      interviewer: state.interviewers.find(
        (interviewer) => interviewDetails.interviewer === interviewer.id
      ),
    };
  } else {
    return null;
  }
}

//Fetching An Interviews For Every Day In Schedule
export function getInterviewersForDay(state, current_day) {
  //Looping through state.days to find the current day's interviewers
  const currentDayObj = state.days.find(
    (dayObj) => current_day === dayObj.name
  );

  if (state.days.length === 0 || currentDayObj === undefined) return [];
  // mapping through currentDayObj.interviewers to fetch all details for multiple interviewers for the current day
  return currentDayObj.interviewers.map((id) => state.interviewers[id - 1]);
}
