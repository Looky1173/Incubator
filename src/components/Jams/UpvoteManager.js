import { Box, Button, Card, Flex, Heading, Badge, Link, Text, Skeleton } from '@design-system';
import { useState } from 'react';
import stopClickPropagation from '@utils/stop-click-propagation';
import useSWR from 'swr';
import { fetcher, MAXIMUM_UPVOTES_PER_JAM } from '@constants';
import { useToast } from '@hooks';
import { ToastError } from '@components';

function UpvoteManager({ jamId, projectId, remainingUpvotes, user, block = true }) {
    const { data, mutate } = useSWR(projectId && jamId ? `/api/scratch-jams/${jamId}/submissions/${projectId}/upvotes` : null, fetcher);

    const [toast] = useToast();

    async function handleUpvote() {
        if (user.isLoggedIn === false)
            return toast({
                customContent: <ToastError>You must sign in to upvote submissions</ToastError>,
                variant: 'danger',
                duration: 5000,
            });

        if (remainingUpvotes === 0 && data.upvoted === false)
            return toast({
                customContent: (
                    <ToastError>
                        You can only upvote {MAXIMUM_UPVOTES_PER_JAM} submissions per game jam! This limit exists to encourage users to evaluate each submitted project, possibly leave some
                        constructive feedback, and carefully consider which submissions to upvote.
                    </ToastError>
                ),
                variant: 'danger',
                duration: 15000,
            });

        // Local/optimistic update. DON'T REVALIDATE
        mutate({ count: data.upvoted ? data.count - 1 : data.count + 1, upvoted: !data.upvoted }, false);
        let res = await fetch(`/api/scratch-jams/${jamId}/submissions/${projectId}/upvotes`, {
            method: data.upvoted ? 'DELETE' : 'POST',
        });
        res = await res.json();

        // Revalidate after having dealt with the upvote
        mutate();

        if (!res?.success) {
            toast({
                customContent: <ToastError />,
                variant: 'danger',
                duration: 10000,
            });
        }
    }

    return (
        <Button
            variant={data?.upvoted ? 'success' : 'base'}
            block={block}
            size="modular"
            onClick={(e) => {
                stopClickPropagation(e);
                handleUpvote();
            }}
            disabled={!data}
        >
            <Badge css={{ mr: '$2', backgroundColor: data?.upvoted ? '$success11' : '$neutral11', color: data?.upvoted ? '$success4' : '$neutral4' }}>{data ? data.count : '...'}</Badge>
            {data?.upvoted ? 'Upvoted' : 'Upvote'}
        </Button>
    );
}

export default UpvoteManager;
