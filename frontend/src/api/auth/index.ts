import axios from "../request";
export async function login(username: string, password: string) {
  return axios.post("/api/auth/login", { username, password });
}

export async function register(username: string, password: string) {
  return axios.post('/api/auth/register', { username, password })
}
