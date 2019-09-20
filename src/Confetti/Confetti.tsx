import React, { useEffect, FunctionComponent, useState } from "react";
import { Animated, Dimensions, Easing } from "react-native";

import { ConfettiItem } from "../ConfettiItem";
import { randomValue } from "../helpers/random";
import { DEFAULT_COLORS, TOP_MIN } from "../helpers/defaults";
import { ConfettiProps, ExplosionPropTypes, Item } from "./ConfettiProps";

const { height, width } = Dimensions.get("window");

const Confetti: FunctionComponent<ConfettiProps> = (props: ConfettiProps): JSX.Element => {
    const animation: Animated.Value = new Animated.Value(0);
    const [ items, setItems ] = useState([] as Array<Item>);

    useEffect(() => {
        if (items.length) {
            animate();
        } else {
            calculateItems();
        }
    }, [ items ]);

    const calculateItems = (): void => {
        const {count} = props;
        const itemsSet: Array<Item> = [];

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
            itemsSet.push(item);
        });

        setItems(itemsSet);
    };

    const animate = (): void => {
        const {explosionSpeed, fallSpeed} = props;

        Animated.sequence([
            Animated.timing(animation, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true
            }),
            Animated.timing(animation, {
                toValue: 1,
                duration: explosionSpeed,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true
            }),
            Animated.timing(animation, {
                toValue: 2,
                duration: fallSpeed,
                easing: Easing.quad,
                useNativeDriver: true
            }),
        ]).start();
    };

    const renderConfetti = (item: Item, index: number): JSX.Element => {
        const {origin, colors, fadeOut} = props;

        const left = animation.interpolate({
            inputRange: [ 0, 1, 2 ],
            outputRange: [ origin.x, item.leftDelta * width, item.leftDelta * width ]
        });
        const bottom = animation.interpolate({
            inputRange: [ 0, 1, 1.2, 2 ],
            outputRange: [ item.topDelta * height, 0, item.topDelta * height, height * 3 ]
        });
        const rotateX = animation.interpolate({
            inputRange: [ 0, 2 ],
            outputRange: [ "0deg", `${item.speedDelta.rotateX * 360 * 10}deg` ]
        });
        const rotateY = animation.interpolate({
            inputRange: [ 0, 2 ],
            outputRange: [ "0deg", `${item.speedDelta.rotateY * 360 * 5}deg` ]
        });
        const rotateZ = animation.interpolate({
            inputRange: [ 0, 2 ],
            outputRange: [ "0deg", `${item.speedDelta.rotateZ * 360 * 2}deg` ]
        });
        const translateX = animation.interpolate({
            inputRange: [ 0, 0.4, 1.2, 2 ],
            outputRange: [ 0, -(item.swingDelta * 30), (item.swingDelta * 30), 0 ]
        });
        const opacity = animation.interpolate({
            inputRange: [ 0, 1, 1.8, 2 ],
            outputRange: [ 1, 1, 1, fadeOut ? 0 : 1 ]
        });

        const transform: Array<{ [key: string]: Animated.AnimatedInterpolation }>
            = [ {rotateX}, {rotateZ}, {rotateY}, {translateX} ];

        return (
            <Animated.View
                key={index}
                style={{transform: [ {translateX: left}, {translateY: bottom} ]}}
            >
                <ConfettiItem
                    color={colors[Math.round(randomValue(0, colors.length - 1))]}
                    transform={transform}
                    opacity={opacity}
                />
            </Animated.View>
        );
    };

    return (
        <>
            {items && items.map((item: Item, index: number) => renderConfetti(item, index))}
        </>
    );
};

Confetti.propTypes = ExplosionPropTypes;

Confetti.defaultProps = {
    count: 100,
    origin: {
        x: -50,
        y: 0
    },
    colors: DEFAULT_COLORS,
    explosionSpeed: 350,
    fallSpeed: 3000
};

export { Confetti };
