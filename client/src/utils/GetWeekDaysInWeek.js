function getWeeksInMonth(year, month) {
  const weeks = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  let currentWeek = [];
  let currentDate = firstDay;

  while (currentDate <= lastDay) {
    if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
      // Weekdays (Monday to Friday)
      currentWeek.push({
        weekday: getWeekdayLabel(currentDate.getDay()),
        date: formatDate(currentDate),
      });
    }

    if (
      currentDate.getDay() === 5 ||
      currentDate.getTime() === lastDay.getTime()
    ) {
      // If it's Friday or the last day of the month, end the current week
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weeks;
}

function getWeekdayLabel(dayIndex) {
  const weekdays = ["M", "T", "W", "TH", "F"];
  return weekdays[dayIndex - 1];
}

function formatDate(date) {
  const options = { month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export default getWeeksInMonth
