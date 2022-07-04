import { styled } from '../theme/stitches.config';

const Card = styled('div', {
    appearance: 'none',
    boxSizing: 'border-box',
    font: 'inherit',
    lineHeight: '1',
    outline: 'none',
    padding: 0,
    textAlign: 'inherit',
    verticalAlign: 'middle',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

    backgroundColor: '$card2',
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
    borderRadius: '$4',
    position: 'relative',
    border: '2px solid $colors$neutral6',

    variants: {
        variant: {
            interactive: {
                '@hover': {
                    '&:hover': {
                        border: '2px solid $colors$neutral7',
                    },
                },
                '&:focus': {
                    border: '2px solid $colors$neutral8',
                },
            },
            ghost: {
                backgroundColor: 'transparent',
                transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1), background-color 25ms linear',
                willChange: 'transform',
                '&::before': {
                    boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
                    opacity: '0',
                    transition: 'all 200ms cubic-bezier(0.22, 1, 0.36, 1)',
                },
                '@hover': {
                    '&:hover': {
                        backgroundColor: '$card2',
                        transform: 'translateY(-2px)',
                        '&::before': {
                            opacity: '1',
                        },
                    },
                },
                '&:active': {
                    transform: 'translateY(0)',
                    transition: 'none',
                    '&::before': {
                        boxShadow: '0px 5px 16px -5px rgba(22, 23, 24, 0.35), 0px 5px 10px -7px rgba(22, 23, 24, 0.2)',
                        opacity: '1',
                    },
                },
                '&:focus': {
                    boxShadow: 'inset 0 0 0 1px $colors$accent8, 0 0 0 1px $colors$accent8',
                },
            },
            active: {
                transform: 'translateY(0)',
                transition: 'none',
                '&::before': {
                    boxShadow: '0px 5px 16px -5px rgba(22, 23, 24, 0.35), 0px 5px 10px -7px rgba(22, 23, 24, 0.2)',
                    opacity: '1',
                },
                '&:focus': {
                    boxShadow: 'inset 0 0 0 1px $colors$accent8, 0 0 0 1px $colors$accent8',
                },
            },
            danger: {
                backgroundColor: '$danger2',
                color: '$danger11',
                borderColor: '$danger6',
            },
        },
    },
});

export default Card;
