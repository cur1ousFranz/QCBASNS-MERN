const formattedDate = (date) => {
  const newDate = new Date(date);
  const formattedDate = newDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
  return formattedDate;
};

export default formattedDate;
