import { create } from "zustand";
import { WeatherState, STATUS, WeatherData, Units, GeoLocationData } from "@/types";
import { getGeoLocationData, getWeatherData } from "@/api";
import { getFirstOrDefault, timestampMinutesPast } from "@/utilities";
import { deviceLanguage } from '@/i18n';

export const useWeatherStore = create<WeatherState>((set, get) => ({
    language: deviceLanguage,
    location: undefined,
    weather: undefined,
    timestamp: undefined,
    status: undefined,
    errorMessage: undefined,
    selectedUnits: "metric",
    setLanguage: (newLanguage: string) => {
        set({
            language: newLanguage
        })
    },
    setSelectedUnits: (units: Units) => {
        const { location, getWeather } = get();
        set(({
            selectedUnits: units,
        }))
        getWeather(location, true);
    },
    setStatus: (newStatus: STATUS) => {
        const { status } = get();
        if (status !== newStatus) {
            set({
                status: newStatus,
            })
        }
    },
    setStatusMessage: (message: string) => {
        set({
            errorMessage: message,
        })
    },
    setLocation: (location: string) => {
        set({ location });
    },
    getWeather: async (loc?: string, forceFetch: boolean = false) => {
        const {
            location,
            setStatus,
            selectedUnits,
            timestamp,
            language,
        } = get();

        if (
            (!location ||
            location !== loc ||
            timestampMinutesPast(timestamp, 5000) ||
            forceFetch) &&
            loc
        ) {
            setStatus(STATUS.loading);

            try {
                // get geoLocationData
                const geoLocationData = getGeoLocationData(loc)
                    .then((response: Response): GeoLocationData[] => {
                        const data = response.json() as unknown as GeoLocationData[];
                        return data;
                    });

                // get weather once geoLocation is
                geoLocationData
                    .then((geoLocation: GeoLocationData[]) => {
                        const { lat, lon, name } = getFirstOrDefault(geoLocation);
                        
                        if (!lat || !lon) {
                            return false;
                        }

                        const weatherData = getWeatherData(lat, lon, selectedUnits, language)
                            .then((response: Response): WeatherData => {
                                const weather = response.json() as unknown as WeatherData;
                                return weather;
                            });
                        
                        Promise.resolve(weatherData).then((weather: WeatherData) => {
                            set(({
                                weather,
                                location: name,
                                timestamp: Date.now(),
                                status: STATUS.success,
                            }));
                        });
                    })
            } catch (error) {
                const e = error as Error;
                set(({
                    status: STATUS.error,
                    errorMessage: e.cause as string,
                }));
            }
        }
    }
}));