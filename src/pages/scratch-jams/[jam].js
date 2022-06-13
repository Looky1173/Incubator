import {
    Box,
    Button,
    Container,
    Checkbox,
    CheckboxIndicator,
    Grid,
    TitleAndMetaTags,
    Flex,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverClose,
    PopoverArrow,
    Text,
    Link,
    Skeleton,
    styled,
} from '@design-system';
import NextLink from 'next/link';
import { Layout, Jam, Select, SelectItem } from '@components';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useJams, usePagination, useUser } from '@hooks';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Label = styled('label', {
    color: '$hiContrast',
    fontSize: '$4',
    userSelect: 'none',
});

export default function ScratchJam() {
    const router = useRouter();
    const { user, mutateUser } = useUser();

    const [jamId, setJamId] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const { data, isLoading, isError } = useJams(jamId, null, isInitialized);

    useEffect(() => {
        if (router.isReady === true) {
            setJamId(router.query.jam);
            setIsInitialized(true);
        }
    }, [router.isReady]);

    return (
        <Layout
            withSecondaryHeader
            secondaryHeader={{
                title: 'Scratch Game Jams',
                subtitle: data?.name || <Skeleton width="10rem" />,
                controls: (
                    <Flex align="center" justify="end" css={{ ml: 'auto' }}>
                        <Button size="small" css={{ mr: '$2' }}>
                            <Box css={{ mr: '$1' }}>
                                <QuestionMarkCircledIcon width={20} height={20} />
                            </Box>
                            About Scratch game jams
                        </Button>
                    </Flex>
                ),
            }}
        >
            <TitleAndMetaTags title="Scratch Game Jam | Incubator — Scratch Experiments" />
            <Container size="3" css={{ my: '$8' }}></Container>
        </Layout>
    );
}
