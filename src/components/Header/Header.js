import NextLink from 'next/link';
import { Badge, Box, Container, Flex, Link, Text, Heading, Popover, PopoverTrigger, PopoverContent, Separator, Skeleton } from '@design-system';
import ThemeToggle from '../ThemeToggle';
import Logo from '../Logo';
import { useUser } from '@hooks';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import fetchJson from '@utils/fetch-json';
import { useState, useEffect } from 'react';

function Header({ withSecondaryHeader, secondaryHeader }) {
    const { user, mutateUser } = useUser();
    // Scroll detection based on https://stackoverflow.com/a/68088561/14226941
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <Flex
                as="header"
                css={{
                    py: '$4',
                    px: '$4',
                    jc: 'space-between',
                    position: 'relative',
                    zIndex: '1',
                }}
            >
                <NextLink href="/" passHref>
                    <Box
                        as="a"
                        css={{
                            color: '$hiContrast',
                            display: 'inline-flex',
                            '&:focus': {
                                boxShadow: 'none',
                            },
                        }}
                    >
                        <span
                            style={{
                                position: 'absolute',
                                width: 1,
                                height: 1,
                                padding: 0,
                                margin: -1,
                                overflow: 'hidden',
                                clip: 'rect(0, 0, 0, 0)',
                                whiteSpace: 'nowrap',
                                border: 0,
                            }}
                        >
                            Incubator homepage
                        </span>
                        <Logo />
                    </Box>
                </NextLink>
                <Flex as="nav" css={{ ai: 'center' }}>
                    <NextLink href="/experiments" passHref>
                        <Link variant="subtle" css={{ mr: '$5', '@bp2': { mr: '$7' } }}>
                            <Text>Experiments</Text>
                        </Link>
                    </NextLink>
                    <NextLink href="/about" passHref>
                        <Link variant="subtle" css={{ mr: '$5', display: 'none', '@bp1': { display: 'block' }, '@bp2': { mr: '$7' } }}>
                            <Text>About</Text>
                        </Link>
                    </NextLink>
                    <Link
                        href="https://github.com/Looky1173/Incubator"
                        variant="subtle"
                        css={{
                            mr: '$5',
                            display: 'none',
                            '@bp1': { display: 'block' },
                            '@bp2': { mr: '$7' },
                        }}
                    >
                        <Text>GitHub</Text>
                    </Link>
                    {user === undefined && (
                        <Link variant="subtle" css={{ mr: '$5', '@bp2': { mr: '$7' }, width: '7rem' }}>
                            {<Skeleton />}
                        </Link>
                    )}
                    {user?.isLoggedIn === false && (
                        <NextLink href="/api/auth/login" passHref>
                            <Link variant="subtle" css={{ mr: '$5', '@bp2': { mr: '$7' } }}>
                                <Text>Log in</Text>
                            </Link>
                        </NextLink>
                    )}
                    {user?.isLoggedIn === true && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Link variant="subtle" css={{ mr: '$5', '@bp2': { mr: '$7' } }}>
                                    <Text as="div" css={{ display: 'inline-flex' }}>
                                        {user?.username}
                                        <Box css={{ ml: '$1' }}>
                                            <ChevronDownIcon width={18} height={18} />
                                        </Box>
                                    </Text>
                                </Link>
                            </PopoverTrigger>
                            <PopoverContent sideOffset={10}>
                                <Flex css={{ flexDirection: 'column', gap: 10 }}>
                                    <Flex align="center" justify="between">
                                        <Text bold>Your Account</Text>
                                        {user?.admin === true && <Badge variant="accent">Admin</Badge>}
                                    </Flex>
                                    <NextLink href="/dashboard" passHref>
                                        <Link variant="subtle" css={{ mr: '$5', '@bp2': { mr: '$7' } }}>
                                            <Text>Dashboard</Text>
                                        </Link>
                                    </NextLink>
                                    <Link
                                        as="a"
                                        href="/api/auth/logout"
                                        variant="subtle"
                                        css={{ mr: '$5', '@bp2': { mr: '$7' } }}
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            mutateUser(await fetchJson('/api/auth/logout', { method: 'POST' }), false);
                                        }}
                                    >
                                        <Text>Log out</Text>
                                    </Link>
                                </Flex>
                            </PopoverContent>
                        </Popover>
                    )}
                    <ThemeToggle />
                </Flex>
            </Flex>
            {withSecondaryHeader === true && (
                <Container size="3" css={{ position: 'sticky', top: '1rem', zIndex: 10 }}>
                    <Flex
                        css={{
                            px: '$4',
                            py: '$2',
                            backgroundColor: scrollY < 150 ? '$card2' : '$card2opaque',
                            boxShadow: scrollY > 150 && '$lg',
                            backdropFilter: 'blur(5px)',
                            borderRadius: '$4',
                            border: '2px solid $colors$neutral6',
                        }}
                    >
                        <Heading as="h2">{secondaryHeader?.title}</Heading>
                        {secondaryHeader.subtitle && (
                            <>
                                <Separator orientation="vertical" css={{ mx: '$2', '&[data-orientation=vertical]': { width: '2px', height: 'initial' } }} />
                                <Heading as="h3" css={{ fontWeight: 400 }}>
                                    {secondaryHeader?.subtitle}
                                </Heading>
                            </>
                        )}
                        {secondaryHeader.controls && secondaryHeader.controls}
                    </Flex>
                </Container>
            )}
        </>
    );
}

export default Header;
