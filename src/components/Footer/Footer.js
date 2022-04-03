import NextLink from 'next/link';
import { Box, Container, Grid, Heading, Text, Link, Flex, Separator /*VisuallyHidden*/ } from '@design-system';
import Logo from '../Logo';

const Footer = () => {
    return (
        <Box css={{ pb: '$8' }}>
            <Separator size={2} css={{ mx: 'auto', my: '$8' }} />
            <Container size={2} css={{ maxWidth: '1090px' }}>
                <Grid
                    css={{
                        '& ul, & li': { listStyle: 'none', margin: 0, padding: 0 },
                        gridTemplateColumns: 'repeat(1, 1fr)',
                        gap: '$6',
                        '@bp2': {
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '$3',
                        },
                    }}
                >
                    <Flex css={{ flexDirection: null, alignItems: 'center', '@bp2': { flexDirection: 'column', alignItems: 'start' } }}>
                        <NextLink href="/" passHref>
                            <Link css={{ color: '$hiContrast', ':focus': { boxShadow: 'none' } }}>
                                {/* <VisuallyHidden>Modulz homepage</VisuallyHidden> */}
                                <Logo aria-hidden />
                            </Link>
                        </NextLink>

                        <Text as="span" size={3} css={{ ml: 'auto', mt: 0, '@bp2': { ml: 0, mt: 'auto' }, color: '$neutral11', lineHeight: '0', userSelect: 'none' }}>
                            &copy; Incubator {'2022 - ' + new Date().getFullYear()}
                        </Text>
                    </Flex>
                    <Box>
                        <Heading as="h6" bold>
                            Incubator
                        </Heading>
                        <ul>
                            <li>
                                <Text as="p" size={4} css={{ mt: '$3', lineHeight: '1' }}>
                                    <NextLink href="/" passHref>
                                        <Link variant="subtle">Home</Link>
                                    </NextLink>
                                </Text>
                            </li>
                            <li>
                                <Text as="p" size={4} css={{ mt: '$3', color: '$neutral8', lineHeight: '1', userSelect: 'none' }}>
                                    About
                                </Text>
                            </li>
                        </ul>
                    </Box>
                    <Box>
                        <Heading as="h6" bold>
                            Experiments
                        </Heading>
                        <ul>
                            <li>
                                <Text as="p" size={4} css={{ mt: '$3', lineHeight: '1' }}>
                                    <NextLink href="/experiments" passHref>
                                        <Link variant="subtle">All Experiments</Link>
                                    </NextLink>
                                </Text>
                            </li>
                            <li>
                                <Text as="p" size={4} css={{ mt: '$3', lineHeight: '1' }}>
                                    <NextLink href="/message-count-tracker" passHref>
                                        <Link variant="subtle">Message Count Tracker</Link>
                                    </NextLink>
                                </Text>
                            </li>
                            <li>
                                <Text as="p" size={4} css={{ mt: '$3', color: '$neutral8', lineHeight: '1', userSelect: 'none' }}>
                                    More coming soon...
                                </Text>
                            </li>
                        </ul>
                    </Box>
                    <Box>
                        <Heading as="h6" bold>
                            Community
                        </Heading>
                        <ul>
                            <li>
                                <Text as="p" size={4} css={{ mt: '$3', lineHeight: '1' }}>
                                    <Link variant="subtle" target="_blank" href="https://itinerary.eu.org">
                                        Itinerary
                                    </Link>
                                </Text>
                            </li>
                            <li>
                                <Text as="p" size={4} css={{ mt: '$3', lineHeight: '1' }}>
                                    <Link variant="subtle" target="_blank" href="https://scratchtools.edu.eu.org">
                                        Scratch Tools
                                    </Link>
                                </Text>
                            </li>
                            <li>
                                <Text as="p" size={4} css={{ mt: '$3', lineHeight: '1' }}>
                                    <Link variant="subtle" target="_blank" href="https://scratch.mit.edu/users/Looky1173/#comments">
                                        Feedback
                                    </Link>
                                </Text>
                            </li>
                        </ul>
                    </Box>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;
