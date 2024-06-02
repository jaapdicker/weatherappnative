import { WeatherData, STATUS, Units, GeoLocationData } from "../types";


export interface WeatherState {
    language: string;
    location?: string;
    geoLocation?: GeoLocationData,
    weather?: WeatherData;
    timestamp?: number;
    status?: STATUS;
    errorMessage?: string | any;
    selectedUnits: Units;
    setGeoLocation: (newGeoLocation: GeoLocationData) => void,
    setLanguage: (newLanguage: string) => void;
    setSelectedUnits: (units: Units) => void;
    setStatus: (newStatus: STATUS) => void;
    setStatusMessage: (message: string) => void;
    setLocation: (location: string) => void;
    getWeather: (location?: string, forceFetch?: boolean) => Promise<void>;
    getGeoLocation: (location: string) => Promise<void>;
}