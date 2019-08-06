import axios from 'axios'


const request = axios.create({
  baseURL: window.globals.apiHost,
  withCredentials: true,
})

request.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.data.message) {
    return Promise.reject(error.response.data.message)
  }

  return Promise.reject(error)
})


export default request
