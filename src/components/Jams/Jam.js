import { Box, Card, Flex, Heading, Badge, Link, Text, Skeleton } from '@design-system';
import { useState, useEffect } from 'react';
import getJamStatus from '@utils/get-jam-status';
import { useJamHosts, useUser } from '@hooks';
import { useRouter } from 'next/router';
import Thumbnail from './Thumbnail';
import stopClickPropagation from '@utils/stop-click-propagation';
import { fetcher } from '@constants';
import useSWR from 'swr';

function Jam({ loading = false, data, mutateThumbnailCallback }) {
    const { user } = useUser();
    const [jamStatus, setJamStatus] = useState(null);
    const [hostData, setHostData] = useState(null);
    const { hosts, isOrganizer, loading: loadingHosts } = useJamHosts(data?._id);
    const router = useRouter();

    const { data: jamStatistics } = useSWR(data ? `/api/scratch-jams/${data?._id}/statistics` : null, fetcher);

    useEffect(() => {
        if (loading) return;
        setJamStatus(getJamStatus(data?.dates?.start, data?.dates?.end));
    }, [loading, data]);

    useEffect(() => {
        if (loadingHosts || !hosts) return;
        const hostName = hosts.find((host) => {
            return host.organizer === true;
        });
        hosts.length && setHostData({ organizer: hostName.name, others: hosts.length > 1 ? hosts.length - 1 : null });
    }, [hosts, loadingHosts]);

    return (
        <Card as={loading === false && 'a'} variant="interactive" css={{ backgroundColor: data?.meta.featured && '$accent2' }} onClick={(e) => e && router.push(`/scratch-jams/${data._id}`)}>
            <Thumbnail image={data?.content?.headerImage} loading={loading} jam={data} canChangeThumbnail={isOrganizer || user?.admin} mutateThumbnailCallback={mutateThumbnailCallback} />
            <Box css={{ p: '$3', color: data?.meta.featured ? '$accent11' : '$neutral11' }}>
                <Heading css={{ mb: '$2', color: data?.meta.featured && '$accent12' }}>{loading === true ? <Skeleton width="60%" /> : data.name}</Heading>
                <Text size="3" css={{ color: 'inherit' }}>
                    {loading === true ? <Skeleton /> : data.content.description}
                </Text>
                {loading === true ? (
                    <Box css={{ mt: '$3' }}>
                        <Skeleton width="4rem" />
                    </Box>
                ) : (
                    <Badge variant={jamStatus === 0 ? 'accent' : 'neutral'} css={{ mt: '$3' }}>
                        {jamStatus === -1 ? 'Upcoming' : jamStatus === 0 ? 'Ongoing' : 'Ended'}
                    </Badge>
                )}
                <Flex align={{ '@initial': 'start', '@bp2': 'center' }} direction={{ '@initial': 'column', '@bp2': 'row' }} gap={{ '@initial': 1, '@bp2': 0 }} justify="between" css={{ mt: '$3' }}>
                    <Flex align="center">
                        <Text size="2" css={{ color: 'inherit' }}>
                            Hosted by{' '}
                            {loadingHosts || !hostData ? (
                                <Skeleton inline width="5rem" />
                            ) : (
                                <Link
                                    variant={data?.meta.featured ? 'accent' : 'neutral'}
                                    href={loading === false ? `/scratch-jams/${data._id}/hosts` : '#'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        stopClickPropagation(e);
                                        loading === false && router.push(`/scratch-jams/${data._id}/hosts`);
                                    }}
                                >
                                    {hostData.others === null
                                        ? hostData.organizer
                                        : hostData.others === 1
                                        ? `${hostData.organizer} and a co-host`
                                        : `${hostData.organizer} and ${hostData.others} co-hosts`}
                                </Link>
                            )}
                        </Text>
                    </Flex>
                    <Box>
                        <Text size="2" css={{ color: 'inherit' }}>
                            {!jamStatistics ? (
                                <>
                                    <Skeleton inline width="1.5rem" /> submissions
                                </>
                            ) : (
                                <Link
                                    variant={data?.meta.featured ? 'accent' : 'neutral'}
                                    href={loading === false ? `/scratch-jams/${data._id}/submissions` : '#'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        stopClickPropagation(e);
                                        loading === false && router.push(`/scratch-jams/${data._id}/submissions`);
                                    }}
                                >
                                    {jamStatistics.submissions === 1 ? `${jamStatistics.submissions} submission` : `${jamStatistics.submissions} submissions`}
                                </Link>
                            )}
                        </Text>
                    </Box>
                </Flex>
            </Box>
        </Card>
    );
}

export default Jam;
