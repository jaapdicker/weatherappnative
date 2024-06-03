import { create } from "zustand";
import { WeatherState, STATUS, WeatherData, Units, GeoLocationData } from "@/types";
import { getGeoLocationData, getWeatherData } from "@/api";
import { getFirstOrDefault, timestampMinutesPast } from "@/utilities";
import { deviceLanguage } from '@/i18n';

export const useWeatherStore = create<WeatherState>((set, get) => ({
    language: deviceLanguage || 'en',
    geoLocation: undefined,
    location: undefined,
    weather: undefined,
    timestamp: undefined,
    status: undefined,
    errorMessage: undefined,
    selectedUnits: "metric",
    setGeoLocation: (newGeoLocation: GeoLocationData) => {
        const { geoLocation } = get();
        if (geoLocation !== newGeoLocation) {
            set({
                geoLocation: newGeoLocation
            })
        }
    },
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
        const { errorMessage } = get();
        if (errorMessage !== message) {
            set({
                errorMessage: message,
            })
        }
    },
    setLocation: (location: string) => {
        set({ location });
    },
    getGeoLocation: async (location: string): Promise<void> => {
        const { setStatus, setStatusMessage } = get();

        await getGeoLocationData(location).then(response => {
            const data = response as unknown as GeoLocationData[];
            const geoData = getFirstOrDefault(data);
            set({
                location: geoData.name,
                geoLocation: geoData
            })
        }).catch((e: Error) => {
            setStatusMessage(e.message);
            setStatus(STATUS.error);
        });
    },
    getWeather: async (loc?: string, forceFetch: boolean = false): Promise<void> => {
        const {
            location,
            setStatus,
            geoLocation,
            setGeoLocation,
            selectedUnits,
            timestamp,
            language,
        } = get();

        let geoData = geoLocation;
        
        if (
            (!location ||
            timestampMinutesPast(timestamp, 5000) ||
            forceFetch) &&
            loc
        ) {
            setStatus(STATUS.loading);
            try {
                if (!geoLocation || location !== loc) {
                    await getGeoLocationData(loc).then((response: Response): void => {
                        const data = response as unknown as GeoLocationData[];
                        geoData = getFirstOrDefault(data);
                        setGeoLocation(geoData);
                    }).catch((e: Error) => {
                        set({
                            errorMessage: e.message,
                            status: STATUS.error
                        })
                    });
                }

                const { lat, lon, name } = geoData!;
                
                if (!lat || !lon) {
                    return;
                }
                
                await getWeatherData(lat, lon, selectedUnits, language)
                    .then((response: Response): void => {
                        const weather = response as unknown as WeatherData;
                        set(({
                            weather: weather,
                            location: name,
                            timestamp: Date.now(),
                            status: STATUS.success,
                        }));
                    })
                    .catch((e: Error) => {
                        set({
                            errorMessage: e.message,
                            status: STATUS.error
                        })
                    });
            } catch (e: any) {
                set({
                    errorMessage: e.errorMessage,
                    status: STATUS.error,
                })
            }
        } 
    }
}));