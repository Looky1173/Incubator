import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
    Avatar,
    AvatarImage,
    AvatarFallback,
    Badge,
    Box,
    Button,
    Card,
    Container,
    Checkbox,
    CheckboxIndicator,
    Heading,
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
import { Layout, Countdown, Thumbnail, TextEditor, ToastError, ToastSuccess, ScratchEmbed, AboutScratchJams, Submission, Select, SelectItem, UpvoteManager } from '@components';
import {
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
    ExternalLinkIcon,
} from '@radix-ui/react-icons';
import { useJams, useUser, useJamHosts, useToast } from '@hooks';
import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { isObject } from '@utils/object';
import getJamStatus from '@utils/get-jam-status';
import { fetcher } from '@constants';

import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

const JamCard = styled(Card, {
    px: '$4',
    py: '$2',
});

function JamHosts({ hosts, isOrganizer, isAdmin, user, addHost, transferHost, removeHost }) {
    const [addingHost, setAddingHost] = useState(false);
    const [addHostValue, setAddHostValue] = useState('');
    const [hostTransfer, setHostTransfer] = useState({ dialogOpen: false, loading: false, newHostUsername: null });
    const [removingHost, setRemovingHost] = useState(false);

    return (
        <>
            <AlertDialog open={hostTransfer.dialogOpen} onOpenChange={(open) => setHostTransfer({ ...hostTransfer, dialogOpen: open })}>
                <AlertDialogContent>
                    <AlertDialogTitle>You are about to make {hostTransfer.newHostUsername} the host of this game jam</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isAdmin === true ? (
                            'Please confirm your intent.'
                        ) : (
                            <>
                                <b>This action cannot be undone!</b>
                                <Flex justify="center" css={{ my: '$2' }}>
                                    <Separator size="2" />
                                </Flex>
                                This means that you will no longer be able to edit your game jam (including its title, description, main content, start/end date and settings). Moreover, you will not
                                be able to invite co-hosts.
                            </>
                        )}
                    </AlertDialogDescription>
                    <Flex gap="2" wrap="wrap">
                        <AlertDialogCancel asChild>
                            <Button disabled={hostTransfer.loading} block>
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                disabled={hostTransfer.loading}
                                block
                                variant="danger"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    setHostTransfer({ ...hostTransfer, loading: true });
                                    await transferHost(hostTransfer.newHostUsername);
                                    setHostTransfer({ dialogOpen: false, loading: false, newHostUsername: null });
                                }}
                            >
                                Make {hostTransfer.newHostUsername} the new host
                            </Button>
                        </AlertDialogAction>
                    </Flex>
                </AlertDialogContent>
            </AlertDialog>
            {(isOrganizer === true || isAdmin === true) && (
                <>
                    <Label htmlFor="add-host-username">Username:</Label>
                    <Flex gap="2" wrap="wrap" css={{ mb: '$4' }}>
                        <Input disabled={addingHost} id="add-host-username" placeholder="Username" css={{ flexGrow: 1 }} value={addHostValue} onInput={(e) => setAddHostValue(e.target.value)} />
                        <Button
                            disabled={addingHost}
                            block={{ '@initial': true, '@bp1': false }}
                            onClick={async () => {
                                setAddingHost(true);
                                await addHost(addHostValue);
                                setAddHostValue('');
                                setAddingHost(false);
                            }}
                        >
                            Add co-host
                        </Button>
                    </Flex>
                </>
            )}
            <Grid gap="4" columns={{ '@initial': 1, '@bp1': 2, '@bp2': 3 }}>
                {hosts &&
                    hosts
                        .sort((a, b) => (a.organizer === b.organizer ? 0 : a.organizer ? -1 : 1))
                        .map((host, index) => (
                            <Flex align="center" css={{ overflow: 'hidden' }} key={index}>
                                <Avatar css={{ width: '4rem', minWidth: '4rem', btlr: '$4', bblr: '$4' }}>
                                    <AvatarImage src={`/api/users/${host.name}/picture`} alt={`${host.name}'s profile picture`} />
                                    <AvatarFallback delayMs={2000}>
                                        <AvatarIcon width={40} height={40} />
                                    </AvatarFallback>
                                </Avatar>
                                <JamCard css={{ btlr: 0, bblr: 0, border: 'none', flexGrow: 1, flexShrink: 1, whiteSpace: 'nowrap', overflow: 'inherit' }}>
                                    <Flex align="center" justify="between" css={{ overflow: 'inherit' }}>
                                        <Box css={{ overflow: 'inherit' }}>
                                            <Heading css={{ overflow: 'inherit', textOverflow: 'ellipsis' }}>{host.name}</Heading>
                                            <Paragraph>{host.organizer === true ? 'Host' : 'Co-Host'}</Paragraph>
                                        </Box>
                                        {user && ((host.organizer === false && (isOrganizer || isAdmin)) || (host.name === user?.name && !isOrganizer)) && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <IconButton size="2" variant="ghost" aria-label="host actions menu" disabled={removingHost}>
                                                        <DotsVerticalIcon width={24} height={24} />
                                                    </IconButton>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side="right">
                                                    {host.organizer === false && (isOrganizer || isAdmin) && (
                                                        <DropdownMenuItem onClick={() => setHostTransfer({ ...hostTransfer, dialogOpen: true, newHostUsername: host.name })}>
                                                            <DropdownMenuItemIcon>
                                                                <PersonIcon width={24} height={24} />
                                                            </DropdownMenuItemIcon>
                                                            Transfer jam ownership
                                                        </DropdownMenuItem>
                                                    )}
                                                    {((host.organizer === false && (isOrganizer || isAdmin)) || (host.name === user?.name && !isOrganizer)) && (
                                                        <DropdownMenuItem
                                                            onClick={async () => {
                                                                setRemovingHost(true);
                                                                await removeHost(host.name);
                                                                setRemovingHost(false);
                                                            }}
                                                        >
                                                            <DropdownMenuItemIcon>
                                                                <TrashIcon width={24} height={24} />
                                                            </DropdownMenuItemIcon>
                                                            Remove
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuArrow width={20} height={10} />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </Flex>
                                </JamCard>
                            </Flex>
                        ))}
            </Grid>
        </>
    );
}

const JamSettingsOverlay = styled(Flex, {
    backgroundColor: '$accentOpaque',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    color: '$accent11',
    fontWeight: '$bold',
    fontSize: '$6',
    p: '$4',
});

const rotateAnimation = keyframes({
    '0%': {
        transform: 'rotate(0deg)',
    },
    '100%': {
        transform: 'rotate(360deg)',
    },
});

function JamSettings({ isAdmin, isOrganizer, jam, mutateJam }) {
    const [toast] = useToast();

    const [updating, setUpdating] = useState(false);
    const [settings, setSettings] = useState({
        'dates.start': null,
        'dates.end': null,
        'settings.allowVoting': null,
        'settings.restrictVotingToHosts': null,
        'settings.enableMystery': null,
        'settings.allowTeams': null,
        'meta.featured': null,
    });
    const [dates, setDates] = useState({ start: '', end: '' });

    const [dialogs, setDialogs] = useState({ archiveJamOpen: false, archiveJamLoading: false, deleteJamOpen: false, deleteJamLoading: false });
    const router = useRouter();

    const getDateString = (date) => {
        const newDate = date ? new Date(date) : new Date();
        return new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000).toISOString().slice(0, -8);
    };

    useEffect(() => {
        setSettings({
            'settings.allowVoting': jam.settings.allowVoting,
            'settings.restrictVotingToHosts': jam.settings.restrictVotingToHosts,
            'settings.enableMystery': jam.settings.enableMystery,
            'settings.allowTeams': jam.settings.allowTeams,
            'meta.featured': jam.meta.featured,
        });
        setDates({ start: getDateString(jam.dates.start), end: getDateString(jam.dates.end) });
    }, [jam, updating]);

    async function updateSettings(setting, newValue) {
        setUpdating(true);
        const updatingDates = setting === 'dates';
        const updates = updatingDates ? { 'dates.start': new Date() > new Date(jam?.dates?.start) ? undefined : newValue.start, 'dates.end': newValue.end } : { [setting]: newValue };

        !updatingDates && setSettings({ ...settings, ...updates });

        let res = await fetch(`/api/scratch-jams/${jam._id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        res = await res.json();

        if (res.error) {
            toast({
                customContent: <ToastError>{res.error?.message}</ToastError>,
                variant: 'danger',
                duration: 10000,
            });
        } else if (res.success) {
            toast({
                customContent: <ToastSuccess>Successfully saved all settings</ToastSuccess>,
                variant: 'success',
                duration: 10000,
            });
        }

        mutateJam();
        setUpdating(false);
    }

    async function archiveJam() {
        setDialogs({ ...dialogs, archiveJamLoading: true });

        let res = await fetch(`/api/scratch-jams/${jam._id}/archive`, {
            method: 'PUT',
            body: JSON.stringify({ archived: true }),
        });
        res = await res.json();

        if (res.error) {
            toast({
                customContent: <ToastError />,
                variant: 'danger',
                duration: 10000,
            });
        } else if (res.success) {
            toast({
                customContent: <ToastSuccess>The game jam {jam.name} has been archived</ToastSuccess>,
                variant: 'success',
                duration: 10000,
            });
        }

        setDialogs({ ...dialogs, archiveJamLoading: false, archiveJamOpen: false });
        return isAdmin ? mutateJam() : router.push(`/scratch-jams`);
    }

    async function deleteJam() {
        setDialogs({ ...dialogs, deleteJamLoading: true });

        let res = await fetch(`/api/scratch-jams/${jam._id}`, {
            method: 'DELETE',
        });
        res = await res.json();

        if (res.error) {
            toast({
                customContent: <ToastError />,
                variant: 'danger',
                duration: 10000,
            });
        } else if (res.success) {
            toast({
                customContent: <ToastSuccess>The game jam {jam.name} has been deleted</ToastSuccess>,
                variant: 'success',
                duration: 10000,
            });
        }

        setDialogs({ ...dialogs, deleteJamLoading: false, deleteJamOpen: false });
        return router.push(`/scratch-jams`);
    }

    return (
        <>
            <AlertDialog open={dialogs.archiveJamOpen} onOpenChange={(open) => setDialogs({ ...dialogs, archiveJamOpen: open })}>
                <AlertDialogContent>
                    <AlertDialogTitle>You are about to archive the game jam {jam.name}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isAdmin === true ? (
                            'Please confirm your intent.'
                        ) : (
                            <>
                                <b>Only an administrator can restore archived game jams!</b>
                                <Flex justify="center" css={{ my: '$2' }}>
                                    <Separator size="2" />
                                </Flex>
                                Archiving your game jam will make it inaccessible to the public - including you - and it will no longer show up on the explore page.
                            </>
                        )}
                    </AlertDialogDescription>
                    <Flex gap="2" wrap="wrap">
                        <AlertDialogCancel asChild>
                            <Button disabled={dialogs.archiveJamLoading} block>
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                disabled={dialogs.archiveJamLoading}
                                block
                                variant="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    archiveJam();
                                }}
                            >
                                Archive game jam
                            </Button>
                        </AlertDialogAction>
                    </Flex>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={dialogs.deleteJamOpen} onOpenChange={(open) => setDialogs({ ...dialogs, deleteJamOpen: open })}>
                <AlertDialogContent>
                    <AlertDialogTitle>
                        You are about to{' '}
                        <Box as="span" css={{ fontWeight: '$extrabold' }}>
                            permanently delete{' '}
                        </Box>{' '}
                        the game jam {jam.name}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <b>This action cannot be undone!</b>
                        <Flex justify="center" css={{ my: '$2' }}>
                            <Separator size="2" />
                        </Flex>
                        Deleting a game jam will erase everything related to it from the database - including itself, as well as its submissions, the votes cast on those submissions, its winners, its
                        hosts, and its settings.
                    </AlertDialogDescription>
                    <Flex gap="2" wrap="wrap">
                        <AlertDialogCancel asChild>
                            <Button disabled={dialogs.deleteJamLoading} block>
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                disabled={dialogs.deleteJamLoading}
                                block
                                variant="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteJam();
                                }}
                            >
                                <Box>
                                    Delete this game jam{' '}
                                    <Box as="span" css={{ fontWeight: '$extrabold' }}>
                                        permanently
                                    </Box>
                                </Box>
                            </Button>
                        </AlertDialogAction>
                    </Flex>
                </AlertDialogContent>
            </AlertDialog>
            <Box css={{ position: 'relative', borderRadius: '$4', overflow: 'hidden' }}>
                {updating && (
                    <JamSettingsOverlay align="center" justify="center" direction="column" gap="2">
                        <Box css={{ animation: `${rotateAnimation} 1.5s linear infinite` }}>
                            <UpdateIcon width={60} height={60} />
                        </Box>
                        Updating settings...
                    </JamSettingsOverlay>
                )}
                <JamCard css={{ filter: updating && 'blur(5px)' }}>
                    <Heading>Configure your game jam</Heading>
                    <Text variant="subtle">This panel is only visible to you, the main host (organizer) of this game jam, as well as to administrators.</Text>
                    <Flex gap="2" wrap="wrap" align="end" css={{ mt: '$2' }}>
                        <Flex direction="column" css={{ width: '100%', '@bp1': { width: 'fit-content' } }}>
                            <Label htmlFor="start-date">Start date:</Label>
                            <Input
                                id="start-date"
                                type="datetime-local"
                                css={{ mt: '$1' }}
                                value={dates.start}
                                onChange={(event) => event.target.validity.valid && setDates({ ...dates, start: event.target.value })}
                                disabled={new Date() > new Date(jam?.dates?.start)}
                            />
                        </Flex>
                        <Flex direction="column" css={{ width: '100%', '@bp1': { width: 'fit-content' } }}>
                            <Label htmlFor="end-date">End date:</Label>
                            <Input
                                id="end-date"
                                type="datetime-local"
                                css={{ mt: '$1' }}
                                value={dates.end}
                                onChange={(event) => event.target.validity.valid && setDates({ ...dates, end: event.target.value })}
                            />
                        </Flex>
                        <Button
                            block={{ '@initial': true, '@bp1': false }}
                            onClick={() => updateSettings('dates', { start: new Date(dates.start).toISOString(), end: new Date(dates.end).toISOString() })}
                        >
                            Save dates
                        </Button>
                    </Flex>
                    <Flex gap="2" direction="column" css={{ mt: '$2' }}>
                        <Flex direction="column" gap="2">
                            <Flex align="center">
                                <Checkbox checked={settings['settings.allowVoting']} onCheckedChange={(checked) => updateSettings('settings.allowVoting', checked)} id="settings-allow-voting">
                                    <CheckboxIndicator>
                                        <CheckIcon width={24} height={24} />
                                    </CheckboxIndicator>
                                </Checkbox>
                                <Label css={{ ml: 10 }} htmlFor="settings-allow-voting">
                                    Allow voting
                                </Label>
                            </Flex>
                            <Flex align="center" css={{ ml: '$6' }}>
                                <Checkbox
                                    checked={settings['settings.restrictVotingToHosts']}
                                    onCheckedChange={(checked) => updateSettings('settings.restrictVotingToHosts', checked)}
                                    id="settings-restrict-voting"
                                    disabled={!settings['settings.allowVoting']}
                                >
                                    <CheckboxIndicator>
                                        <CheckIcon width={24} height={24} />
                                    </CheckboxIndicator>
                                </Checkbox>
                                <Label css={{ ml: 10 }} htmlFor="settings-restrict-voting">
                                    Restrict voting to hosts and co-hosts
                                </Label>
                            </Flex>
                        </Flex>

                        <Flex align="center">
                            <Checkbox checked={settings['settings.enableMystery']} onCheckedChange={(checked) => updateSettings('settings.enableMystery', checked)} id="settings-hide-body">
                                <CheckboxIndicator>
                                    <CheckIcon width={24} height={24} />
                                </CheckboxIndicator>
                            </Checkbox>
                            <Label css={{ ml: 10 }} htmlFor="settings-hide-body">
                                Hide the main description of the game jam before it starts
                            </Label>
                        </Flex>
                        <Flex align="center">
                            <Checkbox checked={settings['settings.allowTeams']} onCheckedChange={(checked) => updateSettings('settings.allowTeams', checked)} id="settings-allow-teams" disabled={true}>
                                <CheckboxIndicator>
                                    <CheckIcon width={24} height={24} />
                                </CheckboxIndicator>
                            </Checkbox>
                            <Label css={{ ml: 10 }} htmlFor="settings-allow-teams">
                                Allow team submissions
                            </Label>
                        </Flex>
                        {(isAdmin || isOrganizer) && (
                            <>
                                <Text variant="subtle" css={{ mt: '$4' }}>
                                    {isAdmin ? 'Administrator actions' : 'Danger zone'}
                                </Text>
                                {isAdmin && (
                                    <Flex align="center">
                                        <Checkbox checked={settings['meta.featured']} onCheckedChange={(checked) => updateSettings('meta.featured', checked)} id="meta-featured">
                                            <CheckboxIndicator>
                                                <CheckIcon width={24} height={24} />
                                            </CheckboxIndicator>
                                        </Checkbox>
                                        <Label css={{ ml: 10 }} htmlFor="settings-allow-teams">
                                            Feature this game jam
                                        </Label>
                                    </Flex>
                                )}
                                <Flex gap="2" wrap="wrap">
                                    {!jam.meta.archived && (
                                        <Button variant="danger" block={{ '@initial': true, '@bp1': false }} onClick={() => setDialogs({ ...dialogs, archiveJamOpen: true })}>
                                            Archive this game jam
                                        </Button>
                                    )}
                                    {isAdmin && (
                                        <Button variant="danger" block={{ '@initial': true, '@bp1': false }} onClick={() => setDialogs({ ...dialogs, deleteJamOpen: true })}>
                                            <Box>
                                                Delete this game jam{' '}
                                                <Box as="span" css={{ fontWeight: '$extrabold' }}>
                                                    permanently
                                                </Box>
                                            </Box>
                                        </Button>
                                    )}
                                </Flex>
                            </>
                        )}
                    </Flex>
                </JamCard>
            </Box>
        </>
    );
}

function NewSubmission({ onBackToSubmissions, jamId, mutate }) {
    const [projectId, setProjectId] = useState();
    const [projectUrl, setProjectUrl] = useState('');
    const [isProjectIdValid, setIsProjectIdValid] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [toast] = useToast();
    const router = useRouter();

    useEffect(() => {
        const projectRegex = /https:\/\/scratch\.mit\.edu\/projects\/([0-9]+)/i;
        if (!projectUrl || !projectRegex.test(projectUrl)) return setIsProjectIdValid(false);
        setIsProjectIdValid(true);
        setProjectId(projectUrl.match(projectRegex)[1]);
    }, [setIsProjectIdValid, setProjectId, projectUrl]);

    async function submitProject() {
        setSubmitting(true);

        let res = await fetch(`/api/scratch-jams/${jamId}/submissions`, {
            method: 'POST',
            body: JSON.stringify({ projectId: projectId }),
        });
        res = await res.json();

        if (res.error) {
            toast({
                customContent: <ToastError>{res.error?.message}</ToastError>,
                variant: 'danger',
                duration: 10000,
            });
        } else if (res.success) {
            toast({
                customContent: <ToastSuccess>Congratulations on participating; your submission was saved!</ToastSuccess>,
                variant: 'success',
                duration: 10000,
            });
            router.push(`/scratch-jams/${jamId}/submissions`);
        }

        setSubmitting(false);
        mutate();
    }

    return (
        <Flex gap="2" direction="column">
            <Flex direction={{ '@initial': 'column', '@bp1': 'row' }} justify="between" align="center">
                <Button variant="neutral" size="small" onClick={onBackToSubmissions}>
                    <Box css={{ mr: '$1' }}>
                        <ArrowLeftIcon width={20} height={20} />
                    </Box>{' '}
                    Back to submissions
                </Button>
                <Button
                    as={isProjectIdValid && 'a'}
                    href={isProjectIdValid && `https://scratch.mit.edu/projects/${projectId}`}
                    target={isProjectIdValid && '_blank'}
                    variant="accent"
                    size="small"
                    disabled={!isProjectIdValid}
                >
                    View project on Scratch
                    <Box css={{ ml: '$1' }}>
                        <ExternalLinkIcon width={20} height={20} />
                    </Box>
                </Button>
            </Flex>
            <ScratchEmbed projectId={projectId || null} />
            <Flex direction="column" gap="1">
                <Label htmlFor="project-url" bold>
                    Project URL:
                </Label>
                <Flex gap="2" wrap="wrap">
                    <Input
                        value={projectUrl}
                        onChange={(e) => setProjectUrl(e.target.value)}
                        placeholder="e.g.: https://scratch.mit.edu/projects/104"
                        id="project-url"
                        css={{ flexGrow: 1 }}
                        disabled={submitting}
                    />
                    <Button variant="accent" disabled={!isProjectIdValid || submitting} block={{ '@initial': true, '@bp1': false }} onClick={submitProject}>
                        Submit project
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}

function JamSubmissions({ onBackToSubmissions, onLoadingChange, jam, isOrganizer, numberOfSubmissions, remainingUpvotes, usersProject, user, mutate }) {
    const [toast] = useToast();
    const router = useRouter();

    const [projectId, setProjectId] = useState(null);

    const [sortBy, setSortBy] = useState('newest');
    const LIMIT = 6;

    const {
        data,
        error,
        mutate: mutateSubmissions,
        size,
        setSize,
        isValidating,
    } = useSWRInfinite((index) => `/api/scratch-jams/${jam?._id}/submissions?offset=${index * LIMIT}&limit=${LIMIT}&sort=${sortBy}`, fetcher, {
        initialSize: 2,
    });

    const submissions = data ? [].concat(...data) : [];
    const numberOfListedSubmissions = submissions.length;
    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < LIMIT);
    const isRefreshing = isValidating && data && data.length === size;

    const { data: projectData, error: projectError } = useSWR(projectId ? `/api/scratch-jams/${jam?._id}/submissions/${projectId}` : null, fetcher);

    useEffect(() => {
        if (!router.isReady) return onLoadingChange(true);

        setProjectId(router.query?.project ? parseInt(router.query.project) : null);
        onLoadingChange(false);
    }, [router.isReady, router, onLoadingChange]);

    const showUpvoteManager = jam.settings.allowVoting && (jam.settings.restrictVotingToHosts === false || isOrganizer === false || isOrganizer === true);
    const viewingOwnSubmission = usersProject === projectId;
    const showRemoveSubmissionButton = viewingOwnSubmission || user?.admin || isOrganizer === false || isOrganizer === true;

    const [removeProjectDialog, setRemoveProjectDialog] = useState({ open: false, loading: false });

    async function removeSubmission() {
        setRemoveProjectDialog({ ...removeProjectDialog, loading: true });

        let res = await fetch(`/api/scratch-jams/${jam._id}/submissions/${projectId}`, {
            method: 'DELETE',
        });
        res = await res.json();

        if (res.error) {
            toast({
                customContent: <ToastError />,
                variant: 'danger',
                duration: 10000,
            });
        } else if (res.success) {
            toast({
                customContent: <ToastSuccess>The submission {projectData.title} has been removed from this game jam</ToastSuccess>,
                variant: 'success',
                duration: 10000,
            });
        }

        setRemoveProjectDialog({ ...removeProjectDialog, loading: false, open: false });
        router.push(`/scratch-jams/${jam?._id}/submissions`, undefined, { scroll: false });
        mutateSubmissions();
        mutate();
    }

    return projectId ? (
        <>
            <AlertDialog open={removeProjectDialog.open} onOpenChange={(open) => setRemoveProjectDialog({ ...removeProjectDialog, open: open })}>
                <AlertDialogContent>
                    <AlertDialogTitle>
                        {viewingOwnSubmission ? 'Are you sure you want to remove your submission from this game jam?' : `You are about to remove the submission ${projectData?.title}`}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <>
                            <b>{viewingOwnSubmission ? 'The votes and feedback on your submission are not recoverable!' : 'This action cannot be undone!'}</b>
                            <Flex justify="center" css={{ my: '$2' }}>
                                <Separator size="2" />
                            </Flex>
                            All of the votes and feedback left by hosts associated with the submission {projectData?.title} will be permanently deleted.
                        </>
                    </AlertDialogDescription>
                    <Flex gap="2" wrap="wrap">
                        <AlertDialogCancel asChild>
                            <Button disabled={removeProjectDialog.loading} block>
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                disabled={removeProjectDialog.loading}
                                block
                                variant="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeSubmission();
                                }}
                            >
                                {viewingOwnSubmission ? 'Remove my submission' : 'Remove this submission'}
                            </Button>
                        </AlertDialogAction>
                    </Flex>
                </AlertDialogContent>
            </AlertDialog>
            <Flex gap="2" direction="column">
                <Flex direction={{ '@initial': 'column', '@bp1': 'row' }} justify="between" align="center">
                    <Button variant="neutral" size="small" onClick={onBackToSubmissions}>
                        <Box css={{ mr: '$1' }}>
                            <ArrowLeftIcon width={20} height={20} />
                        </Box>{' '}
                        Back to submissions
                    </Button>
                    {!projectError && (
                        <Button as="a" href={`https://scratch.mit.edu/projects/${projectId}`} target="_blank" variant="accent" size="small">
                            View project on Scratch
                            <Box css={{ ml: '$1' }}>
                                <ExternalLinkIcon width={20} height={20} />
                            </Box>
                        </Button>
                    )}
                </Flex>
                {!projectError ? (
                    <>
                        <ScratchEmbed projectId={projectId} />
                        {(showUpvoteManager || showRemoveSubmissionButton) && (
                            <Flex justify={showUpvoteManager ? 'between' : 'end'} gap="2" wrap="wrap">
                                {showUpvoteManager && (
                                    <UpvoteManager jamId={jam?._id} projectId={projectId} remainingUpvotes={remainingUpvotes} user={user} block={{ '@initial': true, '@bp1': false }} />
                                )}
                                {showRemoveSubmissionButton && (
                                    <Button variant="danger" block={{ '@initial': true, '@bp1': false }} onClick={() => setRemoveProjectDialog({ ...removeProjectDialog, open: true })}>
                                        Remove
                                    </Button>
                                )}
                            </Flex>
                        )}
                    </>
                ) : (
                    <Card variant="danger">
                        <Flex direction="column" gap="2" align="center" justify="center" css={{ height: '100%', p: '$4' }}>
                            <Text variant="inherit" bold size="5" align="center">
                                This submission could not be loaded
                            </Text>
                            <Text variant="inherit">
                                Project: <Badge variant="danger">{projectId}</Badge>
                            </Text>
                        </Flex>
                    </Card>
                )}
            </Flex>
        </>
    ) : (
        <>
            {!isEmpty ? (
                <>
                    <Flex css={{ mb: '$4' }} justify="between" align="center">
                        <Text variant="subtle">
                            Showing {numberOfListedSubmissions || '...'} submission{numberOfListedSubmissions !== 1 && 's'} out of {numberOfSubmissions || '...'}
                        </Text>
                        <Flex gap="2" align="center">
                            <Text bold>Sort by</Text>
                            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                                <SelectItem value="newest">date submitted (newest)</SelectItem>
                                <SelectItem value="oldest">date submitted (oldest)</SelectItem>
                                {jam.settings.allowVoting && <SelectItem value="upvotes">most upvotes</SelectItem>}
                            </Select>
                        </Flex>
                    </Flex>
                    <Grid gap="4" columns={{ '@initial': 1, '@bp1': 2, '@bp2': 3 }} css={{ maskImage: isLoadingInitialData && 'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 30%, transparent 90%)' }}>
                        {!isLoadingInitialData
                            ? submissions.map((project, index) => <Submission jam={jam} project={project} key={index} isOrganizer={isOrganizer} remainingUpvotes={remainingUpvotes} user={user} />)
                            : [...Array(6)].map((value, index) => (
                                  <Box key={index}>
                                      <Skeleton aspectRatio="1 / 1" />
                                  </Box>
                              ))}
                    </Grid>
                    {!isReachingEnd && (
                        <Button variant="accent" block disabled={isLoadingMore} onClick={() => setSize(size + 1)} css={{ mt: '$2' }}>
                            Load more
                        </Button>
                    )}
                </>
            ) : (
                <Text align="center" bold>
                    No submissions yet. Be the first to participate!
                </Text>
            )}
        </>
    );
}

