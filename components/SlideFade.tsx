import Animated, {
    withTiming,
    withDelay,
    useSharedValue,
    useAnimatedStyle,
}  from 'react-native-reanimated';

type Props = {
    children: JSX.Element | JSX.Element[],
    duration?: number,
    delay?: number,
    offsetY?: number,
    styles?: StylePropertyMap
};

export const SlideFade = ({ children, duration = 250, delay = 0, offsetY = -10, styles }: Props) => {
    const slideAnim = useSharedValue(offsetY);
    const fadeAnim = useSharedValue(0)

    slideAnim.value = withDelay(
        delay * 1000,
        withTiming(0, {
            duration: duration,
        })
        );
    fadeAnim.value = withDelay(
        delay * 1000,
        withTiming(1, {
            duration: duration,
        })
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: slideAnim.value }],
            opacity: fadeAnim.value,
        };
    });

    return (
        <Animated.View style={{
            ...animatedStyle,
            ...styles
        }}>
            {children}
        </Animated.View>
    );
}
