import axiosClient from "../utils/AxiosClient";

export const registerAdviser = async (
  firstName,
  middleName,
  lastName,
  suffix,
  birthdate,
  gender,
  email,
  contactNumber,
  password
) => {
  const response = await axiosClient.post("/adviser", {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    suffix,
    birthdate,
    gender,
    email,
    contact_number: contactNumber,
    password,
  });

  const json = response.data;
  return json;
};
