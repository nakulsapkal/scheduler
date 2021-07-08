export function getAppointmentsForDay(state, day) {
  console.log("State,Day:", state, day);
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
  //... returns an array of appointments for that day
}
