import Service from "./index";

export default {
  getlogin(data) {
    return Service.post("user/login", data);
  },
};
