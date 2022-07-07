import { Box, TitleAndMetaTags, Container, Heading, Paragraph, Section } from '@design-system';
import { Layout } from '@components';

export default function Home() {
    return (
        <Layout>
            <TitleAndMetaTags title="404 Not Found | Incubator — Scratch Experiments" />
            <Box
                css={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    position: 'absolute',
                    zIndex: '-1',
                    background: 'radial-gradient(circle at top left, $neutral5, rgba(255, 255, 255, 0) 15%), radial-gradient(circle at 80% 20%, $accent4, rgba(255, 255, 255, 0) 15%)',
                    '@bp2': {
                        background: 'radial-gradient(circle at 15% 50%, $neutral5, rgba(255, 255, 255, 0) 25%), radial-gradient(circle at 85% 30%, $accent4, rgba(255, 255, 255, 0) 25%)',
                    },
                }}
            />
            <Section>
                <Container size="3">
                    <Heading
                        size="4"
                        css={{
                            mb: '$3',
                            '@initial': {
                                pr: 100,
                            },
                            '@bp2': {
                                ta: 'center',
                                px: 180,
                            },
                            '@bp3': {
                                px: 200,
                            },
                        }}
                    >
                        404 - Not Found
                    </Heading>
                    <Paragraph
                        size="2"
                        css={{
                            mb: '$6',
                            '@bp2': {
                                mx: 230,
                                ta: 'center',
                                mb: '$7',
                            },
                        }}
                    >
                        Oops, you&apos;ve run into a non-existent page! What brought you here?
                    </Paragraph>
                </Container>
            </Section>
        </Layout>
    );
}
