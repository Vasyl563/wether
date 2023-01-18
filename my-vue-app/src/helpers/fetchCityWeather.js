import {axiosBaseInstance, axiosGeolocationCity} from "../api-base.js";

export const getCityWeather = async (cityName, day) => {
    const {name, latitude, longitude} = await findCityByName(cityName);

    const {data: {daily}} = await axiosBaseInstance.get(`/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&start_date=${day}&end_date=${day}&timezone=Europe%2FLondon`)

    return {
        city: name,
        maxTemp: `${daily.temperature_2m_max[0]}`, // index[0] - because response get temperature for 7 days and first index is current day
        minTemp: `${daily.temperature_2m_min[0]}`,
    }
}

export const findCityByName = async (cityName) => {
    const {
        data: {
            results: [{
                name,
                latitude,
                longitude
            }]
        }
    } = await axiosGeolocationCity.get(`/search?name=${cityName}`)

    return {
        name,
        latitude,
        longitude,
    }
}