import PropTypes from "prop-types";

export interface Item {
    leftDelta: number;
    topDelta: number;
    swingDelta: number;
    speedDelta: {
        rotateX: number;
        rotateY: number;
        rotateZ: number;
    };
}

export interface ConfettiProps {
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

export const ExplosionPropTypes: { [P in keyof ConfettiProps]: PropTypes.Validator<any> }  = {
    count: PropTypes.number,
    origin: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number}),
    explosionSpeed: PropTypes.number,
    fallSpeed: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    fadeOut: PropTypes.bool
};
