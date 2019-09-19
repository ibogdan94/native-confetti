import * as React from "react";
import { StyleSheet, Animated } from "react-native";

import { randomValue } from "./random";

interface Props {
    transform: Array<{ [key: string]: Animated.AnimatedInterpolation }>;
    color: string;
    opacity: Animated.AnimatedInterpolation;
}

class Confetti extends React.PureComponent<Props> {
    protected width: number = randomValue(8, 16);
    protected height: number = randomValue(6, 12);
    protected isRounded: boolean = Math.round(randomValue(0, 1)) === 1;
    protected backgroundColor: string = this.props.color;

    public render(): React.ReactNode {
        const { transform, opacity } = this.props;

        const style = {
            width: this.width,
            height: this.height,
            backgroundColor: this.backgroundColor,
            transform,
            opacity
        };

        return (
            <Animated.View style={ [styles.confetti, this.isRounded && styles.rounded, style] }/>
        );
    }
}

const styles = StyleSheet.create({
    confetti: {
        position: "absolute"
    },
    rounded: {
        borderRadius: 100
    },
});

export default Confetti;
