import { Container, Heading, TitleAndMetaTags, Skeleton, SkeletonProvider, theme } from '@design-system';
import { Layout } from '@components';

export default function Home() {
    return (
        <Layout withSecondaryHeader>
            <TitleAndMetaTags title="Scratch Game Jams | Incubator — Scratch Experiments" />
            <SkeletonProvider duration={1}>
                <Container size="2" css={{ my: '$8' }}>
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
                        {<Skeleton /* baseColor={theme.colors.accent5} highlightColor={theme.colors.accent3} */ />}
                    </Heading>
                </Container>
            </SkeletonProvider>
        </Layout>
    );
}
