import type { App } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/app/services/JwtService";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/app/stores/auth";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

    ApiService.setHeader();

    ApiService.vueInstance.axios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          if (
              error.request &&
              error.request.status === 0 &&
              error.request.response === ""
          ) {
            if (!window.navigator.onLine) {
              alert("Check Your Internet Connection and Refresh Page");
            } else {
              alert("Check Your VPN Connection or our API service is probably down");
            }
          } else if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            authStore.purgeAuth();
          } else if (
              error.response &&
              ![404, 401].includes(error.response.status)
          ) {
            const message = error.response.data.message
                ? error.response.data.message
                : error.response.data.error;

            alert(message);
          }

          return Promise.reject(error);
        }
    );
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  /**
   * @description send the GET HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   * @param params
   */
  public static query(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   * @param slug
   */
  public static get(
    resource: string,
    slug = "" as string
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
  }

  /**
   * @description set the POST HTTP request
   * @param resource
   * @param params
   * @param config
   * @returns Promise<AxiosResponse>
   */
  public static post(
    resource: string,
    params: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, params, config);
  }

  /**
   * @description send the UPDATE HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   * @param slug
   * @param params
   */
  public static update(
    resource: string,
    slug: string,
    params: any
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource
   * @param params
   * @param config
   * @returns Promise<AxiosResponse>
   */
  public static put(
    resource: string,
    params: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, params, config);
  }

  /**
   * @description Send the Patch HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   * @param params
   */
  public static patch(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.patch(`${resource}`, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @returns Promise<AxiosResponse>
   * @param resource
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource);
  }
}

export default ApiService;
