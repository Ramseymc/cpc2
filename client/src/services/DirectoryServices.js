import ApiServer from "@/services/ApiServer";

export default {
  development(credentials) {
    ApiServer().post("/development", credentials);
    console.log(credentials);
  }
};
