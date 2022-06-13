import { Box, Card, Flex, Heading, Badge, Text, Skeleton, theme, styled } from '@design-system';
import { imageDomains } from '@constants';
import { useState, useEffect } from 'react';
import getJamStatus from '@utils/get-jam-status';
import NextLink from 'next/link';

function ErrorFallback({ error = undefined }) {
    return (
        <Flex align="center" justify="center" direction="column" css={{ backgroundColor: '$danger3', color: '$danger11', width: '100%', aspectRatio: '16 / 9', px: '$4', btlr: '$4', btrr: '$4' }}>
            <Heading as="h2" css={{ color: 'inherit' }}>
                This image could not be loaded!
            </Heading>
            <br />
            {error && <Text css={{ color: 'inherit', textAlign: 'center' }}>{error}</Text>}
        </Flex>
    );
}

function isValidHttpUrl(string) {
    console.log('Str', string);
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
}

const StyledThumbnail = styled('img', {
    btlr: '$4',
    btrr: '$4',
    objectFit: 'cover',
    aspectRatio: '16 / 9',
    width: '100%',
});

function Thumbnail({ image, loading }) {
    const [loadingThumbnail, setLoadingThumbnail] = useState(true);
    const hostname = isValidHttpUrl(image) === false ? null : new URL(image).hostname;
    const [error, setError] = useState(false);

    useEffect(() => {
        if (image === undefined && loading === false) return;
        setError(
            loading ? (
                false
            ) : isValidHttpUrl(image) === false ? (
                <>Malformed image URL</>
            ) : imageDomains.includes(hostname) ? (
                false
            ) : (
                <>
                    Images are only accepted from <i>assets.scratch.mit.edu</i> and <i>cdn2.scratch.mit.edu</i>! This image is hosted under the domain <i>{hostname}</i>
                </>
            ),
        );
    }, [image, loading]);

    return (
        <>
            {(loadingThumbnail === true || loading === true) && error === false && <Skeleton width="100%" aspectRatio="16 / 9" borderRadius={`${theme.radii[4]} ${theme.radii[4]} 0 0`} />}
            {imageDomains.includes(hostname) && error === false ? (
                <Box css={{ display: loadingThumbnail === true ? 'none' : 'auto' }}>
                    <StyledThumbnail src={image} onLoad={() => setLoadingThumbnail(false)} />
                </Box>
            ) : (
                <>{loading === false && error !== false && <ErrorFallback error={error} />}</>
            )}
        </>
    );
}

function Jam({ loading = false, data }) {
    const [jamStatus, setJamStatus] = useState(null);

    useEffect(() => {
        if (loading) return;
        setJamStatus(getJamStatus(data?.dates?.start, data?.dates?.end));
    }, [loading, data]);
    return (
        <NextLink href={loading === false ? `/scratch-jams/${data._id}` : '#'} passHref>
            <Card as={loading === false && 'a'} variant="interactive" css={{ backgroundColor: data?.featured && '$accent2' }}>
                <Thumbnail image={data?.content?.headerImage} loading={loading} />
                <Box css={{ p: '$3', color: data?.featured ? '$accent11' : '$neutral11' }}>
                    <Heading css={{ mb: '$2', color: data?.featured && '$accent12' }}>{loading === true ? <Skeleton width="60%" /> : data.name}</Heading>
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
                                Hosted by {<Skeleton inline width="5rem" />}
                            </Text>
                        </Flex>
                        <Box>
                            <Text size="2" css={{ color: 'inherit' }}>
                                {<Skeleton inline width="1.5rem" />} submissions
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </Card>
        </NextLink>
    );
}

export default Jam;
