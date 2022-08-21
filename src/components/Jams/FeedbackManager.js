import { Avatar, AvatarFallback, AvatarImage, Badge, Box, Button, Card, Flex, Heading, Text, Skeleton, css } from '@design-system';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import fetchJson from '@utils/fetch-json';
import { useToast } from '@hooks';
import { ToastError, ToastSuccess, Report, Help } from '@components';
import { ExternalLinkIcon, AvatarIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

const selectedCommentCSS = css({
    backgroundColor: '$success2',
    color: '$success11',
    borderColor: '$success6',
});

function Reply({ content, selected }) {
    return (
        <Flex gap="2">
            <Box>
                <Avatar css={{ width: '4rem', minWidth: '4rem', borderRadius: '$4' }}>
                    <AvatarImage src={`/api/users/${content.author.username}/picture`} alt={`${content.author.username}'s profile picture`} />
                    <AvatarFallback delayMs={2000}>
                        <AvatarIcon width={40} height={40} />
                    </AvatarFallback>
                </Avatar>
            </Box>
            <Flex direction="column" gap="1" css={{ width: '100%' }}>
                <Text bold css={{ color: selected && '$success11' }}>
                    {content.author.username}
                </Text>

                <Card css={{ p: '$4' }} className={selected && selectedCommentCSS}>
                    <Text variant="inherit">{content.content}</Text>
                </Card>
            </Flex>
        </Flex>
    );
}

function Comment({ content, projectId, selected = false, toggleSelected, canBeSelected = false, enableReporting = true }) {
    const username = content?.author?.username;
    const REPLIES_LIMIT = 2;
    const { data: replies } = useSWR(content.reply_count > 0 && !content.error ? `/api/users/${username}/projects/${projectId}/comments/${content.id}/replies?offset=0&limit=${REPLIES_LIMIT}` : null);
    const { data: replyOverflow } = useSWR(
        replies?.length === REPLIES_LIMIT ? `/api/users/${username}/projects/${projectId}/comments/${content.id}/replies?offset=${REPLIES_LIMIT}&limit=${REPLIES_LIMIT}` : null,
    );

    return (
        <>
            {content.error ? (
                <Card variant="danger">
                    <Flex direction="column" gap="2" align="center" justify="center" css={{ height: '100%', p: '$4' }}>
                        <Text variant="inherit" bold size="5" align="center">
                            This comment could not be loaded
                        </Text>
                        <Text variant="inherit" align="center">
                            Comment ID: <Badge variant="danger">{content.error?.commentId}</Badge>
                        </Text>
                    </Flex>
                </Card>
            ) : (
                <>
                    <Flex gap="2">
                        <Box>
                            <Avatar css={{ width: '4rem', minWidth: '4rem', borderRadius: '$4' }}>
                                <AvatarImage src={`/api/users/${username}/picture`} alt={`${username}'s profile picture`} />
                                <AvatarFallback delayMs={2000}>
                                    <AvatarIcon width={40} height={40} />
                                </AvatarFallback>
                            </Avatar>
                        </Box>
                        <Flex direction="column" gap="1" css={{ width: '100%' }}>
                            <Text bold css={{ color: selected && '$success11' }}>
                                {username}
                            </Text>

                            <Card
                                css={{ p: '$4', cursor: 'pointer', position: 'relative', color: !selected && '$hiContrast' }}
                                className={selected && selectedCommentCSS}
                                onClick={() => canBeSelected && toggleSelected(content.id)}
                            >
                                <Text variant="inherit">{content.content}</Text>
                                {enableReporting && (
                                    <Box css={{ position: 'absolute', top: 5, right: 5 }}>
                                        <Report
                                            type="comment"
                                            data={{ project: projectId, comment: content.id }}
                                            trigger={
                                                <Button size="small" variant="neutral" css={{ fontSize: '$3' }}>
                                                    <Box css={{ mr: '$1', transform: 'translateY(2px)' }}>
                                                        <ExclamationTriangleIcon width={15} height={15} />
                                                    </Box>
                                                    Report
                                                </Button>
                                            }
                                        />
                                    </Box>
                                )}
                            </Card>

                            {content.reply_count > 0 && (
                                <Flex direction="column" gap="2" css={{ mt: '$1', maskImage: !replies && 'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 30%, transparent 90%)' }}>
                                    {replies ? (
                                        replies.map((reply) => (
                                            <>
                                                <Reply content={reply} selected={selected} />
                                            </>
                                        ))
                                    ) : (
                                        <>
                                            {[...Array(3)].map((value, index) => (
                                                <Box>
                                                    <Skeleton height="8rem" key={index} />
                                                </Box>
                                            ))}
                                        </>
                                    )}
                                    {replyOverflow?.length > 0 && (
                                        <Button
                                            as="a"
                                            target="_blank"
                                            href={`https://scratch.mit.edu/projects/${projectId}/#comments-${content.id}`}
                                            size="small"
                                            block
                                            variant={selected ? 'success' : 'base'}
                                        >
                                            View more replies on Scratch
                                            <Box css={{ ml: '$1' }}>
                                                <ExternalLinkIcon width={20} height={20} />
                                            </Box>
                                        </Button>
                                    )}
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                </>
            )}
        </>
    );
}

function FeedbackManager({ jamId, projectId, projectData, isOrganizer, user }) {
    const projectAuthor = projectData?.author;

    const [leaveFeedback, setLeaveFeedback] = useState(false);
    /*
     * Example `feedbackData` object:
     * [
     *    {author: 'Looky1173', comment: 123},
     *    {author: 'griffpatch', comment: 456},
     *    {author: 'SuperScratcher_1234', comment: 789}
     * ]
     */
    const { data: feedbackData, mutate: mutateFeedbackData } = useSWR(`/api/scratch-jams/${jamId}/submissions/${projectId}/feedback/`);

    const canLeaveFeedback = isOrganizer === false || isOrganizer === true;

    const LIMIT = 20;

    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
        leaveFeedback === true ? (index) => `/api/users/${projectAuthor}/projects/${projectId}/comments?offset=${index * LIMIT}&limit=${LIMIT}` : null,
        fetchJson,
        {
            initialSize: 10,
        },
    );

    const comments = data ? [].concat(...data) : [];
    /* const numberOfComments = comments.length; */
    const isLoadingInitialData = !data && !error;
    /* const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined'); */
    const isEmpty = data?.[0]?.length === 0;
    /* const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < LIMIT);
    const isRefreshing = isValidating && data && data.length === size; */

    const filteredComments = comments.filter((comment) => comment.author.username === user?.name);
    // Contains comments marked by the current user as feedback, merged with the data from the database
    const [selectedComments, setSelectedComments] = useState();

    const isLoadingFeedbackEditor = filteredComments.length === 0 || !feedbackData;

    useEffect(() => {
        if (isLoadingFeedbackEditor) return;
        setSelectedComments(feedbackData.filter((feedback) => feedback.author === user?.name).map((feedback) => feedback.comment));
    }, [isLoadingFeedbackEditor]);

    function toggleFeedback() {
        setLeaveFeedback((prev) => !prev);
    }

    function toggleSelectedComment(id) {
        setSelectedComments(selectedComments.includes(id) ? selectedComments.filter((el) => el !== id) : [...selectedComments, id]);
    }

    function multiFetcher(...urls) {
        return Promise.all(urls.map((url) => fetchJson(url)));
    }

    const { data: actualFeedbackData } = useSWR(
        leaveFeedback || !feedbackData ? null : feedbackData.map((feedback) => `/api/users/${projectAuthor}/projects/${projectId}/comments/${feedback.comment}`),
        multiFetcher,
    );

    const isLoadingData = (leaveFeedback && !data) || (!leaveFeedback && !actualFeedbackData && feedbackData?.length !== 0);
    const noFeedbackToBeSelected = leaveFeedback && filteredComments?.length === 0;

    const [toast] = useToast();

    const [isSavingFeedback, setIsSavingFeedback] = useState(false);

    async function saveFeedback() {
        setIsSavingFeedback(true);
        let res = await fetch(`/api/scratch-jams/${jamId}/submissions/${projectId}/feedback`, {
            method: 'PUT',
            body: JSON.stringify({ feedback: selectedComments }),
        });
        res = await res.json();

        if (res?.success) {
            toast({
                customContent: <ToastSuccess>All feedback saved</ToastSuccess>,
                variant: 'success',
                duration: 10000,
            });
            setLeaveFeedback(false);
            mutateFeedbackData();
        } else {
            toast({
                customContent: <ToastError>{res?.error?.message}</ToastError>,
                variant: 'danger',
                duration: 10000,
            });
        }

        setIsSavingFeedback(false);
    }

    return (
        <>
            <Flex justify="between" align="center">
                <Flex align="center" gap="2">
                    <Heading as="h3" size="2">
                        {leaveFeedback ? 'Add new feedback' : "Feedback from the jam's hosts"}
                    </Heading>
                    {leaveFeedback && <Help type="feedback" />}
                </Flex>
                {canLeaveFeedback && (
                    <Button
                        onClick={() => (leaveFeedback && !noFeedbackToBeSelected ? saveFeedback() : toggleFeedback())}
                        variant={leaveFeedback && !noFeedbackToBeSelected ? 'accent' : 'base'}
                        disabled={isSavingFeedback || (leaveFeedback && isLoadingData)}
                    >
                        {leaveFeedback ? 'Done' : 'Leave feedback'}
                    </Button>
                )}
            </Flex>

            <Flex direction="column" gap="4" css={{ maskImage: isLoadingData && 'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 30%, transparent 90%)' }}>
                <>
                    {canLeaveFeedback &&
                        !isLoadingFeedbackEditor &&
                        filteredComments.map((comment, index) => (
                            <>
                                <Comment
                                    content={comment}
                                    projectId={projectId}
                                    selected={selectedComments?.includes(comment.id) || false}
                                    toggleSelected={toggleSelectedComment}
                                    canBeSelected={true}
                                    enableReporting={false}
                                    key={index}
                                />
                            </>
                        ))}
                    {!leaveFeedback &&
                        actualFeedbackData &&
                        actualFeedbackData.map((comment, index) => (
                            <>
                                <Comment content={comment} projectId={projectId} key={index} />
                            </>
                        ))}
                    {isLoadingData && (
                        <>
                            {[...Array(3)].map((value, index) => (
                                <Box>
                                    <Skeleton height="8rem" key={index} />
                                </Box>
                            ))}
                        </>
                    )}
                    {!leaveFeedback && feedbackData?.length === 0 && (
                        <Text variant="subtle" align="center" css={{ my: '$4' }}>
                            No feedback yet...
                        </Text>
                    )}
                    {noFeedbackToBeSelected && (
                        <Text variant="subtle" align="center" css={{ my: '$4' }}>
                            No comments to choose from. Press "Help" for more information!
                        </Text>
                    )}
                </>
            </Flex>
        </>
    );
}

export default FeedbackManager;
