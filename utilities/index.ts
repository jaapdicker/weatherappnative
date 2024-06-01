import { Units } from '@/types';

/**
 * Determine if the provided timestamp is x miliseconds in the past
 * @param timestamp - timestamp to check
 * @param timePast  - time timestamp should be in the past in milliseconds
 * @returns true/false for if the timestamp is x time in te past
 */
export function timestampMinutesPast(timestamp?: number, timePast?: number): boolean {
    if (!timestamp || !timePast) {
        return true;
    }

    return Date.now() - timestamp > timePast;
}

/**
 * Create the OpenWeatherMap url to retrieve a weather icon
 * @param code - OpenWeatherMap icon code
 * @returns url to fetch the icon
 */
export function iconUrl(code: string): string {
    return new URL(`/img/wn/${code}@4x.png`, "https://openweathermap.org").toString();
}

/**
 * Always returns an object, if data is an array, it will return the first value as an object.
 * @param data - data object that can be either an object or an array
 * @returns an empty object or the first object of the array or the object itself
 */
export function getFirstOrDefault<T>(data?: T[]): T {
    if (!data) {
        return {} as T;
    }

    if (Array.isArray(data)) {
        return data[0];
    }

    return data;
}

/**
 * Toggle between the two units available: Metric & Imperial
 * @param currentUnits - current unit being used
 * @returns - the currently not used unit
 */
export function toggleUnits(currentUnits: Units): Units {
    if (currentUnits === "metric") {
        return "imperial";
    } else {
        return "metric";
    }
}

/**
 * Toggle between the two languages available: EN & NL
 * @param language - current language being used
 * @returns - the currently not used language
 */
export function toggleLanguage(language: string): string {
    if (language === "nl") {
        return "en";
    } else {
        return "nl";
    }
}

/**
 * Prettify a temperature by rounding it and adding the correct unit to the string
 * @param temp - temperature to round
 * @param units - optional unit to use for rounding
 * @returns - prettified temperature string with rounded temperature and correct unit
 */
export function prettifyTemp(temp: number, units: Units): string {
    const unit = units === "metric" ? "C" : "F";
    return `${Math.round(temp).toString()}\xB0${unit}`;
}

/**
 * Convert a wind direction in degrees to compass directions in either single or double directions
 * @param degrees - wind direction in degrees
 * @returns - single or double compass direction
 */
export function convertWindDirection(degrees: number, language: string): string {
    const directions: Record<string, string[]> = {
        nl: ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW'],
        en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    };
    const index = Math.round(degrees / 45) % 8;
    const direction = directions[language][index];

    // check if there is a double direction
    const nextDirection = directions[language][(index + 1) % 8];
    if ((degrees % 45) >= 22.5) {
        return `${direction}-${nextDirection}`;
    }

    return direction;
}