import { styled, keyframes } from '../theme/stitches.config';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

const slideUpAndFade = keyframes({
    '0%': { opacity: 0, transform: 'translateY(2px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
    '0%': { opacity: 0, transform: 'translateX(-2px)' },
    '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
    '0%': { opacity: 0, transform: 'translateY(-2px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
    '0%': { opacity: 0, transform: 'translateX(2px)' },
    '100%': { opacity: 1, transform: 'translateX(0)' },
});

const itemStyles = {
    all: 'unset',
    fontSize: '$4',
    lineHeight: 1,
    color: '$accent11',
    borderRadius: '$2',
    display: 'flex',
    alignItems: 'center',
    height: '$5',
    padding: '$1',
    position: 'relative',
    paddingLeft: '$6',
    userSelect: 'none',

    '&[data-disabled]': {
        color: '$neutral8',
        pointerEvents: 'none',
    },

    '&:focus': {
        backgroundColor: '$accent11',
        color: '$accent1',
    },
};

const StyledItem = styled(DropdownMenuPrimitive.Item, { ...itemStyles });
const StyledCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem, { ...itemStyles });
const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem, { ...itemStyles });
const StyledTriggerItem = styled(DropdownMenuPrimitive.TriggerItem, {
    '&[data-state="open"]': {
        backgroundColor: '$accent4',
        color: '$accent11',
    },
    ...itemStyles,
});

const StyledLabel = styled(DropdownMenuPrimitive.Label, {
    paddingLeft: '$4',
    fontSize: '$3',
    lineHeight: '$xl',
    color: '$neutral11',
});

const StyledSeparator = styled(DropdownMenuPrimitive.Separator, {
    height: 1,
    backgroundColor: '$accent6',
    margin: 5,
});

const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator, {
    position: 'absolute',
    left: 0,
    width: '$6',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const StyledItemIcon = styled('div', {
    position: 'absolute',
    left: 0,
    width: '$6',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const StyledArrow = styled(DropdownMenuPrimitive.Arrow, {
    fill: '$accent7',
});

const StyledContent = styled(DropdownMenuPrimitive.Content, {
    minWidth: 220,
    backgroundColor: '$card2',
    borderRadius: '$4',
    padding: '$1',
    boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px $colors$accent7',
    '@media (prefers-reduced-motion: no-preference)': {
        animationDuration: '400ms',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        animationFillMode: 'forwards',
        willChange: 'transform, opacity',
        '&[data-state="open"]': {
            '&[data-side="top"]': { animationName: slideDownAndFade },
            '&[data-side="right"]': { animationName: slideLeftAndFade },
            '&[data-side="bottom"]': { animationName: slideUpAndFade },
            '&[data-side="left"]': { animationName: slideRightAndFade },
        },
    },
    variants: {
        variant: {
            success: {
                boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px $colors$success7',
                [`& ${StyledItem}, & ${StyledCheckboxItem}, & ${StyledRadioItem}, & ${StyledTriggerItem}`]: {
                    color: '$success11',
                    '&[data-disabled]': {
                        color: '$neutral8',
                    },

                    '&:focus': {
                        backgroundColor: '$success11',
                        color: '$success1',
                    },
                },
                [`& ${StyledTriggerItem}`]: {
                    '&[data-state="open"]': {
                        backgroundColor: '$success4',
                        color: '$success11',
                    },
                },
                [`& ${StyledSeparator}`]: {
                    backgroundColor: '$success6',
                },
                [`& ${StyledArrow}`]: {
                    fill: '$success7',
                },
            },
        },
    },
});

// Exports
const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = StyledContent;
export const DropdownMenuItem = StyledItem;
export const DropdownMenuCheckboxItem = StyledCheckboxItem;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = StyledRadioItem;
export const DropdownMenuItemIndicator = StyledItemIndicator;
export const DropdownMenuItemIcon = StyledItemIcon;
export const DropdownMenuTriggerItem = StyledTriggerItem;
export const DropdownMenuLabel = StyledLabel;
export const DropdownMenuSeparator = StyledSeparator;
export const DropdownMenuArrow = StyledArrow;

export default DropdownMenu;
