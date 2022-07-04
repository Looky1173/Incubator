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
    styled,
} from '@design-system';
import { Layout, Jam, Select, SelectItem } from '@components';
import { MixerHorizontalIcon, DotsHorizontalIcon, Cross2Icon, CheckIcon, DividerHorizontalIcon } from '@radix-ui/react-icons';
import { useJams, usePagination, useUser } from '@hooks';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

const Label = styled('label', {
    color: '$hiContrast',
    fontSize: '$4',
    userSelect: 'none',
});

export default function ScratchGameJams() {
    const router = useRouter();
    const { user, mutateUser } = useUser();

    const [limit, setLimit] = useState(10);
    const [isInitialized, setIsInitialized] = useState(false);
    const [jamsLength, setJamsLength] = useState(0);

    // Filter states and functions
    const [filters, setFilters] = useState({ featured: 'indeterminate', organization: 'indeterminate', participation: 'indeterminate', status: 'all' });
    const updateFilters = (filter, acceptsIndeterminate = false, custom = false, customValue = null) => {
        if (acceptsIndeterminate) {
            if (filters[filter] === false) return setFilters({ ...filters, [filter]: 'indeterminate' });
            if (filters[filter] === 'indeterminate') return setFilters({ ...filters, [filter]: true });
            if (filters[filter] === true) return setFilters({ ...filters, [filter]: false });
        } else if (custom === true) {
            setFilters({ ...filters, [filter]: customValue });
        } else {
            setFilters({ ...filters, [filter]: !filters[filter] });
        }
    };

    const { page, offset, lastPage, nextPage, previousPage, jumpToPage } = usePagination({
        limit: limit,
        dataLength: jamsLength,
        isInitialized,
    });
    const {
        data,
        isLoading,
        isError,
        mutate: mutateJams,
    } = useJams(
        null,
        { limit: limit, offset: offset * limit, featured: filters.featured === 'indeterminate' ? undefined : filters.featured, status: filters.status === null ? undefined : filters.status },
        isInitialized,
    );

    useEffect(() => {
        if (router.isReady === true) {
            setLimit(router.query.limit || 10);
            jumpToPage(Number(router.query.page || 1));
            setIsInitialized(true);
        }
    }, [router.isReady]);

    useEffect(() => {
        if (router.isReady === true) {
            setLimit(router.query.limit || 10);
        }
    }, [router.isReady, router]);

    useEffect(() => {
        if (data) {
            setJamsLength(data.total);
        }
    }, [data]);

    useEffect(() => {
        if (router.isReady === true) {
            updateURLQueryParams();
        }
    }, [page, limit]);

    function updateURLQueryParams() {
        router.push(
            {
                pathname: '/scratch-jams',
                query: {
                    page: page,
                    limit: limit,
                },
            },
            undefined,
            { shallow: true },
        );
    }

    return (
        <Layout
            withSecondaryHeader
            secondaryHeader={{
                title: 'Scratch Game Jams',
                subtitle: 'Explore',
                controls: (
                    <Flex align="center" justify="end">
                        {user?.isLoggedIn === true && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button size="small" css={{ mr: '$2' }}>
                                        <DotsHorizontalIcon width={24} height={24} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow width={20} height={10} />
                                    <PopoverClose>
                                        <Cross2Icon width={20} height={20} />
                                    </PopoverClose>
                                    <Flex css={{ flexDirection: 'column', gap: 10 }}>
                                        <NextLink href="/scratch-jams/new" passHref>
                                            <Button as="a">Create new game jam</Button>
                                        </NextLink>
                                    </Flex>
                                </PopoverContent>
                            </Popover>
                        )}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button size="small" css={{ mr: '$2' }}>
                                    <Box css={{ mr: '$1' }}>
                                        <MixerHorizontalIcon width={24} height={24} />
                                    </Box>
                                    Filters
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent sideOffset={5} css={{ width: '20rem' }}>
                                <PopoverArrow width={20} height={10} />
                                <PopoverClose>
                                    <Cross2Icon width={20} height={20} />
                                </PopoverClose>
                                <Flex direction="column" gap="2">
                                    <Text bold>Limit</Text>
                                    <Select value={[3, 5, 10, 20].includes(Number(limit)) === false ? 'custom' : limit} onValueChange={(value) => setLimit(value)}>
                                        <SelectItem value="3">3 jams per page</SelectItem>
                                        <SelectItem value="5">5 jams per page</SelectItem>
                                        <SelectItem value="10">10 jams per page</SelectItem>
                                        <SelectItem value="20">20 jams per page</SelectItem>
                                        {[3, 5, 10, 20].includes(Number(limit)) === false && <SelectItem value="custom">Custom: {limit} jams per page</SelectItem>}
                                    </Select>
                                    <Text bold>Filters</Text>
                                    <Flex align="center">
                                        <Checkbox checked={filters['featured']} onCheckedChange={() => updateFilters('featured', true)} id="filter-featured">
                                            <CheckboxIndicator>
                                                {filters['featured'] === 'indeterminate' && <DividerHorizontalIcon width={24} height={24} />}
                                                {filters['featured'] === true && <CheckIcon width={24} height={24} />}
                                            </CheckboxIndicator>
                                        </Checkbox>
                                        <Label css={{ ml: 10 }} htmlFor="filter-featured">
                                            Show only featured
                                        </Label>
                                    </Flex>
                                    <Flex align="center">
                                        <Checkbox
                                            checked={filters['organization']}
                                            onCheckedChange={() => updateFilters('organization', true)}
                                            id="filter-organization"
                                            disabled={user === undefined || user?.isLoggedIn === false}
                                        >
                                            <CheckboxIndicator>
                                                {filters['organization'] === 'indeterminate' && <DividerHorizontalIcon width={24} height={24} />}
                                                {filters['organization'] === true && <CheckIcon width={24} height={24} />}
                                            </CheckboxIndicator>
                                        </Checkbox>
                                        <Label css={{ ml: 10 }} htmlFor="filter-organization">
                                            Jams organized by me
                                        </Label>
                                    </Flex>
                                    <Flex align="center">
                                        <Checkbox
                                            checked={filters['participation']}
                                            onCheckedChange={() => updateFilters('participation', true)}
                                            id="filter-participation"
                                            disabled={user === undefined || user?.isLoggedIn === false}
                                        >
                                            <CheckboxIndicator>
                                                {filters['participation'] === 'indeterminate' && <DividerHorizontalIcon width={24} height={24} />}
                                                {filters['participation'] === true && <CheckIcon width={24} height={24} />}
                                            </CheckboxIndicator>
                                        </Checkbox>
                                        <Label css={{ ml: 10 }} htmlFor="filter-participation">
                                            Jams that I have participated in
                                        </Label>
                                    </Flex>
                                    <Flex align="center">
                                        <Select
                                            value={filters['status'] === null ? 'all' : filters['status']}
                                            onValueChange={(value) => updateFilters('status', false, true, value === 'all' ? null : value)}
                                            id="filter-status"
                                        >
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="upcoming">Upcoming</SelectItem>
                                            <SelectItem value="ongoing">Ongoing</SelectItem>
                                            <SelectItem value="ended">Ended</SelectItem>
                                        </Select>{' '}
                                        <Label css={{ ml: 10 }} htmlFor="filter-status">
                                            Status
                                        </Label>
                                    </Flex>
                                </Flex>
                            </PopoverContent>
                        </Popover>
                        <Text css={{ color: '$neutral11', mr: '$2' }}>
                            Page {page}/{lastPage}
                        </Text>
                        <Button size="small" variant="accent" css={{ mr: '$2' }} onClick={previousPage} disabled={page === 1}>
                            Previous
                        </Button>
                        <Button size="small" variant="accent" onClick={nextPage} disabled={page === lastPage}>
                            Next
                        </Button>
                    </Flex>
                ),
            }}
        >
            <TitleAndMetaTags title="Scratch Game Jams | Incubator — Scratch Experiments" />
            <Container size="3" css={{ my: '$8' }}>
                {isInitialized === true && (
                    <Grid gap="4" columns={{ '@initial': 1, '@bp1': 2, '@bp2': 3 }}>
                        {isLoading === false && data !== undefined
                            ? data.jams.map((jam, index) => <Jam key={index} data={jam} loading={false} mutateThumbnailCallback={mutateJams} />)
                            : [...Array(Number(limit))].map((value, index) => <Jam loading={true} key={index} />)}
                    </Grid>
                )}
            </Container>
        </Layout>
    );
}
