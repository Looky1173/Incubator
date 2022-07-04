import {
    Box,
    Button,
    Badge,
    Card,
    Container,
    Checkbox,
    CheckboxIndicator,
    Heading,
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuArrow,
    DropdownMenuItemIcon,
    DropdownMenuSeparator,
    Text,
    TitleAndMetaTags,
    Flex,
    Grid,
    Label,
    Link,
    IconButton,
    Input,
    Paragraph,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverClose,
    PopoverArrow,
    Skeleton,
    Separator,
    styled,
    keyframes,
} from '@design-system';
import { Layout, Countdown, Thumbnail, TextEditor, ToastError, ToastSuccess, ScratchEmbed, AboutScratchJams } from '@components';
import {
    QuestionMarkCircledIcon,
    InfoCircledIcon,
    PersonIcon,
    AvatarIcon,
    ImageIcon,
    GearIcon,
    CheckIcon,
    Pencil1Icon,
    Cross2Icon,
    ChevronDownIcon,
    TrashIcon,
    DotsVerticalIcon,
    UpdateIcon,
    PlusCircledIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
} from '@radix-ui/react-icons';
import { useJams, useUser, useJamHosts, useToast } from '@hooks';
import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { isObject } from '@utils/object';
import getJamStatus from '@utils/get-jam-status';
import { imageDomains } from '@constants';

