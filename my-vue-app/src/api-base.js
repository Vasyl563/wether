import axios from "axios";

export const axiosBaseInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API
})

export const axiosGeolocationCity = axios.create({
    baseURL: import.meta.env.VITE_GEO_CITY_API
})