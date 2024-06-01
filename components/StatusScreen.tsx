import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

type Props = {
    text?: string,
    spinner?: boolean,
}

export const StatusScreen = (props: Props) => {
    const { spinner, text } = props;

    return (
        <ThemedView style={styles.center}>
            {spinner && (
                <ActivityIndicator size="large" color="#4299E1" />
            )}
            {text && (
                <ThemedText>{text}</ThemedText>
            )}
        </ThemedView>
    )
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})