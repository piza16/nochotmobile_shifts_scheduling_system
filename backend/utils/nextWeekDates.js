export const getNextWeekDates = () => {
  const currentDate = new Date();
  const israelOffset = 3 * 60 * 60 * 1000; // Israel time offset in milliseconds
  const israelTime = new Date(currentDate.getTime() + israelOffset);

  const israelDay = israelTime.getUTCDay(); // Use getUTCDay to get the correct day in UTC

  const diff = 7 - israelDay; // Days to next Sunday
  const nextSunday = new Date(israelTime);
  nextSunday.setUTCDate(israelTime.getUTCDate() + diff);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(nextSunday);
    date.setUTCDate(nextSunday.getUTCDate() + i);
    weekDates.push(date);
  }

  return weekDates;
};
