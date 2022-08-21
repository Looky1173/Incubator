import { Box, Button, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, Flex, Link } from '@design-system';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export default function Report({ trigger, type, data }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button size="small" variant="neutral">
                        <Box css={{ mr: '$2', transform: 'translateY(2px)' }}>
                            <ExclamationTriangleIcon width={20} height={20} />
                        </Box>
                        {type === 'jam' ? 'Report this game jam' : 'Report'}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Report {type === 'jam' ? 'this game jam' : 'this comment'}</DialogTitle>
                <DialogDescription>
                    {type === 'jam' ? (
                        <>
                            To report a game jam, please contact{' '}
                            <Link href="https://scratch.mit.edu/users/Looky1173/#comments" target="_blank">
                                @Looky1173 on Scratch
                            </Link>
                            . Be sure to explain why you are reporting the game jam and include its title — {data.jam} — in your report!
                        </>
                    ) : (
                        <>
                            To report a comment/feedback please contact{' '}
                            <Link href="https://scratch.mit.edu/users/Looky1173/#comments" target="_blank">
                                @Looky1173 on Scratch
                            </Link>
                            . Be sure to explain why you are reporting the comment and specify if your report extends to the replies under the comment!
                            <Box css={{ mt: '$2' }} />
                            You can also reach out to the Scratch Team by clicking the{' '}
                            <Link href={`https://scratch.mit.edu/projects/${data.project}/#comments-${data.comment}`} target="_blank">
                                report button on this comment on Scratch
                            </Link>
                            .
                        </>
                    )}
                </DialogDescription>
                <Flex justify="end" css={{ mt: '$2' }}>
                    <DialogClose asChild>
                        <Button variant="accent">Understood</Button>
                    </DialogClose>
                </Flex>
            </DialogContent>
        </Dialog>
    );
}
