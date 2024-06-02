import { Image, StyleSheet, SectionList, Platform, KeyboardAvoidingView } from "react-native";
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

type SectionData = {
  title: string,
  data: {
    [x: string]: string
  }[],
}[];

export default function Index() {
  const { t } = useTranslation();
  const { weather, timestamp, location, status, selectedUnits, language, errorMessage } = useWeatherStore();
  const { description, icon } = getFirstOrDefault<WeatherWeather>(weather?.weather);

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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        {status === STATUS.loading && (
          <StatusScreen spinner />
        )}

        {status === STATUS.error && (
          <StatusScreen text={t('status.error')} />
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
              <ThemedView>
                <ScaleFade duration={500}>
                  <ThemedView style={styles.imageContainer}>
                    <Image
                      source={{ uri: iconUrl(icon) }}
                      style={styles.image}
                      alt={description}
                      resizeMode="cover"
                    />
                    {weather?.main?.temp && <ThemedText type="title">{prettifyTemp(weather.main.temp, selectedUnits)}</ThemedText>}
                    <ThemedText style={styles.description}>
                      {description}
                    </ThemedText>
                  </ThemedView>
                </ScaleFade>
              </ThemedView>
            )}

            {/* weather details */}
            {weather && (
              <ThemedView style={styles.details}>
                  <SlideFade duration={500} offsetY={-50}>
                    <SectionList
                      sections={convertWeatherData(weather)}
                      keyExtractor={(item, index) => item + item.key + index}
                      renderItem={({ item, index }) => (
                        <SlideFade delay={(0.25 * index) + 0.25}>
                          <ThemedText style={styles.detailText}>{Object.keys(item)}: {Object.values(item)}</ThemedText>
                        </SlideFade>
                      )}
                      renderSectionHeader={({ section: { title } }) => (
                        <ThemedText type="subtitle" style={styles.detailHeader}>{title}</ThemedText>
                      )}
                    />
                  </SlideFade>
              </ThemedView>
            )}
          </ThemedView>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  imageContainer: {
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200,
  },
  description: {
    textAlign: 'center',
  },
  details: {
    flex: 1,
    marginTop: 20,
  },
  detailHeader: {
    marginTop: 15,
    textAlign: 'center'
  },
  detailText: {
    marginTop: 5,
    textAlign: 'center'
  },
})
