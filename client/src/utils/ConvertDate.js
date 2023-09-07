const ConvertDate = (date) => {
  const inputDate = new Date(date);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = inputDate.toLocaleDateString(undefined, options);
  return formattedDate;
};

export default ConvertDate;
