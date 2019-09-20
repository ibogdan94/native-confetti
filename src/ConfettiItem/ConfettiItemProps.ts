import { Animated } from "react-native";

export interface ConfettiItemProps {
    transform: Array<{ [key: string]: Animated.AnimatedInterpolation }>;
    color: string;
    opacity: Animated.AnimatedInterpolation;
}
