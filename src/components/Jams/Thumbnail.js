import { Box, Button, Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, Input, Label, Flex, Heading, Link, Text, Skeleton, theme, styled } from '@design-system';
import { imageDomains } from '@constants';
import { useState, useEffect, useRef, Fragment } from 'react';
import NextLink from 'next/link';
import { useToast } from '@hooks';
import { ToastError, ToastSuccess } from './ToastMessages';
import stopClickPropagation from '@utils/stop-click-propagation';

function ThumbnailFallback({ error = undefined, location, jamId }) {
    return (
        <Flex
            align="center"
            justify="center"
            direction="column"
            css={{
                backgroundColor: error === null ? '$accent3' : '$danger3',
                color: error === null ? '$accent11' : '$danger11',
                width: '100%',
                aspectRatio: '16 / 9',
                px: '$4',
                btlr: '$4',
                btrr: '$4',
                borderRadius: location === 'jam' && '$4',
            }}
        >
            <Heading as="h2" css={{ color: 'inherit' }}>
                {error === null ? 'No image' : 'This image could not be loaded!'}
            </Heading>
            <br />
            {error !== undefined && (
                <Text css={{ color: 'inherit', textAlign: 'center' }}>
                    {error === null ? (
                        <>
                            This game jam doesn't have a cover image. Ask{' '}
                            <NextLink href={`/scratch-jams/${jamId}/hosts`} passHref>
                                <Link variant="accent" onClick={stopClickPropagation}>
                                    a host
                                </Link>
                            </NextLink>{' '}
                            to upload one.
                        </>
                    ) : (
                        error
                    )}
                </Text>
            )}
        </Flex>
    );
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
}

const StyledThumbnail = styled('img', {
    btlr: '$4',
    btrr: '$4',
    objectFit: 'cover',
    aspectRatio: '16 / 9',
    width: '100%',
    display: 'block',
});

const StyledChangeThumbnailButton = styled(Button, {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: '$neutralOpaque !important',
    color: '$loContrast !important',
    '&:hover': {
        backgroundColor: '$card2opaque !important',
        backdropFilter: 'blur(5px)',
        color: '$hiContrast !important',
    },
    cursor: 'pointer',
});

function ChangeThumbnailButton({ onClick }) {
    return (
        <StyledChangeThumbnailButton
            size="modular"
            onClick={(e) => {
                stopClickPropagation(e);
                onClick();
            }}
        >
            Change cover image
        </StyledChangeThumbnailButton>
    );
}

