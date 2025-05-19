import request from "../request";
export function createTable(data: { name: string, description: string }) {
  return request.post("/api/table/create", data);
}
export function deleteTable(name: string) {
  return request.post(`/api/table/delete`, { name });
}
export function listTable(config: { page: number; limit: number }) {
  return request.post("/api/table/list", config);
}
