import { styled, keyframes } from '../theme/stitches.config';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

const overlayShow = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
});

const contentShow = keyframes({
    '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
    '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const StyledOverlay = styled(AlertDialogPrimitive.Overlay, {
    backgroundColor: '$neutralOpaque',
    backdropFilter: 'blur(5px)',
    position: 'fixed',
    inset: 0,
    '@media (prefers-reduced-motion: no-preference)': {
        animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
    },
});

const StyledContent = styled(AlertDialogPrimitive.Content, {
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

function Content({ children, ...props }) {
    return (
        <AlertDialogPrimitive.Portal>
            <StyledOverlay />
            <StyledContent {...props}>{children}</StyledContent>
        </AlertDialogPrimitive.Portal>
    );
}

const StyledTitle = styled(AlertDialogPrimitive.Title, {
    margin: 0,
    fontWeight: '$semibold',
    color: '$hiContrast',
    fontSize: '$5',
    lineHeight: 1,
});

const StyledDescription = styled(AlertDialogPrimitive.Description, {
    mb: '$4',
    color: '$neutral11',
    fontSize: '$5',
    lineHeight: 1.3,
});

// Exports
const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogContent = Content;
export const AlertDialogTitle = StyledTitle;
export const AlertDialogDescription = StyledDescription;
export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;

export default AlertDialog;
