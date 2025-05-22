import request from "../request";
export function profile() {
  return request.get("/api/users/profile");
}
export function changePassword(data: { newPassword: string }) {
  return request.post("/api/users/change-password", data);
}
