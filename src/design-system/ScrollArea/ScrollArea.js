import { styled } from '../theme/stitches.config';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

const SCROLLBAR_SIZE = 10;

const StyledScrollArea = styled(ScrollAreaPrimitive.Root, {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
});

const StyledViewport = styled(ScrollAreaPrimitive.Viewport, {
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    '& > div[style]': {
        display: 'block !important',
    },
});

const StyledScrollbar = styled(ScrollAreaPrimitive.Scrollbar, {
    display: 'flex',
    // ensures no selection
    userSelect: 'none',
    // disable browser handling of all panning and zooming gestures on touch devices
    touchAction: 'none',
    padding: 2,
    background: '$neutral6',
    transition: 'background 160ms ease-out',
    '&:hover': { background: '$colors$neutral8' },
    '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
    '&[data-orientation="horizontal"]': {
        flexDirection: 'column',
        height: SCROLLBAR_SIZE,
    },
});

const StyledThumb = styled(ScrollAreaPrimitive.Thumb, {
    flex: 1,
    background: '$neutral10',
    borderRadius: SCROLLBAR_SIZE,
    // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        minWidth: 44,
        minHeight: 44,
    },
});

const StyledCorner = styled(ScrollAreaPrimitive.Corner, {
    background: '$neutral8',
});

// Exports
const ScrollArea = StyledScrollArea;
export const ScrollAreaViewport = StyledViewport;
export const ScrollAreaScrollbar = StyledScrollbar;
export const ScrollAreaThumb = StyledThumb;
export const ScrollAreaCorner = StyledCorner;

export default ScrollArea;
