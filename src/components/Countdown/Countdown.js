import { useEffect, useState, useMemo } from 'react';
import { isObjectEmpty } from '@utils/object';
import { Box, Flex } from '@design-system';

const calculateTimeLeft = (targetDate) => {
    const difference = targetDate - new Date().getTime();

    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return timeLeft;
};

const DateTimeDisplay = ({ value, type, variant = null }) => {
    return (
        <Flex direction="column" align="center">
            <Box as="p" css={{ fontSize: '$7', mb: '-10px' }}>
                {value}
            </Box>
            <Box as="span" css={{ fontSize: '$2', color: variant === 'accent' ? '$accent9' : '$neutral11' }}>
                {type}
            </Box>
        </Flex>
    );
};

const StyledColonSeparator = () => {
    return <Box css={{ fontSize: '$6', fontWeight: '$extrabold' }}>:</Box>;
};

const ShowCounter = ({ days, hours, minutes, seconds, variant = null }) => {
    const withLeadingZero = (number) => {
        return number < 10 ? `0${number}` : number;
    };
    return (
        <Flex gap="2" align="center" css={{ color: variant === 'accent' ? '$accent11' : '$hiContrast' }}>
            <DateTimeDisplay value={withLeadingZero(days || 0)} type={'Days'} variant={variant} />
            <StyledColonSeparator />
            <DateTimeDisplay value={withLeadingZero(hours || 0)} type={'Hours'} variant={variant} />
            <StyledColonSeparator />
            <DateTimeDisplay value={withLeadingZero(minutes || 0)} type={'Mins'} variant={variant} />
            <StyledColonSeparator />
            <DateTimeDisplay value={withLeadingZero(seconds || 0)} type={'Seconds'} variant={variant} />
        </Flex>
    );
};

const CountdownTimer = ({ targetDate, onExpiry, variant = null }) => {
    const initialTimeLeft = useMemo(() => calculateTimeLeft(targetDate), []);

    const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTimeLeft = calculateTimeLeft(targetDate);

            if (isObjectEmpty(currentTimeLeft)) {
                clearInterval(interval);
                onExpiry && onExpiry();
            }
            setTimeLeft(currentTimeLeft);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [targetDate]);

    return <ShowCounter days={timeLeft.days} hours={timeLeft.hours} minutes={timeLeft.minutes} seconds={timeLeft.seconds} variant={variant} />;
};

export default CountdownTimer;
