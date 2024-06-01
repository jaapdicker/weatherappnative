import { useState, useRef } from 'react';
import { GestureResponderEvent, StyleSheet, TouchableOpacity, TextInput, TextInputProps, TextInputComponent } from 'react-native';
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
        e.preventDefault();
        if (status !== STATUS.loading) {
            getWeather(value);
        }
        inputRef.current?.focus();
    };

    return (
        <ThemedView style={styles.inputGroup}>
            <TextInput
                ref={inputRef}
                value={value}
                placeholder={t('search.placeholder')}
                onChangeText={handleChange}
                autoFocus
                style={styles.input}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
                <Icon name="search" size={20} color="gray" />
            </TouchableOpacity>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: "80%",
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