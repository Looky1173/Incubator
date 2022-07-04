import { styled } from '../theme/stitches.config';

const Input = styled('input', {
    borderRadius: '$4',
    p: '$2',
    border: 'none',
    fontSize: '$3',
    color: '$neutral12',
    backgroundColor: '$loContrast',
    boxShadow: 'inset 0 0 0 1px $colors$neutral7',
    '&:focus': {
        boxShadow: 'inset 0 0 0 3px $colors$accent7',
    },
    '&:disabled': {
        pointerEvents: 'none !important',
        color: '$neutral8 !important',
        backgroundColor: '$neutral3 !important',
    },
});

export default Input;