const StyledTutorialPopoverContent = styled(PopoverContent, {
    backgroundColor: '$success9',
    color: '$loContrast',
    fontSize: '$4',
    padding: '$2',
    boxShadow: 'none !important',
    borderRadius: '$4',
    lineHeight: 1,
});

const StyledTutorialPopoverArrow = styled(PopoverArrow, {
    fill: '$success9 !important',
});

function TutorialPopoverContent({ children, ...props }) {
    return (
        <StyledTutorialPopoverContent {...props}>
            <StyledTutorialPopoverArrow width={20} height={10} offset={20} />
            {children}
        </StyledTutorialPopoverContent>
    );
}

const StyledTutorialPopoverButton = styled(Button, {
    backgroundColor: '$loContrast !important',
    color: '$success9 !important',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '$card4 !important',
    },
    '&:focus': {
        boxShadow: '0 0 0 1px $colors$success7, inset 0 0 0 1px $colors$success7 !important',
    },
});

function TutorialPopoverButton({ children, ...props }) {
    return (
        <StyledTutorialPopoverButton {...props} size="modular">
            {children}
        </StyledTutorialPopoverButton>
    );
}

function RouteButton({ routes, routeComponentIndex, route, jamId, onClick }) {
    return (
        <NextLink href={`/scratch-jams/${jamId}${route.slug ? '/' + route.slug : ''}`} passHref scroll={false}>
            <Button
                as="a"
                variant={
                    route?.slug === routes[routeComponentIndex]?.slug || (routes[routeComponentIndex]?.subRoute === true && routes[routeComponentIndex].subRouteTo === route.slug)
                        ? 'accent'
                        : 'neutral'
                }
                size="modular"
                onClick={onClick}
            >
                {route?.icon && <Box css={{ mr: '$2' }}>{route.icon}</Box>}
                {route.label}
            </Button>
        </NextLink>
    );
}

