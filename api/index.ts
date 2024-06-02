
import { Units } from '@/types';

// mock data during development
import geoData from './mockGeoLocationData.json';
import weatherData from './mockWeatherData.json';

const apiKeyParam = `&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}`;

export const getGeoLocationData = async (location: string): Promise<Response> => {
    const endpoint = `/geo/1.0/direct?q=${location}`;
    // return mock data during development
    // return fetch("/api/mockWeatherData.json").then((response: Response) => response.json());

    return fetch(`${process.env.EXPO_PUBLIC_OPEN_WEATHER_BASE_URL}${endpoint}${apiKeyParam}`)
        .then((response: Response) => response.json());
}

export const getWeatherData = (lat: number, lon: number, units: Units, language: string): Promise<Response> => {
    const endpoint = `/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&lang=${language}`;
    // return mock data during development
    // return fetch("/api/mockWeatherData.json").then((response: Response) => response.json());
    
    return fetch(`${process.env.EXPO_PUBLIC_OPEN_WEATHER_BASE_URL}${endpoint}${apiKeyParam}`)
        .then((response: Response) => response.json());
}