export default function NewScratchJam() {
    const router = useRouter();
    const { user } = useUser();

    const [jamContent, setJamContent] = useState({ title: '', description: '', thumbnail: '', start: '', end: '', mystery: true });
    const [jamBody, setJamBody] = useState([]);
    const [creatingJam, setCreatingJam] = useState(false);

    const [toast] = useToast();

    async function createJam() {
        return new Promise(async (resolve, reject) => {
            setCreatingJam(true);
            let res = await fetch(`/api/scratch-jams`, {
                method: 'POST',
                body: JSON.stringify({
                    name: jamContent.title,
                    'content.description': jamContent.description,
                    'content.body': !isObject(jamBody) ? JSON.parse(jamBody) : jamBody,
                    'dates.start': new Date(jamContent.start),
                    'dates.end': new Date(jamContent.end),
                    'content.headerImage': jamContent.thumbnail,
                    'settings.enableMystery': jamContent.mystery,
                }),
            });
            res = await res.json();
            if (res.error) {
                toast({
                    customContent: <ToastError>{res.error?.message}</ToastError>,
                    variant: 'danger',
                    duration: 10000,
                });
                setCreatingJam(false);
                resolve(false);
            } else if (res.success) {
                toast({
                    customContent: <ToastSuccess>Your game jam was successfully created! Please wait while you are redirected to page of your new game jam...</ToastSuccess>,
                    variant: 'success',
                    duration: 10000,
                });
                router.push(`/scratch-jams/${res.insertedId}?newJamTutorial=true`, `/scratch-jams/${res.insertedId}`);
                resolve(true);
            }
        });
    }

    return (
        <Layout
            withSecondaryHeader
            secondaryHeader={{
                title: <NextLink href="/scratch-jams">Scratch Game Jams</NextLink>,
                subtitle: 'Create a new game jam',
                controls: (
                    <Flex align="center" wrap="wrap" justify="center">
                        <AboutScratchJams />
                    </Flex>
                ),
            }}
        >
            <TitleAndMetaTags title="Create a new Scratch game jam | Incubator — Scratch Experiments" />
            <Container size="3" css={{ my: '$8' }}>
                <Flex direction="column" gap="4">
                    <Flex direction="column" gap="1">
                        <Flex align="center" gap="2">
                            <Label htmlFor="jam-title" bold>
                                Title:
                            </Label>
                            <Badge variant="danger">Required</Badge>
                        </Flex>
                        <Input
                            value={jamContent.title}
                            onChange={(e) => setJamContent({ ...jamContent, title: e.target.value })}
                            placeholder="Give the game jam a short and catchy title"
                            id="jam-title"
                            css={{ fontSize: '$7', fontWeight: '$semibold' }}
                        />
                    </Flex>
                    <Flex justify="center" css={{ mb: '-1rem' }}>
                        <Separator size="2" />
                    </Flex>
                    <Flex direction="column" gap="1">
                        <Label htmlFor="jam-description" bold>
                            Summary:
                        </Label>
                        <Input
                            value={jamContent.description}
                            onChange={(e) => setJamContent({ ...jamContent, description: e.target.value })}
                            as="textarea"
                            placeholder="Summarize the game jam briefly. This summary will be public even before the jam goes live so make sure to not give too much away."
                            id="jam-description"
                            css={{ resize: 'none', height: '100%', fontSize: '$5', color: '$neutral11' }}
                        />
                    </Flex>
                    <Flex direction="column" gap="1">
                        <Label htmlFor="thumbnail-url" bold>
                            Cover image URL:
                        </Label>
                        <Input id="thumbnail-url" css={{ width: '100%' }} value={jamContent.thumbnail} onInput={(e) => setJamContent({ ...jamContent, thumbnail: e.target.value })} />
                        <Paragraph css={{ color: '$neutral11' }}>
                            Images are only accepted from{' '}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Link as="span" css={{ cursor: 'pointer', color: '$neutral11' }}>
                                        <i>certain domains</i>
                                    </Link>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>White-listed image hosts</DialogTitle>
                                    <DialogDescription>
                                        {imageDomains.map((domain, index) => (
                                            <Fragment key={index}>
                                                <Box as="span">{domain}</Box>
                                                <br />
                                            </Fragment>
                                        ))}
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                            .
                        </Paragraph>
                    </Flex>
                    <Flex direction="column" gap="1">
                        <Flex align="center" gap="2">
                            <Label htmlFor="jam-body" bold>
                                Description:
                            </Label>
                            <Badge variant="danger">Required</Badge>
                        </Flex>
                        <TextEditor id="jam-body" editable={true} content={jamBody} onContentChange={(content) => setJamBody(content)} />
                    </Flex>
                    <Flex justify="center" css={{ mb: '-1rem' }}>
                        <Separator size="2" />
                    </Flex>
                    <Flex gap="2" wrap="wrap" align="end" css={{ mt: '$2' }}>
                        <Flex direction="column" css={{ width: '100%', '@bp1': { width: 'fit-content' } }}>
                            <Flex align="center" gap="2">
                                <Label htmlFor="start-date" bold>
                                    Start date:
                                </Label>
                                <Badge variant="danger">Required</Badge>
                            </Flex>
                            <Input
                                id="start-date"
                                type="datetime-local"
                                css={{ mt: '$1' }}
                                value={jamContent.start}
                                onChange={(event) => event.target.validity.valid && setJamContent({ ...jamContent, start: event.target.value })}
                            />
                        </Flex>
                        <Flex direction="column" css={{ width: '100%', '@bp1': { width: 'fit-content' } }}>
                            <Flex align="center" gap="2">
                                <Label htmlFor="end-date" bold>
                                    End date:
                                </Label>
                                <Badge variant="danger">Required</Badge>
                            </Flex>
                            <Input
                                id="end-date"
                                type="datetime-local"
                                css={{ mt: '$1' }}
                                value={jamContent.end}
                                onChange={(event) => event.target.validity.valid && setJamContent({ ...jamContent, end: event.target.value })}
                            />
                        </Flex>
                    </Flex>
                    <Flex align="center">
                        <Checkbox checked={jamContent.mystery} onCheckedChange={(checked) => setJamContent({ ...jamContent, mystery: checked })} id="settings-allow-voting">
                            <CheckboxIndicator>
                                <CheckIcon width={24} height={24} />
                            </CheckboxIndicator>
                        </Checkbox>
                        <Label css={{ ml: 10 }} htmlFor="settings-allow-voting">
                            Hide the main description of the game jam before it starts
                        </Label>
                    </Flex>
                    <Flex justify="center" css={{ mb: '-1rem' }}>
                        <Separator size="2" />
                    </Flex>
                    <Button variant="accent" block={{ '@initial': true, '@bp2': false }} onClick={createJam} disabled={creatingJam}>
                        {creatingJam ? 'Bringing your game jam to life...' : 'Create'}
                    </Button>
                </Flex>
            </Container>
        </Layout>
    );
}
