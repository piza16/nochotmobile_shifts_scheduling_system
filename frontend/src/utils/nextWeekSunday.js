export const getNextWeekStart = (date) => {
  const currentDate = date ? new Date(date) : new Date();

  const currentDay = currentDate.getDay();
  const daysUntilNextSunday = 7 - currentDay;
  const nextSunday = new Date(currentDate);
  nextSunday.setDate(currentDate.getDate() + daysUntilNextSunday);
  nextSunday.setHours(0, 0, 0, 0); // Set to midnight

  // Adjust for local time zone
  const offset = nextSunday.getTimezoneOffset();
  nextSunday.setMinutes(nextSunday.getMinutes() - offset);

  return nextSunday.toISOString();
};
