import { Box, Button, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, Flex } from '@design-system';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export default function AboutScratchJams({ trigger }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button size="small">
                        <Box css={{ mr: '$1' }}>
                            <QuestionMarkCircledIcon width={20} height={20} />
                        </Box>
                        About Scratch game jams
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>What are Scratch game jams?</DialogTitle>
                <DialogDescription>
                    A game jam is a game development contest where people gather together to form teams or work individually to create a playable game in a short span of time. Usually jams have a
                    theme and a set of constraints to increase the fun!
                    <Box css={{ mt: '$2' }} />A Scratch game jam is a jam that is not limited to games and is open to all types of projects. Incubator is a platform to organize such Scratch
                    competitions, specifically built with Scratch projects in mind. A Scratcher typically hosts a jam when they reach a follower milestone, would like to engage with the community or
                    compete with their friends.
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
