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
    styles?: StylePropertyMap
};

export const ScaleFade = ({ children, duration = 500, delay = 0, styles }: Props) => {
    const scaleAnim = useSharedValue(0);
    const fadeAnim = useSharedValue(0);

    scaleAnim.value = withDelay(
        delay * 1000,
        withTiming(1, {
            duration
        })
    )
    fadeAnim.value = withDelay(
        delay * 1000,
        withTiming(1, {
            duration
        })
    )

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scaleAnim.value }],
            opacity: fadeAnim.value,
        }
    })

    return (
        <Animated.View style={{
            ...animatedStyle,
            ...styles
        }}>
            {children}
        </Animated.View>
    );
}