function StatisticsFigure({ figure }) {
    return (
        <Box as="span" css={{ fontWeight: '$bold' }}>
            {figure === undefined ? '...' : figure}
        </Box>
    );
}

function ScratchJam({ fallback }) {
    const router = useRouter();
    const { user } = useUser();

    const [jamId, setJamId] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [routeComponentIndex, setRouteComponentIndex] = useState();
    const [editingContent, setEditingContent] = useState(false);

    const { data, isLoading: loadingJam, mutate: mutateJam, isValidating: isJamValidating } = useJams(jamId, null, isInitialized, JSON.parse(fallback));
    const { hosts, mutateHosts, isOrganizer, loading: loadingHosts } = useJamHosts(data?._id);

    const [_jamContent, _setJamContent] = useState({ title: null, description: null });
    const [_jamBody, _setJamBody] = useState(null);
    const [updatingJam, setUpdatingJam] = useState(false);

    const [jamStatus, setJamStatus] = useState(null);
    const [countdownDate, setCountdownDate] = useState(null);

    const [newJamTutorialStage, setNewJamTutorialStage] = useState(0);

    const [loadingSubmissions, setLoadingSubmissions] = useState(true);

    const { data: jamStatistics, mutate: mutateStatistics } = useSWR(`/api/scratch-jams/${jamId}/statistics`, fetcher);

    const [toast] = useToast();

    async function addHost(username) {
        return new Promise(async (resolve, reject) => {
            let res = await fetch(`/api/scratch-jams/${data._id}/hosts`, { method: 'POST', body: JSON.stringify({ username: username }) });
            res = await res.json();
            if (res.error) {
                toast({
                    customContent: <ToastError>{res.error?.message}</ToastError>,
                    variant: 'danger',
                    duration: 10000,
                });
            } else if (res.success) {
                toast({
                    customContent: <ToastSuccess>{username} is now a co-host of this game jam</ToastSuccess>,
                    variant: 'success',
                    duration: 10000,
                });
            }
            mutateHosts();
            resolve();
        });
    }

    async function transferHost(username) {
        return new Promise(async (resolve, reject) => {
            let res = await fetch(`/api/scratch-jams/${data._id}/hosts/transfer`, { method: 'PUT', body: JSON.stringify({ username: username }) });
            res = await res.json();
            if (res.success) {
                toast({
                    customContent: <ToastSuccess>{username} is now the new host of this game jam</ToastSuccess>,
                    variant: 'success',
                    duration: 10000,
                });
            } else {
                toast({
                    customContent: <ToastError />,
                    variant: 'danger',
                    duration: 10000,
                });
            }
            mutateHosts();
            resolve();
        });
    }

    async function removeHost(username) {
        return new Promise(async (resolve, reject) => {
            let res = await fetch(`/api/scratch-jams/${data._id}/hosts`, { method: 'DELETE', body: JSON.stringify({ username: username }) });
            res = await res.json();
            if (res.success) {
                toast({
                    customContent: <ToastSuccess>{username} is no longer a co-host of this game jam</ToastSuccess>,
                    variant: 'success',
                    duration: 10000,
                });
            } else {
                toast({
                    customContent: <ToastError />,
                    variant: 'danger',
                    duration: 10000,
                });
            }
            mutateHosts();
            resolve();
        });
    }

    const onBackToSubmissions = () => router.push(`/scratch-jams/${jamId}/submissions`, undefined, { scroll: false });

    const routes = [
        {
            slug: '',
            icon: <InfoCircledIcon width={24} height={24} />,
            label: 'About',
            component: (
                <>
                    {jamStatus === -1 && data.settings.enableMystery === true && (
                        <JamCard css={{ backgroundColor: '$success2', color: '$success11', borderColor: '$success6', mb: '$4' }}>
                            <Heading css={{ color: 'inherit' }}>Mystery mode is enabled</Heading>
                            <Text css={{ color: 'inherit' }}>
                                {isOrganizer !== null || user?.admin ? (
                                    <>
                                        Only hosts (and administrators) can see this description until the jam starts.{' '}
                                        {(isOrganizer === true || user?.admin) && (
                                            <>
                                                You can change this in{' '}
                                                <NextLink href={`/scratch-jams/${jamId}/settings`} passHref scroll={false}>
                                                    <Link variant="success">Settings</Link>
                                                </NextLink>
                                                .
                                            </>
                                        )}
                                    </>
                                ) : (
                                    'This jam is scheduled to start in the future. Therefore, the main description - including the theme of the game jam - is hidden to guarantee a fair start for everyone.'
                                )}
                            </Text>
                        </JamCard>
                    )}
                    {(jamStatus !== -1 || isOrganizer !== null || user?.admin || data.settings.enableMystery !== true) && (
                        <TextEditor editable={editingContent} content={data?.content?.body} onContentChange={_setJamBody} />
                    )}
                </>
            ),
            loading: loadingJam || !user || loadingHosts,
        },
        {
            slug: 'hosts',
            icon: <PersonIcon width={24} height={24} />,
            label: 'Hosts',
            component: <JamHosts hosts={hosts} isOrganizer={isOrganizer} isAdmin={user?.admin} user={user} addHost={addHost} transferHost={transferHost} removeHost={removeHost} />,
            loading: loadingHosts,
        },
        {
            slug: 'submissions',
            icon: <ImageIcon width={24} height={24} />,
            label: 'Submissions',
            component: (
                <JamSubmissions
                    onBackToSubmissions={onBackToSubmissions}
                    onLoadingChange={setLoadingSubmissions}
                    jam={data}
                    isOrganizer={isOrganizer}
                    numberOfSubmissions={jamStatistics?.submissions}
                    remainingUpvotes={jamStatistics?.remainingUpvotes}
                    user={user}
                    usersProject={jamStatistics?.participation?.project}
                    mutate={() => {
                        mutateStatistics();
                        mutateJam();
                    }}
                />
            ),
            loading: /* loadingSubmissions */ false,
        },
        {
            slug: 'submissions/new',
            subRoute: true,
            subRouteTo: 'submissions',
            component: <NewSubmission onBackToSubmissions={onBackToSubmissions} jamId={data?._id} mutate={mutateStatistics} />,
        },
        {
            slug: 'settings',
            icon: <GearIcon width={24} height={24} />,
            label: 'Settings',
            component: <JamSettings isAdmin={user?.admin} isOrganizer={isOrganizer} jam={data} mutateJam={mutateJam} />,
            loading: loadingJam,
        },
    ];

    const findComponentMatchingRoute = (currentRoute) => {
        return routes.findIndex((route) => {
            return route.slug === currentRoute;
        });
    };

    useEffect(() => {
        if (router.isReady === true) {
            if (router.query?.newJamTutorial === 'true') setNewJamTutorialStage(1);

            let currentRoute = [...router.query.jam];
            currentRoute.shift();
            currentRoute = currentRoute.join('/');
            setRouteComponentIndex(findComponentMatchingRoute(currentRoute));

            if (isInitialized === true) return;

            setJamId(router.query.jam[0]);
            setIsInitialized(true);
        }
    }, [router.isReady, router, findComponentMatchingRoute, isInitialized]);

    async function updateJam() {
        return new Promise(async (resolve, reject) => {
            let res = await fetch(`/api/scratch-jams/${data._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: _jamContent.title,
                    'content.description': _jamContent.description,
                    'content.body': !isObject(_jamBody) ? JSON.parse(_jamBody) : _jamBody,
                }),
            });
            res = await res.json();
            if (res.error) {
                toast({
                    customContent: <ToastError>{res.error?.message}</ToastError>,
                    variant: 'danger',
                    duration: 10000,
                });
                resolve(false);
            } else if (res.success) {
                toast({
                    customContent: <ToastSuccess />,
                    variant: 'success',
                    duration: 10000,
                });
                resolve(true);
            }
        });
    }

    const toggleEditBody = async () => {
        if (newJamTutorialStage === 1) setNewJamTutorialStage(2);

        if (!editingContent) {
            _setJamContent({ title: data.name, description: data.content?.description });
            _setJamBody(data.content.body);
            setEditingContent((editingContent) => !editingContent);
        } else {
            setUpdatingJam(true);
            const successfulUpdate = await updateJam();
            successfulUpdate && setEditingContent((editingContent) => !editingContent);
            setUpdatingJam(false);
            mutateJam();
        }
    };

    useEffect(() => {
        if (loadingJam || isJamValidating) return;
        setJamStatus(getJamStatus(data?.dates?.start, data?.dates?.end));
    }, [data, loadingJam, isJamValidating]);

    useEffect(() => {
        setCountdownDate(jamStatus === -1 ? new Date(data.dates.start).getTime() : jamStatus === 0 ? new Date(data.dates.end).getTime() : undefined);
    }, [data, jamStatus]);

    const [restoringJam, setRestoringJam] = useState(false);

    async function restoreJam() {
        setRestoringJam(true);

        let res = await fetch(`/api/scratch-jams/${data._id}/archive`, {
            method: 'PUT',
            body: JSON.stringify({ archived: false }),
        });
        res = await res.json();

        if (res.error) {
            toast({
                customContent: <ToastError />,
                variant: 'danger',
                duration: 10000,
            });
        } else if (res.success) {
            toast({
                customContent: <ToastSuccess>The game jam {data.name} has been restored</ToastSuccess>,
                variant: 'success',
                duration: 10000,
            });
        }

        setRestoringJam(false);
        mutateJam();
    }

    return (
        <Layout
            withSecondaryHeader
            secondaryHeader={{
                title: <NextLink href="/scratch-jams">Scratch Game Jams</NextLink>,
                subtitle: data?.name || <Skeleton width="10rem" />,
                controls: (
                    <Flex align="center" gap={!editingContent && 2} wrap="wrap" justify="center">
                        <AboutScratchJams />
                        {(isOrganizer || user?.admin) && (
                            <Popover open={newJamTutorialStage === 1}>
                                <PopoverTrigger asChild>
                                    <Button
                                        size="small"
                                        variant="accent"
                                        css={{ ml: editingContent && '$2', btrr: editingContent && 0, bbrr: editingContent && 0 }}
                                        onClick={toggleEditBody}
                                        disabled={updatingJam || !data}
                                    >
                                        {editingContent ? (
                                            <>
                                                <Box>
                                                    <CheckIcon width={20} height={20} />
                                                </Box>
                                                Save
                                            </>
                                        ) : (
                                            <>
                                                <Box css={{ mr: '$1' }}>
                                                    <Pencil1Icon width={20} height={20} />
                                                </Box>
                                                Edit
                                            </>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <TutorialPopoverContent>
                                    <Flex gap="2" direction="column">
                                        <b>Congratulations on creating your game jam!</b> You can edit its title, summary and description here.
                                        <TutorialPopoverButton onClick={() => setNewJamTutorialStage(2)}>Okay</TutorialPopoverButton>
                                    </Flex>
                                </TutorialPopoverContent>
                            </Popover>
                        )}
                        {editingContent && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button size="small" css={{ btlr: 0, bblr: 0 }}>
                                        <ChevronDownIcon width={24} height={24} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent sideOffset={5} css={{ width: '13rem' }}>
                                    <PopoverArrow width={20} height={10} />
                                    <PopoverClose>
                                        <Cross2Icon width={20} height={20} />
                                    </PopoverClose>
                                    <Flex align="center" justify="center">
                                        <Button size="small" disabled={updatingJam} onClick={() => setEditingContent(false)}>
                                            <TrashIcon width={20} height={20} />
                                            Discard changes
                                        </Button>
                                    </Flex>
                                </PopoverContent>
                            </Popover>
                        )}
                    </Flex>
                ),
            }}
        >
            <TitleAndMetaTags title="Scratch Game Jam | Incubator — Scratch Experiments" />
            <Container size="3" css={{ my: '$8' }}>
                {data.meta.archived && user?.admin && (
                    <JamCard css={{ backgroundColor: '$danger2', color: '$danger11', borderColor: '$danger6', mb: '$4' }}>
                        <Flex gap="2" align="center" justify="between">
                            <Heading size="1" css={{ color: 'inherit' }}>
                                This game jam has been archived
                            </Heading>
                            <Button variant="danger" onClick={restoreJam} disabled={restoringJam}>
                                Restore
                            </Button>
                        </Flex>
                    </JamCard>
                )}
                <Flex direction={{ '@initial': 'column', '@bp1': 'row' }}>
                    <Box css={{ flexGrow: 1 }}>
                        <Thumbnail
                            image={data.content?.headerImage}
                            loading={loadingJam}
                            location="jam"
                            jam={data}
                            canChangeThumbnail={isOrganizer || user?.admin}
                            mutateThumbnailCallback={mutateJam}
                        />
                    </Box>
                    <JamCard css={{ mt: '$4', '@bp1': { width: '40%', ml: '$4', mt: 0 } }}>
                        <Flex direction="column" gap="2" css={{ height: '100%' }}>
                            {editingContent ? (
                                <>
                                    <Input
                                        value={_jamContent.title}
                                        onChange={(e) => _setJamContent({ ..._jamContent, title: e.target.value })}
                                        placeholder="Title"
                                        css={{ fontSize: '$7', fontWeight: '$semibold' }}
                                    />
                                    <Input
                                        value={_jamContent.description}
                                        onChange={(e) => _setJamContent({ ..._jamContent, description: e.target.value })}
                                        as="textarea"
                                        placeholder="Description"
                                        css={{ resize: 'none', height: '100%', fontSize: '$5', color: '$neutral11' }}
                                    />
                                </>
                            ) : (
                                <>
                                    <Heading size="3">
                                        {
                                            data?.name /*  || (
                                            <>
                                                <Skeleton width="17rem" />
                                                <Skeleton width="10rem" />
                                            </>
                                        ) */
                                        }
                                    </Heading>
                                    <Paragraph size="2" css={{ height: '100%', mb: '$1' }}>
                                        {
                                            data?.content?.description /*  || (
                                            <>
                                                <Skeleton height="100%" />
                                            </>
                                        ) */
                                        }
                                    </Paragraph>
                                </>
                            )}
                        </Flex>
                    </JamCard>
                </Flex>
                <Flex direction={{ '@initial': 'column', '@bp2': 'row' }} css={{ mt: '$4' }}>
                    <Box css={{ '@bp2': { width: '25%' }, maskImage: (!data || jamStatus === null) && 'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 30%, transparent 90%)' }}>
                        {jamStatus !== null ? (
                            <>
                                {[-1, 0].includes(jamStatus) && (
                                    <JamCard css={{ bblr: 0, bbrr: 0, borderBottom: 'none', backgroundColor: '$accent2', color: '$accent11', borderColor: '$accent6' }}>
                                        <Flex align="center" justify="center" direction="column">
                                            <Heading size="2" css={{ color: 'inherit' }}>
                                                {jamStatus === -1 ? 'Starting in' : jamStatus === 0 && 'Ending in'}
                                            </Heading>
                                            <Countdown targetDate={countdownDate} onExpiry={() => mutateJam()} variant="accent" />
                                        </Flex>
                                    </JamCard>
                                )}
                                <JamCard css={[-1, 0].includes(jamStatus) && { btlr: 0, btrr: 0, borderTop: 'none' }}>
                                    <Heading>{jamStatus === -1 ? 'This game jam has not started yet' : jamStatus === 1 && 'This game jam has ended'}</Heading>
                                    {jamStatus === 0 && (
                                        <>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="success" size="modular" block css={{ mb: '$2' }} disabled={user?.isLoggedIn === false}>
                                                        <Box css={{ mr: '$2' }}>
                                                            <PlusCircledIcon width={24} height={24} />
                                                        </Box>
                                                        Participate
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side="bottom" variant="success" css={{ width: '15rem' }}>
                                                    {jamStatistics?.participation?.hasParticipated !== true && (
                                                        <>
                                                            <DropdownMenuItem
                                                                css={{ pl: '$1', height: 'unset' }}
                                                                onClick={() => router.push(`/scratch-jams/${jamId}/submissions/new`, undefined, { scroll: false })}
                                                            >
                                                                <Flex direction="column">
                                                                    <Text bold css={{ color: 'inherit', mb: '$1' }} size="5">
                                                                        Submit a project
                                                                    </Text>
                                                                    <Paragraph css={{ color: 'inherit', lineHeight: '1.2 !important' }} size="1">
                                                                        Enter your Scratch creation into the game jam as an individual
                                                                    </Paragraph>
                                                                </Flex>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                        </>
                                                    )}
                                                    <DropdownMenuItem css={{ pl: '$1', height: 'unset' }} disabled>
                                                        <Flex direction="column">
                                                            <Text bold css={{ color: 'inherit', mb: '$1' }} size="5">
                                                                Watch this game jam
                                                            </Text>
                                                            <Paragraph css={{ color: 'inherit', lineHeight: '1.2 !important' }} size="1">
                                                                Get notified of new entries and signal your interest of participating to the hosts
                                                            </Paragraph>
                                                        </Flex>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem css={{ pl: '$1', height: 'unset' }} disabled>
                                                        <Flex direction="column">
                                                            <Text bold css={{ color: 'inherit', mb: '$1' }} size="5">
                                                                Work in a team
                                                            </Text>
                                                            <Paragraph css={{ color: 'inherit', lineHeight: '1.2 !important' }} size="1">
                                                                Form a team and work on your submission together
                                                            </Paragraph>
                                                        </Flex>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuArrow width={20} height={10} />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            {user?.isLoggedIn === false && (
                                                <Text align="center" css={{ mb: '$2' }}>
                                                    You must sign in to participate in game jams
                                                </Text>
                                            )}
                                            {jamStatistics?.participation?.hasParticipated === true && (
                                                <Button
                                                    size="modular"
                                                    block
                                                    css={{ mb: '$2' }}
                                                    onClick={() => router.push(`/scratch-jams/${jamId}/submissions?project=${jamStatistics.participation.project}`, undefined, { scroll: false })}
                                                >
                                                    Jump to my submission
                                                </Button>
                                            )}
                                        </>
                                    )}
                                    {jamStatus === -1 && <Paragraph>Check back later to avoid missing the start!</Paragraph>}
                                    {jamStatus !== -1 && (
                                        <Paragraph css={{ lineHeight: '1.2 !important' }}>
                                            Statistics: There are <StatisticsFigure figure={jamStatistics?.submissions} /> submitted projects, <StatisticsFigure figure={jamStatistics?.upvotes} />{' '}
                                            upvotes have been cast, and <StatisticsFigure figure={jamStatistics?.feedback} /> appreciations have been written by the hosts.
                                        </Paragraph>
                                    )}
                                </JamCard>
                            </>
                        ) : (
                            <Skeleton height="20rem" />
                        )}
                        <Button size="small" variant="neutral" css={{ mt: '$2' }}>
                            <Box css={{ mr: '$2', transform: 'translateY(2px)' }}>
                                <ExclamationTriangleIcon width={20} height={20} />
                            </Box>
                            Report
                        </Button>
                    </Box>
                    <Box
                        css={{
                            mt: '$4',
                            maskImage:
                                (!routes[routeComponentIndex]?.component || routes[routeComponentIndex]?.loading === true) && 'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 30%, transparent 90%)',
                            '@bp2': { width: '75%', ml: '$4', mt: 0 },
                        }}
                    >
                        <Flex gap="2" wrap="wrap" justify={{ '@initial': 'center', '@bp1': 'start' }} css={{ mb: '$2', p: '1px' }}>
                            {routes.map((route, index) => (
                                <Fragment key={index}>
                                    {(index !== 4 || isOrganizer || user?.admin) && route?.subRoute !== true && (
                                        <>
                                            {index === 1 || index === 4 ? (
                                                <Popover open={(index === 1 && newJamTutorialStage === 2) || (index === 4 && newJamTutorialStage === 3)}>
                                                    <PopoverTrigger asChild>
                                                        <Box>
                                                            <RouteButton
                                                                routes={routes}
                                                                routeComponentIndex={routeComponentIndex}
                                                                route={route}
                                                                jamId={jamId}
                                                                onClick={() => {
                                                                    if (index === 1 && newJamTutorialStage === 2) setNewJamTutorialStage(3);
                                                                    if (index === 4 && newJamTutorialStage === 3) setNewJamTutorialStage(0);
                                                                }}
                                                            />
                                                        </Box>
                                                    </PopoverTrigger>
                                                    <TutorialPopoverContent side="top" sideOffset="-5">
                                                        <Flex gap="2" direction="column">
                                                            {index === 1 ? (
                                                                <>
                                                                    <b>Invite others to manage your game jam!</b> Here, you can add co-hosts. Co-hosts will be able to view the main description even if
                                                                    mystery mode is enabled, leave direct feedback on submissions, and they will always have the ability to vote when voting is turned
                                                                    on.
                                                                    <TutorialPopoverButton onClick={() => setNewJamTutorialStage(3)}>Got it!</TutorialPopoverButton>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <b>Finish setting up your game jam!</b> You can tweak settings here to customize your game jam. You can change its starting and
                                                                    ending dates as well.
                                                                    <Flex gap="1">
                                                                        <TutorialPopoverButton
                                                                            onClick={() => {
                                                                                router.push(`/scratch-jams/${jamId}/settings`);
                                                                                setNewJamTutorialStage(0);
                                                                            }}
                                                                        >
                                                                            Review settings
                                                                        </TutorialPopoverButton>
                                                                        <TutorialPopoverButton onClick={() => setNewJamTutorialStage(0)}>Dismiss</TutorialPopoverButton>
                                                                    </Flex>
                                                                </>
                                                            )}
                                                        </Flex>
                                                    </TutorialPopoverContent>
                                                </Popover>
                                            ) : (
                                                <RouteButton routes={routes} routeComponentIndex={routeComponentIndex} route={route} jamId={jamId} />
                                            )}
                                        </>
                                    )}
                                </Fragment>
                            ))}
                        </Flex>
                        {routes[routeComponentIndex]?.component && routes[routeComponentIndex]?.loading !== true ? routes[routeComponentIndex].component : <Skeleton height="30rem" display="block" />}
                    </Box>
                </Flex>
            </Container>
        </Layout>
    );
}

function ArchivedScratchJam() {
    return (
        <Layout>
            <TitleAndMetaTags title="Scratch Game Jam | Incubator — Scratch Experiments" />
            <Container size="3" css={{ my: '$8' }}>
                <Flex direction="column" gap="2">
                    <Heading size="2">This game jam has been archived</Heading>
                    <Text>Contact an administrator on Scratch (e.g., @Looky1173) to recover it.</Text>
                    <NextLink href="/scratch-jams" passHref>
                        <Button as="a" variant="accent" css={{ mt: '$4' }}>
                            Browse other game jams
                        </Button>
                    </NextLink>
                </Flex>
            </Container>
        </Layout>
    );
}

export default function Page({ fallback, archived = false }) {
    return <>{archived === false ? <ScratchJam fallback={fallback} /> : <ArchivedScratchJam />}</>;
}

import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '@constants';
import clientPromise from '@database';

import { getScratchGameJam, isScratchJamOrganizer } from '@database/scratch-jams';
import { getUserData } from '@database/users';

export const getServerSideProps = withIronSessionSsr(async function getServerSideProps({ req, params }) {
    const client = await clientPromise;
    const Database = client.db();

    const jamId = params.jam[0];
    const jam = await getScratchGameJam(Database, jamId, req.session?.user?.name);
    const isAdmin = (await getUserData(Database, req.session?.user?.name))?.admin;

    if (params.jam?.[1] === 'settings') {
        if (!req.session.user) return { redirect: { destination: `/scratch-jams/${jamId}` } };
        const isOrganizer = await isScratchJamOrganizer(Database, jamId, req.session.user.name);
        if (isOrganizer !== true && isAdmin !== true) return { redirect: { destination: `/scratch-jams/${jamId}` } };
    }

    if (params.jam?.[1] === 'submissions' && params.jam?.[2] === 'new') {
        if (new Date(jam.dates.start) > new Date()) return { redirect: { destination: `/scratch-jams/${jamId}` } };
    }

    if (jam.meta.archived === true && !isAdmin) return { props: { fallback: null, archived: true } };

    return jam ? { props: { fallback: JSON.stringify(jam) } } : { notFound: true };
}, sessionOptions);
