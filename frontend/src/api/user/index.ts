import request from "../request";
export function profile() {
  return request.get("/api/users/profile");
}
