import * as React from "react";
import { StyleSheet, Animated } from "react-native";

import { randomValue } from "./random";

interface Props {
    transform: Array<{ [key: string]: Animated.AnimatedInterpolation }>;
    color: string;
    opacity: Animated.AnimatedInterpolation;
}

export const Confetti: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
    const width: number = randomValue(8, 16);
    const height: number = randomValue(6, 12);
    const isRounded: boolean = Math.round(randomValue(0, 1)) === 1;
    const {transform, opacity, color} = props;

    const style = {
        width,
        height,
        backgroundColor: color,
        transform,
        opacity
    };

    return (
        <Animated.View style={[ styles.confetti, isRounded && styles.rounded, style ]}/>
    );
};

const styles = StyleSheet.create({
    confetti: {
        position: "absolute"
    },
    rounded: {
        borderRadius: 100
    },
});
