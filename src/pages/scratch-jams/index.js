import { Box, Button, Container, Grid, TitleAndMetaTags, Flex, Skeleton, SkeletonProvider, Text, theme } from '@design-system';
import { Layout, Jam } from '@components';
import { useJams, usePagination } from '@hooks';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    const [limit, setLimit] = useState(5);
    const [isInitialized, setIsInitialized] = useState(false);
    const [jamsLength, setJamsLength] = useState(0);

    const { page, offset, lastPage, nextPage, previousPage, jumpToPage } = usePagination({
        limit: limit,
        dataLength: 6,
    });
    const { data, isLoading, isError } = useJams(null, { limit: limit, offset: offset * limit }, isInitialized);

    useEffect(() => {
        if (router.isReady === true) {
            setLimit(router.query.limit || 5);
            jumpToPage(router.query.page || 1);
            setIsInitialized(true);
        }
    }, [router.isReady]);

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
                    <Flex align="center" justify="end" css={{ ml: 'auto' }}>
                        <Text css={{color: '$neutral11'}}>Page {page}/{lastPage}</Text>
                        <Button size="small" variant="accent" css={{ ml: '$2' }} onClick={previousPage} disabled={page === 1}>
                            Previous
                        </Button>
                        <Button size="small" variant="accent" css={{ ml: '$2' }} onClick={nextPage} disabled={page === lastPage}>
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
                        {data !== undefined
                            ? data.jams.map((jam, index) => <Jam key={index} data={jam} loading={isLoading} />)
                            : [...Array(Number(limit))].map((value, index) => <Jam loading={true} key={index} />)}
                    </Grid>
                )}
            </Container>
        </Layout>
    );
}
