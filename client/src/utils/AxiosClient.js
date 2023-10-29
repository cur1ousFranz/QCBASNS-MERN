import axios from 'axios';

const GetToken = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if(user) {
    return user.token;
  }
  
  return null
}

const axiosClient = axios.create({
  baseURL: `qcbasns-mern.vercel.app/api/v1`
})

axiosClient.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${GetToken()}`
  return config
})

export default axiosClient