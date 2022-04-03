import NextLink from 'next/link';
import { Box, Button, Container, Text, Flex, Link, Tabs, TabsList, TabsContent, TabsTrigger, TitleAndMetaTags } from '@design-system';
import { Layout } from '@components';
import { useUser } from '@hooks';
import { useRouter } from 'next/router';

export default function Dashboard() {
    const { user, mutateUser } = useUser({
        redirectTo: '/api/auth/login',
    });

    const router = useRouter();

    function deleteMyAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
            fetch('/api/user/' + user.username, { method: 'DELETE' })
                .then((response) => response.json())
                .then((data) => {
                    router.push('/');
                    mutateUser();
                });
        }
    }

    return (
        <Layout>
            <TitleAndMetaTags title="Dashboard | Incubator — Scratch Experiments" />

            <Container size="3" css={{ textAlign: 'center', mb: '$4' }}>
                <Text as="h1" size={{ '@initial': '6', '@bp2': '7' }} css={{ mb: '$4', fontWeight: 500 }}>
                    Dashboard
                </Text>
                <Text as="h2" size={{ '@initial': '4', '@bp2': '6' }} css={{ color: '$slate11', mb: '$4' }}>
                    Welcome back, {user?.username}!
                </Text>
            </Container>

            <Container size="2" css={{ my: '$8' }}>
                <Tabs defaultValue="account" orientation="horizontal">
                    <TabsList>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="settings" disabled>
                            Website settings
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Button variant="danger" onClick={deleteMyAccount}>
                            Delete my account
                        </Button>
                    </TabsContent>
                </Tabs>
            </Container>
        </Layout>
    );
}
