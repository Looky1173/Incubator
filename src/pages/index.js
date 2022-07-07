import { useEffect, useMemo } from 'react';
import { Box, Button, Flex, TitleAndMetaTags } from '@design-system';
import { Layout, Hero } from '@components';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { useToast } from '@hooks';

export default function Home() {
    const router = useRouter();

    const [toast] = useToast();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const authErrors = [
        { title: "Couldn't log you in!", details: 'Failed FluffyScratch auth! Keep in mind that the login system currently does not support New Scratchers.' },
        { title: "Couldn't log you in!", details: "Our servers couldn't communicate with FluffyScratch and/or the Scratch API. Please try again later." },
        { title: 'You are banned from Incubator!', details: 'You can still continue to use the website logged out.' },
    ]

    useEffect(() => {
        if (router.isReady) {
            const authError = router.query['auth-error'];
            if (authError && [0, 1, 2].includes(Number(authError))) {
                toast({
                    title: authErrors[authError].title,
                    description: authErrors[authError].details,
                    action: authError != 2 && (
                        <Flex>
                            <NextLink href="/api/auth/login" passHref>
                                <Button as="a" variant="danger">
                                    Try again
                                </Button>
                            </NextLink>
                        </Flex>
                    ),
                    actionAltText: 'Try to log in again',
                    asChild: { action: true },
                    variant: 'danger',
                    duration: 10000,
                });
            }
        }
    }, [router.isReady, authErrors, router.query, toast]);

    return (
        <Layout>
            <TitleAndMetaTags title="Incubator — Scratch Experiments" />
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
            <Hero />
        </Layout>
    );
}
