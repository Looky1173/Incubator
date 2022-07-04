import { styled } from '../theme';
import Text from '../Text';

const Link = styled('a', {
    alignItems: 'center',
    gap: '$1',
    flexShrink: 0,
    outline: 'none',
    textDecorationLine: 'none',
    textUnderlineOffset: '3px',
    textDecorationColor: '$neutral4',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    lineHeight: 'inherit',
    '@hover': {
        '&:hover': {
            textDecorationLine: 'underline',
        },
    },
    '&:focus': {
        outlineWidth: '2px',
        outlineStyle: 'solid',
        outlineOffset: '2px',
        textDecorationLine: 'none',
    },
    [`& ${Text}`]: {
        color: 'inherit',
    },
    variants: {
        variant: {
            blue: {
                color: '$blue11',
                textDecorationColor: '$blue4',
                '&:focus': {
                    outlineColor: '$blue8',
                },
            },
            subtle: {
                color: '$slate11',
                textDecorationColor: '$slate4',
                '&:focus': {
                    outlineColor: '$slate8',
                },
            },
            contrast: {
                color: '$hiContrast',
                textDecoration: 'underline',
                textDecorationColor: '$slate4',
                '@hover': {
                    '&:hover': {
                        textDecorationColor: '$slate7',
                    },
                },
                '&:focus': {
                    outlineColor: '$slate8',
                },
            },
            neutral: {
                color: '$neutral11',
                textDecorationColor: '$neutral8',
                textDecorationLine: 'underline',
                '&:focus': {
                    outlineColor: '$neutral8',
                },
            },
            accent: {
                color: '$accent11',
                textDecorationColor: '$accent8',
                textDecorationLine: 'underline',
                '&:focus': {
                    outlineColor: '$accent8',
                },
            },
            danger: {
                color: '$danger11',
                textDecorationColor: '$danger8',
                textDecorationLine: 'underline',
                '&:focus': {
                    outlineColor: '$danger8',
                },
            },
            success: {
                color: '$success11',
                textDecorationColor: '$success8',
                textDecorationLine: 'underline',
                '&:focus': {
                    outlineColor: '$success8',
                },
            },
        },
    },
    defaultVariants: {
        variant: 'contrast',
    },
});

export default Link;
