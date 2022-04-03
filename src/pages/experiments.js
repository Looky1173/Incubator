import NextLink from 'next/link';
import { Box, Button, Container, Text, Flex, Link, TitleAndMetaTags } from '@design-system';
import { Layout } from '@components';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import ExperimentsJSON from './api/experiments';

export default function Experiments({ experiments }) {
    return (
        <Layout>
            <TitleAndMetaTags title="Experiments | Incubator — Scratch Experiments" />

            <Container size="3" css={{ textAlign: 'center', mb: '$4' }}>
                <Text as="h1" size={{ '@initial': '6', '@bp2': '7' }} css={{ mb: '$4', fontWeight: 500 }}>
                    Experiments
                </Text>
                <Text as="h2" size={{ '@initial': '4', '@bp2': '6' }} css={{ color: '$slate11', mb: '$4' }}>
                    Pushing Scratch to its limits...
                </Text>
            </Container>

            <Container size="2" css={{ my: '$8' }}>
                {experiments.map((experiment) => (
                    <Box key={experiment.title} css={{ color: experiment.disabled ? '$neutral8' : 'inherit', userSelect: experiment.disabled ? 'none' : 'auto' }}>
                        <Box css={{ mb: '$7' }}>
                            {experiment.disabled ? (
                                <Text as="h3" size="6" css={{ display: 'inline', fontWeight: 500, lineHeight: '30px', color: 'inherit' }}>
                                    {experiment.title}
                                </Text>
                            ) : (
                                <NextLink href={`/${experiment.slug}`} passHref>
                                    <Link css={{ color: 'inherit' }}>
                                        <Text as="h3" size="6" css={{ display: 'inline', fontWeight: 500, lineHeight: '30px' }}>
                                            {experiment.title}
                                        </Text>
                                    </Link>
                                </NextLink>
                            )}
                            {experiment.releaseDate && (
                                <Flex css={{ mt: '$2', alignItems: 'center' }}>
                                    <Text as="time" size="2" css={{ color: experiment.disabled ? '$neutral7' : '$neutral11' }}>
                                        {new Date(experiment.releaseDate).toDateString()}
                                    </Text>
                                </Flex>
                            )}
                            <Text as="p" size="4" css={{ lineHeight: '25px', mt: '$2', color: 'inherit' }}>
                                {experiment.description}
                            </Text>
                        </Box>
                    </Box>
                ))}

                <Flex css={{ justifyContent: 'center' }}>
                    <a target="_blank" href="https://scratch.mit.edu/users/Looky1173/#comments">
                        <Button as="a">
                            Suggest an experiment
                            <Box css={{ ml: '$2' }}>
                                <OpenInNewWindowIcon width={20} height={20} />
                            </Box>
                        </Button>
                    </a>
                </Flex>
            </Container>
        </Layout>
    );
}

export async function getStaticProps() {
    const experiments = await ExperimentsJSON;

    return {
        props: {
            experiments,
        },
    };
}
