import {
    Avatar,
    AvatarImage,
    AvatarFallback,
    Box,
    Card,
    Label,
    Flex,
    Heading,
    Text,
    ScrollArea,
    ScrollAreaViewport,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    Skeleton,
    SkeletonProvider,
    styled,
} from '@design-system';
import { useState, useEffect } from 'react';
import { AvatarIcon } from '@radix-ui/react-icons';

import useSWR from 'swr';
import { fetcher } from '@constants';

const JamCard = styled(Card, {
    px: '$4',
    py: '$2',
    color: '$hiContrast',
});

export default function ScratchEmbed({ projectId }) {
    const [loading, setLoading] = useState('idle');
    const { data: project, error, mutate, isValidating } = useSWR(!projectId ? null : `/api/projects/${projectId}`, fetcher);

    useEffect(() => {
        if (!projectId || error) return setLoading('idle');
        if (isValidating && !project) return setLoading(true);
        if (project) return setLoading(false);
    }, [project, projectId, isValidating]);

    return (
        <SkeletonProvider enableAnimation={loading !== 'idle'}>
            <Flex align="center" gap="4">
                <Flex>
                    {loading === false && project && !project?.code ? (
                        <>
                            <Avatar css={{ width: '4rem', minWidth: '4rem', btlr: '$4', bblr: '$4' }}>
                                {project && !project?.code && <AvatarImage src={`/api/user/${project?.author?.username}/picture`} alt={`${project?.author?.username}'s profile picture`} />}
                                <AvatarFallback delayMs={2000}>
                                    <AvatarIcon width={40} height={40} />
                                </AvatarFallback>
                            </Avatar>
                            <JamCard css={{ btlr: 0, bblr: 0, border: 'none' }}>
                                <Flex justify="center" direction="column" gap="1">
                                    <Heading>{(project && project?.author?.username) || <Skeleton width="7rem" />}</Heading>
                                    <Text>Author</Text>
                                </Flex>
                            </JamCard>
                        </>
                    ) : (
                        <Skeleton width="12rem" height="4rem" />
                    )}
                </Flex>
                <Heading size="3" css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '-webkit-fill-available' }}>
                    {loading === false && project && !project?.code ? project.title : <Skeleton />}
                </Heading>
            </Flex>
            <Flex gap="2" direction={{ '@initial': 'column', '@bp2': 'row' }}>
                {loading === false && project && !project?.code ? (
                    <>
                        <Box css={{ aspectRatio: '6 / 5', width: '100%', borderRadius: '$4', overflow: 'hidden', '@bp2': { width: '60%' } }}>
                            <iframe
                                src={`https://scratch.mit.edu/projects/${projectId}/embed`}
                                allowTransparency="true"
                                frameBorder="0"
                                scrolling="no"
                                width="100%"
                                height="100%"
                                allowFullScreen
                            ></iframe>
                        </Box>
                        <Flex direction="column" gap="2" justify="between" css={{ flex: 1, minWidth: '12rem' }}>
                            <Flex direction="column" gap="1" css={{ height: '50%' }}>
                                <Label htmlFor="project-instructions" bold>
                                    Instructions
                                </Label>
                                <JamCard id="project-instructions" css={{ flexGrow: 1, height: 'inherit' }}>
                                    <ScrollArea>
                                        <ScrollAreaViewport>{project?.instructions}</ScrollAreaViewport>
                                        <ScrollAreaScrollbar>
                                            <ScrollAreaThumb />
                                        </ScrollAreaScrollbar>
                                    </ScrollArea>
                                </JamCard>
                            </Flex>
                            <Flex direction="column" gap="1" css={{ height: '50%' }}>
                                <Label htmlFor="project-description" bold>
                                    Notes and Credits
                                </Label>
                                <JamCard id="project-description" css={{ flexGrow: 1, height: 'inherit' }}>
                                    <ScrollArea>
                                        <ScrollAreaViewport>{project?.description}</ScrollAreaViewport>
                                        <ScrollAreaScrollbar>
                                            <ScrollAreaThumb />
                                        </ScrollAreaScrollbar>
                                    </ScrollArea>
                                </JamCard>
                            </Flex>
                        </Flex>
                    </>
                ) : (
                    <>
                        <Skeleton aspectRatio="6 / 5" />
                        <Flex direction="column" gap="2" justify="between" css={{ minWidth: '12rem' }}>
                            <Box css={{ height: '8rem', '@bp2': { height: '50% !important' } }}>
                                <Skeleton height="100%" />
                            </Box>
                            <Box css={{ height: '8rem', '@bp2': { height: '50% !important' } }}>
                                <Skeleton height="100%" />
                            </Box>
                        </Flex>
                    </>
                )}
            </Flex>
        </SkeletonProvider>
    );
}
