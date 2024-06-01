
import { Units } from '@/types';

const apiKeyParam = `&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`;

export const getGeoLocationData = (location: string): Promise<Response> => {
    const endpoint = `/geo/1.0/direct?q=${location}`;
    // return mock data during development
    return fetch("@/api/mockGeoLocationData.json").then((response: Response) => response);

    return fetch(`${process.env.REACT_APP_OPEN_WEATHER_BASE_URL}${endpoint}${apiKeyParam}`)
        .then((response: Response) => response);
}

export const getWeatherData = (lat: number, lon: number, units: Units, language: string): Promise<Response> => {
    const endpoint = `/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&lang=${language}`;
    // return mock data during development
    return fetch("@/api/mockWeatherData.json").then((response: Response) => response);
    
    return fetch(`${process.env.REACT_APP_OPEN_WEATHER_BASE_URL}${endpoint}${apiKeyParam}`)
        .then((response: Response) => response);
}