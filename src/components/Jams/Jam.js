import { Box, Card, Flex, Heading, Text, Skeleton, theme, styled } from '@design-system';
import { imageDomains } from '@constants';
import { useState } from 'react';

function ErrorFallback({ error }) {
    console.error(error);
    return (
        <Flex align="center" justify="center" direction="column" css={{ backgroundColor: '$danger3', color: '$danger11', width: '100%', aspectRatio: '16 / 9', px: '$4', btlr: '$4', btrr: '$4' }}>
            <Heading as="h2" css={{ color: 'inherit' }}>
                This image could not be loaded!
            </Heading>
            <br />
            <Text css={{ color: 'inherit', textAlign: 'center' }}>
                Images are only accepted from <i>assets.scratch.mit.edu</i>! Check the console for details.
            </Text>
        </Flex>
    );
}

const StyledThumbnail = styled('img', {
    btlr: '$4',
    btrr: '$4',
    objectFit: 'cover',
    aspectRatio: '16 / 9',
});

function Thumbnail({ image = 'https://assets.scratch.mit.edu', loading }) {
    const [loadingThumbnail, setLoadingThumbnail] = useState(true);
    const { hostname } = new URL(image);

    return (
        <>
            {(loadingThumbnail === true || loading === true) && imageDomains.includes(hostname) && (
                <Skeleton width="100%" aspectRatio="16 / 9" borderRadius={`${theme.radii[4]} ${theme.radii[4]} 0 0`} />
            )}
            {imageDomains.includes(hostname) ? (
                <Box css={{ display: loadingThumbnail === true ? 'none' : 'auto' }}>
                    <StyledThumbnail src={image} onLoad={() => setLoadingThumbnail(false)} />
                </Box>
            ) : (
                <>{loading === false && <ErrorFallback />}</>
            )}
        </>
    );
}

function Jam({ loading = false, data }) {
    return (
        <Card as="a" href={loading === true ? '#' : 'https://itinerary.eu.org/jams/' + data.slug} variant="interactive">
            <Thumbnail image={data?.content?.headerImage} loading={loading} />
            <Box css={{ p: '$3' }}>
                <Heading css={{ mb: '$2' }}>{loading === true ? <Skeleton width="60%" /> : data.name}</Heading>
                <Text size="3" css={{ color: '$neutral11' }}>
                    {loading === true ? <Skeleton /> : data.content.description}
                </Text>
                <Flex align={{ '@initial': 'start', '@bp2': 'center' }} direction={{ '@initial': 'column', '@bp2': 'row' }} gap={{ '@initial': 1, '@bp2': 0 }} justify="between" css={{ mt: '$3' }}>
                    <Flex align="center">
                        <Text size="2" css={{ color: '$neutral11' }}>
                            Hosted by {<Skeleton inline width="5rem" />}
                        </Text>
                    </Flex>
                    <Box>
                        <Text size="2" css={{ color: '$neutral11' }}>
                            {<Skeleton inline width="1.5rem" />} submissions
                        </Text>
                    </Box>
                </Flex>
            </Box>
        </Card>
    );
}

export default Jam;
