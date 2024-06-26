import { useState, useRef } from 'react';
import { GestureResponderEvent, StyleSheet, TextInput, Pressable, Keyboard, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useWeatherStore } from '@/hooks/useWeatherStore';
import { STATUS } from '@/types';
import { ThemedView } from './ThemedView';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Search = () => {
    const { status, getWeather } = useWeatherStore();
    const [ value, setValue ] = useState<string>("");
    const inputRef = useRef<TextInput>(null);

    const { t } = useTranslation();

    const handleChange = (text: string) => {
        setValue(text);
    }

    const handleSearch = (e: GestureResponderEvent) => {
        Keyboard.dismiss();
        if (status !== STATUS.loading) {
            getWeather(value);
        }
    };

    return (
        <ThemedView style={styles.inputGroup}>
            <TextInput
                ref={inputRef}
                value={value}
                placeholder={t('search.placeholder')}
                onChangeText={handleChange}
                autoFocus
                placeholderTextColor={useColorScheme() === 'dark' ? 'lightgray' : 'darkgray'}
                style={styles.input}
            />
            <Pressable onPress={handleSearch} style={styles.iconButton}>
                <Icon name="search" size={20} color="gray" />
            </Pressable>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingLeft: 8,
        color: 'gray',
    },
    iconButton: {
        marginLeft: 8,
    }
})