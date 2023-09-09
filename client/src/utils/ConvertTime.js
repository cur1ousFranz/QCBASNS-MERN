const ConvertTime = (time) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const timeOfDay = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12:00 AM/PM

  const timeString = `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")} ${timeOfDay}`;

  return timeString;
};

export default ConvertTime;
