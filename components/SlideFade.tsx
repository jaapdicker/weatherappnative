import { useRef, useEffect } from "react";
import { Animated } from 'react-native';

type Props = {
    children: JSX.Element | JSX.Element[],
    duration?: number,
    delay?: number,
    offsetY?: number,
    styles?: StylePropertyMap
};

export const SlideFade = ({ children, duration = 250, delay = 0, offsetY = -10, styles }: Props) => {
    const slideAnim = useRef(new Animated.Value(offsetY)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
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
    }, [slideAnim, fadeAnim, delay]);

    return (
        <Animated.View style={{
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
            ...styles
        }}>
            {children}
        </Animated.View>
    );
}
