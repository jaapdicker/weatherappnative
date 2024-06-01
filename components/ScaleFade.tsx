import { useRef, useEffect } from "react";
import { Animated } from 'react-native';

type Props = {
    children: JSX.Element | JSX.Element[],
    duration?: number,
    delay?: number,
    styles?: StylePropertyMap
};

export const ScaleFade = ({ children, duration = 500, delay = 0, styles }: Props) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: duration,
                delay: delay * 1000,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: duration,
                delay: delay * 1000,
                useNativeDriver: true,
            })
        ]).start();
    }, [scaleAnim, fadeAnim, delay]);

    return (
        <Animated.View style={{
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
            ...styles
        }}>
            {children}
        </Animated.View>
    );
}
