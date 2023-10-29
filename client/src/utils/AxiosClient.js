import axios from 'axios';

const GetToken = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if(user) {
    return user.token;
  }
  
  return null
}

const axiosClient = axios.create({
  baseURL: `https://qcbasns-mern.vercel.app/`
})

axiosClient.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${GetToken()}`
  return config
})

export default axiosClient