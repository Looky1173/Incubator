import { styled } from '../theme/stitches.config';
import * as TogglePrimitive from '@radix-ui/react-toggle';

const StyledToggle = styled(TogglePrimitive.Root, {
    all: 'unset',
    backgroundColor: '$card1',
    color: '$neutral11',
    height: '$6',
    px: '$2',
    borderRadius: '$2',
    display: 'flex',
    fontSize: '$4',
    lineHeight: 1,
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': { backgroundColor: '$accent3', color: '$accent10' },
    '&[data-state=on]': { backgroundColor: '$accent4', color: '$accent11' },
    '&:focus': { boxShadow: `0 0 0 2px $colors$accent8` },

    variants: {
        variant: {
            pressed: {
                backgroundColor: '$accent6',
                color: '$accent11',
            },
        },
        type: {
            icon: {
                height: '$6',
                width: '$6',
                p: 0,
            },
        },
    },
});

// Exports
const Toggle = StyledToggle;
export default Toggle;
