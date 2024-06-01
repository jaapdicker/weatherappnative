export type Units = "metric" | "imperial"

export type GeoLocationData = {
    name?: string;
    lat?: number;
    lon?: number;
    country?: string;
    state?: string;
    local_names?: Record<string, string>;
};

export type WeatherCoords = {
    lon?: number;
    lat?: number;
}

export type WeatherWeather = {
    id?: number;
    main?: string;
    description?: string;
    icon?: string;
};

export type WeatherMain = {
    temp?: number;
    feels_like?: number;
    temp_min?: number;
    temp_max?: number;
    pressure?: number;
    humidity?: number;
}

export type WeatherWind = {
    speed?: number;
    deg?: number
}

export type WeatherClouds = {
    all?: number;
}

export type WeatherSys = {
    type?: number;
    id?: number;
    country?: string;
    sunrise?: number;
    sunset?: number
}

export type WeatherRain = {
    "1h"?: number;
    "3h"?: number;
};

export type WeatherSnow = {
    "1h"?: number;
    "3h"?: number;
}

export type WeatherData = {
    coord?: WeatherCoords,
    weather?: WeatherWeather[];
    base?: string;
    main?: WeatherMain;
    visibility?: number;
    wind?: WeatherWind;
    clouds?: WeatherClouds;
    dt?: number;
    rain?: WeatherRain;
    snow?: WeatherSnow;
    sys?: WeatherSys;
    timezone?: number;
    id?: number;
    name?: string;
    cod?: number;
}