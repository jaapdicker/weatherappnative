import { Image, StyleSheet, SectionList, ScrollView, SafeAreaView, FlatList, StatusBar } from "react-native";
import { useTranslation } from 'react-i18next';

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StatusScreen } from "@/components/StatusScreen";
import { SlideFade } from "@/components/SlideFade";
import { ScaleFade } from "@/components/ScaleFade";

import { convertWindDirection, getFirstOrDefault, iconUrl, prettifyTemp } from "@/utilities";
import { STATUS, WeatherData, WeatherWeather } from '@/types';
import { useWeatherStore } from "@/hooks/useWeatherStore";
import { Search } from "@/components/Search";

export default function Index() {
  const { t } = useTranslation();
  const { weather, timestamp, location, status, selectedUnits, language, errorMessage } = useWeatherStore();
  const { description, icon } = getFirstOrDefault<WeatherWeather>(weather?.weather);

  type SectionData = {
    title: string,
    data: {
      [x: string]: string
    }[],
  }[];

  const convertWeatherData = (w: WeatherData): SectionData => {
    const returnData: SectionData = [];

    if (!w) {
      return returnData;
    }

    if (w.main) {
      returnData.push(
        {
          title: t('weather.temperature'),
          data: [
            { [t('weather.feels_like')]: prettifyTemp(w.main!.feels_like!, selectedUnits) },
            { [t('weather.temp_min')]: prettifyTemp(w.main!.temp_min!, selectedUnits) },
            { [t('weather.temp_max')]: prettifyTemp(w.main!.temp_max!, selectedUnits) },
          ]
        }
      )
    }

    if (w.wind) {
      returnData.push({
        title: t('weather.wind'),
        data: [
          { [t('weather.speed')]: `${w.wind!.speed} ${selectedUnits === "metric" ? "meter/sec" : "miles/hour"}` },
          { [t('weather.direction')]: convertWindDirection(w.wind!.deg!, language) },
        ]
      })
    }

    if (w.rain) {
      returnData.push({
        title: t('weather.rain'),
        data: [
          { [t('weather.1h')]: `${w.rain!['1h']}mm` },
          { [t('weather.3h')]: `${w.rain!['3h']}mm` },
        ]
      })
    }

    if (w.sys) {
      returnData.push({
        title: t('weather.sun'),
        data: [
          { [t('weather.sunrise')]: new Date(w.sys!.sunrise! * 1000).toLocaleTimeString() },
          { [t('weather.sunset')]: new Date(w.sys!.sunset! * 1000).toLocaleTimeString() },
        ]
      })
    }

    return returnData;
  }
  //   {
  //     title: t('weather.temperature'),
  //     data: [
  //       {[t('weather.feels_like')]: prettifyTemp(w.main!.feels_like!, selectedUnits)},
  //       {[t('weather.temp_min')]: prettifyTemp(w.main!.temp_min!, selectedUnits)},
  //       {[t('weather.temp_max')]: prettifyTemp(w.main!.temp_max!, selectedUnits)},
  //     ]
  //   },
  //   {
  //     title: t('weather.wind'),
  //     data: [
  //       {[t('weather.speed')]: `${w.wind!.speed} ${selectedUnits === "metric" ? "meter/sec" : "miles/hour"}`},
  //       {[t('weather.direction')]: convertWindDirection(w.wind!.deg!, language)},
  //     ]
  //   },
  //   {
  //     title: t('weather.rain'),
  //     data: [
  //       {[t('weather.1h')]: `${w.rain!['1h']}mm`},
  //       {[t('weather.3h')]: `${w.rain!['3h']}mm`},
  //     ]
  //   },
  //   {
  //     title: t('weather.sun'),
  //     data: [
  //       {[t('weather.sunrise')]: new Date(w.sys!.sunrise! * 1000).toLocaleTimeString()},
  //       {[t('weather.sunset')]: new Date(w.sys!.sunset! * 1000).toLocaleTimeString()},
  //     ]
  //   }
  // ]);

  return (
    <>
      <Search />
      <ThemedView style={styles.container}>
        {status === STATUS.loading && (
          <StatusScreen spinner />
        )}

        {status === STATUS.error && (
          // <StatusScreen text={t('status.error')} />
          <StatusScreen text={errorMessage} />
        )}

        {!status && (
          <StatusScreen text={t('search.suggestion')} />
        )}

        {status === STATUS.success && (
          <ThemedView style={styles.main}>
            {/* search details */}
            {timestamp && location && (
              <ThemedView style={styles.row}>
                <ThemedText>{t('search.retrieved')}: {new Date(timestamp).toLocaleTimeString()}</ThemedText>
                <ThemedText>{location}</ThemedText>
              </ThemedView>
            )}

            {/* weather main section */}
            {icon && description && (
              <ScaleFade duration={500}>
                <ThemedView style={styles.imageContainer}>
                  <Image
                    source={{ uri: iconUrl(icon) }}
                    style={styles.image}
                    alt={description}
                    resizeMode="cover"
                  />
                  {weather?.main?.temp && <ThemedText type="title">{prettifyTemp(weather.main.temp, selectedUnits)}</ThemedText>}
                  <ThemedText style={{ textAlign: 'center' }}>
                    {description}
                  </ThemedText>
                </ThemedView>
              </ScaleFade>
            )}

            {/* weather details */}
            {weather && (
              <SlideFade duration={500} offsetY={50}>
                <SectionList
                  sections={convertWeatherData(weather)}
                  keyExtractor={(item, index) => item + item.key + index}
                  renderItem={({ item, index }) => (
                    <SlideFade delay={(0.25 * index) + 0.25}>
                      <ThemedText style={styles.detailtext}>{Object.keys(item)}: {Object.values(item)}</ThemedText>
                    </SlideFade>
                  )}
                  renderSectionHeader={({ section: { title } }) => (
                    <ThemedText type="subtitle">{title}</ThemedText>
                  )}
                />
              </SlideFade>
            )}
          </ThemedView>
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    flex: 1,
    paddingHorizontal: 10,
  },
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    color: '#1A365D',
    paddingHorizontal: 10,
  },
  detailtext: {
    marginBottom: 5,
  },
  image: {
    width: 200,
    height: 200,
  }
})
