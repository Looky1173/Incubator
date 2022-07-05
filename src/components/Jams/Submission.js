import { Avatar, AvatarImage, AvatarFallback, Box, Card, Flex, Heading, Badge, Text, Skeleton } from '@design-system';
import { ImageIcon, AvatarIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '@constants';
import UpvoteManager from './UpvoteManager';

function Submission({ jam, isOrganizer, project, remainingUpvotes, user }) {
    const router = useRouter();
    const [loadingProject, setLoadingProject] = useState(true);
    const { data: projectData, error, isValidating } = useSWR(project ? `/api/projects/${project.project}` : null, fetcher);

    useEffect(() => {
        setLoadingProject(!projectData ? true : false);
    }, [projectData, isValidating]);

    return (
        <Card
            as={!error && 'a'}
            variant={error ? 'danger' : 'interactive'}
            /* css={{ maxWidth: 'fit-content' }} */
            onClick={(e) => e && !error && router.push(`/scratch-jams/${jam._id}/submissions?project=${project.project}`, undefined, { scroll: false })}
        >
            {error ? (
                <Flex direction="column" gap="2" align="center" justify="center" css={{ height: '100%', p: '$4' }}>
                    <Text variant="inherit" bold size="5" align="center">
                        This submission could not be loaded
                    </Text>
                    <Text variant="inherit">
                        Project: <Badge variant="danger">{project.project}</Badge>
                    </Text>
                </Flex>
            ) : (
                <>
                    <Avatar css={{ aspectRatio: '4 / 3', btlr: '$4', btrr: '$4', overflow: 'hidden', minWidth: '250px', width: '-webkit-fill-available' }}>
                        <AvatarImage src={`/api/projects/${project.project}/thumbnail`} alt={projectData && `Thumbnail of the Scratch project "${projectData.title}"`} />
                        <AvatarFallback delayMs={2000}>
                            <ImageIcon width={40} height={40} />
                        </AvatarFallback>
                    </Avatar>
                    <Box css={{ p: '$3', color: '$neutral11' }}>
                        <Flex gap="2" align="center">
                            <Avatar css={{ aspectRatio: '1 / 1', borderRadius: '$2', width: '40px', minWidth: '40px' }}>
                                <AvatarImage src={`/api/users/${project.author}/picture`} alt={`${project.author}'s profile picture`} />
                                <AvatarFallback delayMs={2000}>
                                    <AvatarIcon width={24} height={24} />
                                </AvatarFallback>
                            </Avatar>
                            <Box>
                                <Heading>{loadingProject ? <Skeleton width="150px" /> : projectData?.title}</Heading>
                                <Text>{project.author}</Text>
                            </Box>
                        </Flex>
                        {jam.settings.allowVoting && (jam.settings.restrictVotingToHosts === false || isOrganizer === false || isOrganizer === true) && (
                            <Box css={{ mt: '$3' }}>
                                <UpvoteManager jamId={jam?._id} projectId={project.project} remainingUpvotes={remainingUpvotes} user={user} />
                            </Box>
                        )}
                    </Box>
                </>
            )}
        </Card>
    );
}

export default Submission;
