import axiosClient from "../utils/AxiosClient";

export const loginUser = async (email, password) => {
  const response = await axiosClient.post("/user", { email, password });
  const json = response.data;
  return json;
};
