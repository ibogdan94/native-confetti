import * as React from "react";
import { Animated, Dimensions, Easing } from "react-native";

import Confetti from "./Confetti";
import { randomValue } from "./random";

import { DEFAULT_COLORS, TOP_MIN } from "./defaults";
import { useCallbackState } from "./useCallbackState";

interface Item {
    leftDelta: number;
    topDelta: number;
    swingDelta: number;
    speedDelta: {
        rotateX: number;
        rotateY: number;
        rotateZ: number;
    };
}

const { height, width } = Dimensions.get("window");

export interface ExplosionProps {
    count?: number;
    origin?: {
        x: number;
        y: number;
    };
    explosionSpeed?: number;
    fallSpeed?: number;
    colors?: Array<string>;
    fadeOut?: boolean;
}

const Explosion: React.FunctionComponent<ExplosionProps> = (props: ExplosionProps): JSX.Element => {
    const animation: Animated.Value = new Animated.Value(0);
    const [items, setItems] = useCallbackState([] as Array<Item>);

    React.useEffect(() => {
        calculateItems();
    }, []);

    const calculateItems = (): void => {
        const { count } = this.props;
        const items: Array<Item> = [];

        Array(count).fill(0).map(() => {
            const item: Item = {
                leftDelta: randomValue(0, 1),
                topDelta: randomValue(TOP_MIN, 1),
                swingDelta: randomValue(0.2, 1),
                speedDelta: {
                    rotateX: randomValue(0.3, 1),
                    rotateY: randomValue(0.3, 1),
                    rotateZ: randomValue(0.3, 1)
                }
            };
            items.push(item);
        });

        setItems(items, animate());
    };

    const animate = (): void => {
        const { explosionSpeed = 350, fallSpeed = 3000 } = this.props;

        Animated.sequence([
            Animated.timing(this.animation, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true
            }),
            Animated.timing(this.animation, {
                toValue: 1,
                duration: explosionSpeed,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true
            }),
            Animated.timing(this.animation, {
                toValue: 2,
                duration: fallSpeed,
                easing: Easing.quad,
                useNativeDriver: true
            }),
        ]).start();
    };

    const renderConfetti = (item: Item, index): JSX.Element => {
        const { origin, colors = DEFAULT_COLORS, fadeOut } = props;

        const left = this.animation.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [origin.x, item.leftDelta * width, item.leftDelta * width]
        });
        const bottom = this.animation.interpolate({
            inputRange: [0, 1, 1.2, 2],
            outputRange: [item.topDelta * height, 0, item.topDelta * height, height * 3]
        });
        const rotateX = this.animation.interpolate({
            inputRange: [0, 2],
            outputRange: ["0deg", `${item.speedDelta.rotateX * 360 * 10}deg`]
        });
        const rotateY = this.animation.interpolate({
            inputRange: [0, 2],
            outputRange: ["0deg", `${item.speedDelta.rotateY * 360 * 5}deg`]
        });
        const rotateZ = this.animation.interpolate({
            inputRange: [0, 2],
            outputRange: ["0deg", `${item.speedDelta.rotateZ * 360 * 2}deg`]
        });
        const translateX = this.animation.interpolate({
            inputRange: [0, 0.4, 1.2, 2],
            outputRange: [0, -(item.swingDelta * 30), (item.swingDelta * 30), 0]
        });
        const opacity = this.animation.interpolate({
            inputRange: [0, 1, 1.8, 2],
            outputRange: [1, 1, 1, fadeOut ? 0 : 1]
        });

        const transform: Array<{ [key: string]: Animated.AnimatedInterpolation }>
            = [{ rotateX }, { rotateZ }, { rotateY }, { translateX }];

        return (
            <Animated.View
                key={index}
                style={{ transform: [{ translateX: left }, { translateY: bottom }] }}
            >
                <Confetti
                    color={colors[Math.round(randomValue(0, colors.length - 1))]}
                    transform={transform}
                    opacity={opacity}
                />
            </Animated.View>
        );
    };

    return (
        <>
            {
                items && this.state.items.map((item: Item, index: number) => {
                    return renderConfetti(item, index);
                })
            }
        </>
    );
};

Explosion.defaultProps = {
    count: 100,
    origin: {
        x: -50,
        y: 0
    }
};

export default Explosion;
