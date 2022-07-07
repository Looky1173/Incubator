import { forwardRef } from 'react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectIcon,
    SelectContent,
    SelectViewport,
    SelectItem,
    SelectItemText,
    SelectItemIndicator,
    SelectScrollUpButton,
    SelectScrollDownButton,
} from '@design-system';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

export const CustomSelect = forwardRef(({ children, ...props }, forwardedRef) => {
    return (
        <Select {...props}>
            <SelectTrigger ref={forwardedRef} id={props.id}>
                <SelectValue />
                <SelectIcon>
                    <ChevronDownIcon />
                </SelectIcon>
            </SelectTrigger>
            <SelectContent>
                <SelectScrollUpButton>
                    <ChevronUpIcon />
                </SelectScrollUpButton>
                <SelectViewport>{children}</SelectViewport>
                <SelectScrollDownButton>
                    <ChevronDownIcon />
                </SelectScrollDownButton>
            </SelectContent>
        </Select>
    );
});
CustomSelect.displayName = "CustomSelect";

export const CustomSelectItem = forwardRef(({ children, ...props }, forwardedRef) => {
    return (
        <SelectItem {...props} ref={forwardedRef}>
            <SelectItemText>{children}</SelectItemText>
            <SelectItemIndicator>
                <CheckIcon />
            </SelectItemIndicator>
        </SelectItem>
    );
});
CustomSelectItem.displayName = "CustomSelectItem";