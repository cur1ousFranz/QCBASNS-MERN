function getWeekdaysAndFormattedDatesInMonth(year, month) {
  const weekdaysAndFormattedDates = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month - 1, day); // month is 0-indexed
    const dayOfWeek = currentDate.getDay();

    let formattedWeekday = "";
    switch (dayOfWeek) {
      case 1:
        formattedWeekday = "M";
        break;
      case 2:
        formattedWeekday = "T";
        break;
      case 3:
        formattedWeekday = "W";
        break;
      case 4:
        formattedWeekday = "TH";
        break;
      case 5:
        formattedWeekday = "F";
        break;
      default:
        break;
    }

    if (formattedWeekday) {
      const formattedDate = currentDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      });
      weekdaysAndFormattedDates.push({
        weekday: formattedWeekday,
        date: formattedDate,
      });
    }
  }

  return weekdaysAndFormattedDates;
}

export default getWeekdaysAndFormattedDatesInMonth;
