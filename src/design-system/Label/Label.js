import { styled } from '../theme/stitches.config';

const Label = styled('label', {
    color: '$hiContrast',
    fontSize: '$4',
    userSelect: 'none',
    variants: {
        bold: {
            true: { fontWeight: '$semibold' },
        },
    },
});

export default Label;
