import { Box, Button, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, Flex, Link } from '@design-system';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export default function Help({ trigger, type }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button size="small">
                        <Box css={{ mr: '$2' }}>
                            <QuestionMarkCircledIcon width={20} height={20} />
                        </Box>
                        Help
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{type === 'feedback' && 'How do I give feedback?'}</DialogTitle>
                <DialogDescription>
                    {type === 'feedback' && (
                        <>
                            Give feedback on a submission to let its creator know what they did well, what you've liked, and what they could do to improve the project. Always be kind and give
                            constructive feedback.
                            <Box css={{ mt: '$2' }} />
                            Your feedback should be posted on the submitted Scratch project as comments. Your comments will show up here, in the feedback editor. To select a comment (and its replies)
                            click on it and it will turn green. Do the opposite to remove a piece of feedback. Press "Done" to finalize your choices!
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
