import axios from "axios";

export default () => {
  //   let token = window.localStorage.getItem("token");
  //  console.log(process.env.VUE_APP_BASEURL)
  // let tokenA = window.document.cookie
  // let token = "Test"

  //   axios.defaults.headers.common["Access-Control-Request-Origin"] =
  //     "http://localhost:8080/";
  //   axios.defaults.headers.common["Access-Control-Allow-Credentials"] = true;
  // axios.defaults.xsrfCookieName = "token"
  // axios.defaults.xsrfHeaderName = "X-TOKEN"

  // console.log(window.document.cookie)
  // axios.interceptors.response.use((response) => {
  //   window.document.cookie
  //   console.log("RESPONSE", response)
  //   return response
  // })
  // axios.defaults.withCredentials = "true";
  //   axios.defaults.withCredentials = true;
  // axios.defaults.withCredentials = false;

  // axios.defaults.headers.common["Authorization"] = `Bearer:${token}`;
  // axios.defaults.headers.common["Content-Type"] = "application/json";
  //   axios.defaults.headers.Content-Type
  return axios.create({
    baseURL: process.env.VUE_APP_BASEURL
  });
};
