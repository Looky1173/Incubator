import { styled } from '../theme';

const Button = styled('button', {
    appearance: 'none',
    border: '0',
    outline: 'none',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'transparent',
    fontFamily: '$sans',
    lineHeight: 1,
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    userSelect: 'none',
    fontSize: '$4',
    transition: 'background-color 300ms ease',
    width: 'fit-content',
    cursor: 'pointer',

    '&:focus': {
        zIndex: 2,
    },

    '&:disabled': {
        pointerEvents: 'none',
        color: '$neutral8',
        backgroundColor: '$neutral3',
    },

    variants: {
        variant: {
            neutral: {
                color: '$neutral11',
                '&:hover': {
                    backgroundColor: '$neutral5',
                },
                '&:focus': {
                    boxShadow: '0 0 0 1px $colors$neutral8, inset 0 0 0 1px $colors$neutral8',
                },
            },

            base: {
                backgroundColor: '$neutral4',
                color: '$neutral11',
                '&:hover': {
                    backgroundColor: '$neutral5',
                },
                '&:active': {
                    backgroundColor: '$neutral6',
                },
                '&:focus': {
                    boxShadow: '0 0 0 1px $colors$neutral8, inset 0 0 0 1px $colors$neutral8',
                },
            },

            accent: {
                backgroundColor: '$accent4',
                color: '$accent11',
                '&:hover': {
                    backgroundColor: '$accent5',
                },
                '&:active': {
                    backgroundColor: '$accent6',
                },
                '&:focus': {
                    boxShadow: '0 0 0 1px $colors$accent8, inset 0 0 0 1px $colors$accent8',
                },
            },

            success: {
                backgroundColor: '$success4',
                color: '$success11',
                '&:hover': {
                    backgroundColor: '$success5',
                },
                '&:active': {
                    backgroundColor: '$success6',
                },
                '&:focus': {
                    boxShadow: '0 0 0 1px $colors$success8, inset 0 0 0 1px $colors$success8',
                },
            },

            danger: {
                backgroundColor: '$danger4',
                color: '$danger11',
                '&:hover': {
                    backgroundColor: '$danger5',
                },
                '&:active': {
                    backgroundColor: '$danger6',
                },
                '&:focus': {
                    boxShadow: '0 0 0 1px $colors$danger8, inset 0 0 0 1px $colors$danger8',
                },
            },
        },
        size: {
            small: {
                borderRadius: '$2',
                height: '$5',
                px: '$2',
            },
            base: {
                borderRadius: '$pill',
                height: '$7',
                px: '$4',
            },
            modular: {
                borderRadius: '$4',
                height: '$7',
                px: '$4',
            },
        },

        block: {
            true: {
                width: '100%',
                justifyContent: 'center',
            },
            false: {
                width: 'fit-content',
            },
        },
    },

    defaultVariants: {
        variant: 'base',
        size: 'base',
        block: false,
    },
});

export default Button;
