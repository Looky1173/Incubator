import { Box, Flex, Text } from '@design-system';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';

export function ToastError({ children }) {
    return (
        <Flex align="center">
            <Box>
                <ExclamationTriangleIcon width={24} height={24} />
            </Box>
            <Text bold css={{ color: 'inherit', ml: '$2' }}>
                {children || 'An unexpected error occurred'}
            </Text>
        </Flex>
    );
}

export function ToastSuccess({ children }) {
    return (
        <Flex align="center">
            <Box>
                <CheckCircledIcon width={24} height={24} />
            </Box>
            <Text bold css={{ color: 'inherit', ml: '$2' }}>
                {children || 'Successfully saved all changes'}
            </Text>
        </Flex>
    );
}
