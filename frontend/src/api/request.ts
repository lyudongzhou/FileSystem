import axios from "axios";
import { useAppStore } from "@/stores/app";
import router from "@/router/index"
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const appStore = useAppStore();
  if (appStore.token) {
    config.headers.Authorization = `Bearer ${appStore.token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const appStore = useAppStore();
    if (error.response.status !== 200) {
      appStore.addQueue({
        text: error.response.data.message,
        color: 'error',
      });
      console.log(error.response)
    }
    if (error.response.status === 401) {
      appStore.logout()
      router.push("/login")
    }
  }
)
export default api;
