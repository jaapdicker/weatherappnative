import { WeatherData, STATUS, Units } from "../types";


export interface WeatherState {
    language: string;
    location?: string;
    weather?: WeatherData;
    timestamp?: number;
    status?: STATUS;
    errorMessage?: string;
    selectedUnits: Units;
    setLanguage: (newLanguage: string) => void;
    setSelectedUnits: (units: Units) => void;
    setStatus: (newStatus: STATUS) => void;
    setStatusMessage: (message: string) => void;
    setLocation: (location: string) => void;
    getWeather: (location?: string, forceFetch?: boolean) => Promise<void>;
}