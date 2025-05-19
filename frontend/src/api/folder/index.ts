import request from "@/api/request"
export async function uploadFolder(data: FormData) {
  return request.post("api/upload/folder", data)
}
export async function clearFolder(tableName: string) {
  return request.post("api/upload/clear", { tableName })
}
