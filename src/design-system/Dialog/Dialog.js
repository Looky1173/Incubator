import { styled, keyframes } from '../theme/stitches.config';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

const overlayShow = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
});

const contentShow = keyframes({
    '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
    '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const StyledOverlay = styled(DialogPrimitive.Overlay, {
    backgroundColor: '$neutralOpaque',
    backdropFilter: 'blur(5px)',
    position: 'fixed',
    inset: 0,
    '@media (prefers-reduced-motion: no-preference)': {
        animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
    },
});

const StyledContent = styled(DialogPrimitive.Content, {
    backgroundColor: '$loContrast',
    borderRadius: 6,
    boxShadow: '$4',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: '500px',
    maxHeight: '85vh',
    padding: '$4',
    '@media (prefers-reduced-motion: no-preference)': {
        animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
    },
    '&:focus': { outline: 'none' },
});

const StyledClose = styled('button', {
    all: 'unset',
    fontFamily: 'inherit',
    borderRadius: '100%',
    height: 25,
    width: 25,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '$accent11',
    position: 'absolute',
    top: 5,
    right: 5,

    '&:hover': { backgroundColor: '$accent4' },
    '&:focus': { boxShadow: '0 0 0 2px $colors$accent7' },
});

function Content({ children, ...props }) {
    return (
        <DialogPrimitive.Portal>
            <StyledOverlay />
            <StyledContent {...props}>
                <DialogPrimitive.Close asChild>
                    <StyledClose>
                        <Cross2Icon width={20} height={20} />
                    </StyledClose>
                </DialogPrimitive.Close>
                {children}
            </StyledContent>
        </DialogPrimitive.Portal>
    );
}

const StyledTitle = styled(DialogPrimitive.Title, {
    margin: 0,
    fontWeight: '$semibold',
    color: '$hiContrast',
    fontSize: '$5',
    lineHeight: 1.5,
});

const StyledDescription = styled(DialogPrimitive.Description, {
    mb: '$4',
    color: '$neutral11',
    fontSize: '$5',
    lineHeight: 1.3,
});

// Exports
const Dialog = DialogPrimitive.Root;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogOverlay = DialogPrimitive.Overlay;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = Content;
export const DialogTitle = StyledTitle;
export const DialogDescription = StyledDescription;
export const DialogClose = DialogPrimitive.Close;
export const DialogCloseButton = StyledClose;

export default Dialog;
