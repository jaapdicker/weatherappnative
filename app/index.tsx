import { Image, StyleSheet, SectionList } from "react-native";
import { useTranslation } from 'react-i18next';

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StatusScreen } from "@/components/StatusScreen";
import { SlideFade } from "@/components/SlideFade";
import { ScaleFade } from "@/components/ScaleFade";

import { convertWindDirection, getFirstOrDefault, iconUrl, prettifyTemp } from "@/utilities";
import { STATUS, WeatherWeather } from '@/types';
import { useWeatherStore } from "@/hooks/useWeatherStore";
import { Search } from "@/components/Search";

export default function Index() {
  const { t } = useTranslation();
  const { weather, timestamp, location, status, selectedUnits, language } = useWeatherStore();
  const { description, icon } = getFirstOrDefault<WeatherWeather>(weather?.weather);

  // const weatherData = [
  //   {
  //     title: t('weather.temperature'),
  //     data: [
  //       {[t('weather.feels_like')]: prettifyTemp(weather!.main!.feels_like!, selectedUnits)},
  //       {[t('weather.temp_min')]: prettifyTemp(weather!.main!.temp_min!, selectedUnits)},
  //       {[t('weather.temp_max')]: prettifyTemp(weather!.main!.temp_max!, selectedUnits)},
  //     ]
  //   },
  //   {
  //     title: t('weather.wind'),
  //     data: [
  //       {[t('weather.speed')]: `${weather!.wind!.speed} ${selectedUnits === "metric" ? "meter/sec" : "miles/hour"}`},
  //       {[t('weather.direction')]: convertWindDirection(weather!.wind!.deg!, language)},
  //     ]
  //   },
  //   {
  //     title: t('weather.rain'),
  //     data: [
  //       {[t('weather.1h')]: `${weather!.rain!['1h']}mm`},
  //       {[t('weather.3h')]: `${weather!.rain!['3h']}mm`},
  //     ]
  //   },
  //   {
  //     title: t('weather.sun'),
  //     data: [
  //       {[t('weather.sunrise')]: new Date(weather!.sys!.sunrise! * 1000).toLocaleTimeString()},
  //       {[t('weather.sunset')]: new Date(weather!.sys!.sunset! * 1000).toLocaleTimeString()},
  //     ]
  //   }
  // ];

  return (
    <>
      <ThemedView>
        <Search />
      </ThemedView>
      <ThemedView style={styles.container}>
        {status === STATUS.loading && (
            <StatusScreen spinner />
        )}

        {status === STATUS.error && (
            <StatusScreen text={t('status.error')} />
        )}

        {!status && (
            <StatusScreen text={t('status.suggestion')} />
        )}

        {status === STATUS.success && (
            <>
                {/* search details */}
                {timestamp && location && (
                    <ThemedView style={styles.row}>
                        <ThemedText>{t('search.retrieved')}: {new Date(timestamp).toLocaleTimeString()}</ThemedText>
                        <ThemedText>{location}</ThemedText>
                    </ThemedView>
                )}

                {/* weather main section */}
                { icon && description && (
                    <ScaleFade duration={500}>
                        <ThemedView style={styles.imageContainer}>
                            <Image
                                source={{ uri: iconUrl(icon) }}
                                style={styles.image}
                                alt={description}
                            />
                            {weather?.main?.temp && <ThemedText type="title">{prettifyTemp(weather.main.temp, selectedUnits)}</ThemedText> }
                            <ThemedText style={{textAlign: 'center'}}>
                                {description}
                            </ThemedText>
                        </ThemedView>
                    </ScaleFade>
                )}

                {/* weather details */}
                {/* { weather && (
                    <SlideFade duration={500} offsetY={50}>
                        <SectionList
                          sections={weatherData}
                          keyExtractor={(item, index) => item + item.key}
                          renderItem={({item, index}) => (
                            <SlideFade delay={(0.25 * index) + 0.25}>
                                <ThemedText style={styles.detailtext}>{item.key}: {Object.values(item)}</ThemedText>
                            </SlideFade>
                          )}
                          renderSectionHeader={({section: {title}}) => (
                            <ThemedText type="subtitle">{title}</ThemedText>
                          )}
                        />
                    </SlideFade>
                )} */}
            </>
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    paddingTop: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  column: {
    flexDirection: 'column',
    color: '#1A365D', // blue.900
    paddingHorizontal: 10,
  },
  detailtext: {
    marginBottom: 5,
  },
  image: {
    width: 'auto',
    height: 'auto',
    resizeMode: 'cover',
  }
})