export default function Thumbnail({ image, loading, location = 'explore', jam, canChangeThumbnail = false, mutateThumbnailCallback }) {
    const [loadingThumbnail, setLoadingThumbnail] = useState(true);
    const hostname = isValidHttpUrl(image) === false ? null : new URL(image).hostname;
    const [error, setError] = useState(false);
    const [thumbnailModification, setThumbnailModification] = useState({ dialogOpen: false, loading: false, newThumbnailURL: '' });

    const imageRef = useRef();

    const [toast] = useToast();

    function onThumbnailButtonClick() {
        setThumbnailModification({ ...thumbnailModification, dialogOpen: true });
    }

    useEffect(() => {
        if (imageRef.current?.complete) setLoadingThumbnail(false);
    }, []);

    async function changeThumbnail(thumbnailURL) {
        return new Promise(async (resolve, reject) => {
            let res = await fetch(`/api/scratch-jams/${jam._id}/thumbnail`, {
                method: thumbnailURL === null ? 'DELETE' : 'PUT',
                body: thumbnailURL === null ? null : JSON.stringify({ thumbnailURL: thumbnailURL }),
            });
            res = await res.json();
            if (res.success) {
                toast({
                    customContent: (
                        <ToastSuccess>
                            {thumbnailURL === null ? <>The cover image of the game jam {jam?.name} was removed</> : <>Successfully updated the cover image of the game jam {jam?.name}</>}
                        </ToastSuccess>
                    ),
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
            mutateThumbnailCallback();
            resolve();
        });
    }

    useEffect(() => {
        if (image === undefined && loading === false) return;
        setError(
            loading ? (
                false
            ) : !image ? null : isValidHttpUrl(image) === false ? (
                <>Malformed image URL</>
            ) : imageDomains.includes(hostname) ? (
                false
            ) : (
                <>
                    Images are only accepted from{' '}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Link as="span" variant="danger" css={{ cursor: 'pointer' }} onClick={stopClickPropagation}>
                                <i>certain domains</i>
                            </Link>
                        </DialogTrigger>
                        <DialogContent onClick={stopClickPropagation}>
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
                    . This image is hosted under the domain <i>{hostname}</i>
                </>
            ),
        );
    }, [image, loading]);

    return (
        <>
            <Dialog open={thumbnailModification.dialogOpen} onOpenChange={(open) => setThumbnailModification({ ...thumbnailModification, dialogOpen: open })}>
                <DialogContent onClick={stopClickPropagation}>
                    <DialogTitle>Change the cover image for the game jam {jam?.name}</DialogTitle>
                    <DialogDescription css={{ m: 0 }}>
                        Images are only accepted from{' '}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Link as="span" css={{ cursor: 'pointer' }} onClick={stopClickPropagation}>
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
                    </DialogDescription>
                    <Flex direction="column" gap="1" css={{ my: '$2' }}>
                        <Label htmlFor="thumbnail-url">Cover image URL:</Label>
                        <Input
                            id="thumbnail-url"
                            css={{ width: '100%' }}
                            value={thumbnailModification.newThumbnailURL}
                            onInput={(e) => setThumbnailModification({ ...thumbnailModification, newThumbnailURL: e.target.value })}
                            disabled={thumbnailModification.loading}
                        />
                    </Flex>
                    <Flex direction="column" gap="2">
                        <Button
                            variant="accent"
                            block
                            disabled={thumbnailModification.loading || !thumbnailModification.newThumbnailURL}
                            onClick={async () => {
                                setThumbnailModification({ ...thumbnailModification, loading: true });
                                await changeThumbnail(thumbnailModification.newThumbnailURL);
                                setThumbnailModification({ dialogOpen: false, loading: false, newThumbnailURL: '' });
                            }}
                        >
                            Change cover image
                        </Button>
                        <Button
                            variant="neutral"
                            block
                            disabled={thumbnailModification.loading}
                            onClick={async () => {
                                setThumbnailModification({ ...thumbnailModification, loading: true });
                                await changeThumbnail(null);
                                setThumbnailModification({ dialogOpen: false, loading: false, newThumbnailURL: '' });
                            }}
                        >
                            Remove current cover image
                        </Button>
                    </Flex>
                </DialogContent>
            </Dialog>
            {(loadingThumbnail === true || loading === true) && error === false && (
                <Skeleton width="100%" aspectRatio="16 / 9" borderRadius={location === 'jam' ? theme.radii[4] : `${theme.radii[4]} ${theme.radii[4]} 0 0`} />
            )}
            {imageDomains.includes(hostname) && error === false ? (
                <Box css={{ display: loadingThumbnail === true ? 'none' : 'auto', position: 'relative' }}>
                    {canChangeThumbnail && <ChangeThumbnailButton onClick={onThumbnailButtonClick} />}
                    <StyledThumbnail src={image} ref={imageRef} onLoad={() => setLoadingThumbnail(false)} css={{ borderRadius: location === 'jam' && '$4' }} />
                </Box>
            ) : (
                <>
                    {loading === false && error !== false && (
                        <Box css={{ position: 'relative' }}>
                            {canChangeThumbnail && <ChangeThumbnailButton onClick={onThumbnailButtonClick} />}
                            <ThumbnailFallback error={error} location={location} jamId={jam?._id} />
                        </Box>
                    )}
                </>
            )}
        </>
    );
}
