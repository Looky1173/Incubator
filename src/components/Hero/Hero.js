import React from 'react';
import NextLink from 'next/link';
import { Button, Section, Container, Box, Heading, Grid, Flex, Text, Paragraph } from '@design-system';
import { ArrowRightIcon } from '@radix-ui/react-icons';

function Hero() {
    return (
        <Section
            size={{
                '@initial': '2',
                '@bp1': '3',
            }}
            css={{
                pt: '$3',
                '@bp2': {
                    pt: '$6',
                },
            }}
        >
            <Container size="3">
                <Heading
                    size="4"
                    css={{
                        mb: '$3',
                        '@initial': {
                            pr: 100
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
                    Explore crazy{' '}
                    <Box
                        as="span"
                        css={{
                            color: '$cyan10',
                        }}
                    >
                        Scratch experiments
                    </Box>
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
                    Scratch Incubator hosts a number of interesting, open-source, and <i>arguably</i> useful experiments and tools.
                </Paragraph>
                <Flex css={{ '@bp2': { jc: 'center', my: '$7' } }}>
                    <NextLink href="/experiments" passHref>
                        <Button as="a" variant="accent" css={{ mr: '$3' }}>
                            Experiments
                            <Box css={{ ml: '$1' }}>
                                <ArrowRightIcon width={24} height={24} />
                            </Box>
                        </Button>
                    </NextLink>
                    <NextLink href="/about" passHref>
                        <Button as="a" variant="neutral">Learn more</Button>
                    </NextLink>
                </Flex>
            </Container>

            <Box css={{ height: '20px', my: '$6', '@bp2': { my: '$8' } }} />

            <Container size="3">
                <Grid
                    css={{
                        gap: '$6',
                        gridTemplateColumns: '1fr',
                        '@bp1': {
                            gap: '$7',
                            gridTemplateColumns: '1fr 1fr',
                        },
                        '@bp2': {
                            gap: '$7',
                            gridTemplateColumns: '1fr 1fr 1fr',
                        },
                    }}
                >
                    <Box>
                        <Flex
                            css={{
                                ai: 'center',
                                jc: 'center',
                                width: '$7',
                                height: '$7',
                                borderRadius: '$round',
                                backgroundColor: '$accent5',
                                color: '$accent10',
                                mb: '$4',
                            }}
                        >
                            <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3L14 3V3.92494C13.9174 3.92486 13.8338 3.94751 13.7589 3.99505L7.5 7.96703L1.24112 3.99505C1.16621 3.94751 1.0826 3.92486 1 3.92494V3ZM1 4.90797V12H14V4.90797L7.74112 8.87995C7.59394 8.97335 7.40606 8.97335 7.25888 8.87995L1 4.90797Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </Flex>
                        <Heading as="h4" css={{ mb: '$2' }}>
                            Message count tracker
                        </Heading>
                        <Text
                            as="p"
                            size={{
                                '@initial': '4',
                                '@bp2': '5',
                            }}
                            variant="gray"
                            css={{
                                lineHeight: '25px',
                            }}
                        >
                            Keeps historical data of Scratchers&apos; message counts over time and generates a leaderboard of the Scratchers with the most message counts.
                        </Text>
                    </Box>
                    <Box>
                        <Flex
                            css={{
                                ai: 'center',
                                jc: 'center',
                                width: '$7',
                                height: '$7',
                                borderRadius: '$round',
                                backgroundColor: '$accent5',
                                color: '$accent10',
                                mb: '$4',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" version="1.1" viewBox="0 0 88.236 121.68">
                                <g transform="translate(-85.385 -104.33)">
                                    <g transform="matrix(.026458 0 0 .026458 13.269 60.389)">
                                        <g id="l10vCaeSFIMbu804v8FgtQa" transform="translate(793.26 361.1)">
                                            <g>
                                                <path
                                                    id="pPxD8nQAa"
                                                    d="m2828 5880c-93-17-209-55-273-89-192-101-326-219-443-389-43-63-109-203-136-292-44-138-53-425-33-955 17-455 26-519 85-644l27-56-3-220c-2-133 1-246 8-285 6-36 17-123 25-194 16-145 86-415 126-485 5-9 13-27 19-41 5-14 26-52 45-85s38-67 42-75c9-19 70-105 103-145 60-73 203-205 276-253 215-143 494-232 725-232 53 0 81-6 117-24 144-72 327-116 480-116 147 0 418 60 472 105 8 7 25 16 38 20 60 18 235 153 317 244 47 52 108 136 130 178 11 21 22 40 25 43 13 12 63 137 85 213 14 45 28 127 33 181 8 103-9 721-27 955-8 114-7 128 10 160 10 20 19 40 19 46s5 16 11 22c15 15 66 159 94 265 36 137 51 357 36 519-15 160-52 309-98 399-7 14-13 31-13 38 0 18-95 195-138 256-123 177-292 344-462 457-79 53-300 164-344 174-6 1-18 5-26 8-89 34-287 76-400 84-56 4-83 11-105 28-47 35-172 101-256 134-170 68-392 87-591 51zm343-505c99-21 200-77 274-151l61-61h135c194 1 325-30 529-126 145-68 310-218 420-382 83-123 143-280 161-420 11-82 5-269-11-340-27-119-97-283-152-355-18-25-37-51-42-58-4-7 2-43 13-80 25-84 38-293 47-763 8-405 8-406-92-564-59-93-137-159-245-209-201-92-422-68-598 64-31 24-38 25-154 22-168-5-359 36-457 98-8 5-28 16-45 24-54 25-173 139-237 226-45 62-110 198-127 266-40 156-51 211-60 294-6 52-16 131-22 175-12 86-7 246 11 335 6 30 15 79 21 108 10 51 10 53-25 93-42 49-80 125-100 199-16 56-22 194-30 690-6 344 3 465 43 557 41 96 79 150 149 214 143 133 337 185 533 144z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    id="p167hpsXeQ"
                                                    d="m2962 4925c-13-7-33-26-46-43-20-28-24-48-29-154-6-116 8-766 19-834 6-43 64-100 108-108 54-10 111 9 137 46 17 24 24 52 29 117 9 107 34 205 66 253 26 40 137 137 188 163 17 9 45 24 61 33 23 13 57 17 145 17 109-1 118-2 180-33 87-43 150-106 191-192 17-36 23-142 10-183-22-67-123-155-206-180-11-3-40-13-65-22-53-20-183-50-298-70-104-17-162-39-233-86-89-60-145-146-182-277-41-150-23-465 39-667 32-105 72-174 134-227 61-53 131-78 237-85 69-5 93-2 155 18 81 26 168 80 240 150l48 45v-129c0-155 12-185 86-213 56-21 106-9 149 37l30 31-2 211c-3 212-18 584-29 686-4 41-13 61-38 89-30 32-37 35-89 35-100 0-138-43-148-169-12-147-71-276-178-388-110-114-197-149-272-110-41 21-76 101-89 207-6 45-15 107-20 137-27 166 0 320 67 385 41 40 59 46 233 76 69 12 159 33 200 46s86 27 100 30 32 11 40 18 26 16 40 20c99 29 236 158 294 277 58 115 68 264 28 378-67 189-218 343-403 410-64 24-190 50-238 50-20 0-74-9-121-19-157-35-177-42-295-101l-70-36 3 131c3 115 1 136-16 166-38 69-127 99-190 64z"
                                                    fill="currentColor"
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </Flex>
                        <Heading as="h4" css={{ mb: '$2' }}>
                            Scratch Game Jams
                        </Heading>
                        <Text
                            as="p"
                            size={{
                                '@initial': '4',
                                '@bp2': '5',
                            }}
                            variant="gray"
                            css={{
                                lineHeight: '25px',
                            }}
                        >
                            Discover and participate in Scratch game jams; and embrace the community!
                        </Text>
                    </Box>
                    <Box>
                        <Flex
                            css={{
                                ai: 'center',
                                jc: 'center',
                                width: '$7',
                                height: '$7',
                                borderRadius: '$round',
                                backgroundColor: '$neutral5',
                                color: '$neutral10',
                                mb: '$4',
                            }}
                        >
                            <svg width="25" height="25" viewBox="1 -1 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.9 0.499976C13.9 0.279062 13.7209 0.0999756 13.5 0.0999756C13.2791 0.0999756 13.1 0.279062 13.1 0.499976V1.09998H12.5C12.2791 1.09998 12.1 1.27906 12.1 1.49998C12.1 1.72089 12.2791 1.89998 12.5 1.89998H13.1V2.49998C13.1 2.72089 13.2791 2.89998 13.5 2.89998C13.7209 2.89998 13.9 2.72089 13.9 2.49998V1.89998H14.5C14.7209 1.89998 14.9 1.72089 14.9 1.49998C14.9 1.27906 14.7209 1.09998 14.5 1.09998H13.9V0.499976ZM11.8536 3.14642C12.0488 3.34168 12.0488 3.65826 11.8536 3.85353L10.8536 4.85353C10.6583 5.04879 10.3417 5.04879 10.1465 4.85353C9.9512 4.65827 9.9512 4.34169 10.1465 4.14642L11.1464 3.14643C11.3417 2.95116 11.6583 2.95116 11.8536 3.14642ZM9.85357 5.14642C10.0488 5.34168 10.0488 5.65827 9.85357 5.85353L2.85355 12.8535C2.65829 13.0488 2.34171 13.0488 2.14645 12.8535C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L9.14646 5.14642C9.34172 4.95116 9.65831 4.95116 9.85357 5.14642ZM13.5 5.09998C13.7209 5.09998 13.9 5.27906 13.9 5.49998V6.09998H14.5C14.7209 6.09998 14.9 6.27906 14.9 6.49998C14.9 6.72089 14.7209 6.89998 14.5 6.89998H13.9V7.49998C13.9 7.72089 13.7209 7.89998 13.5 7.89998C13.2791 7.89998 13.1 7.72089 13.1 7.49998V6.89998H12.5C12.2791 6.89998 12.1 6.72089 12.1 6.49998C12.1 6.27906 12.2791 6.09998 12.5 6.09998H13.1V5.49998C13.1 5.27906 13.2791 5.09998 13.5 5.09998ZM8.90002 0.499976C8.90002 0.279062 8.72093 0.0999756 8.50002 0.0999756C8.2791 0.0999756 8.10002 0.279062 8.10002 0.499976V1.09998H7.50002C7.2791 1.09998 7.10002 1.27906 7.10002 1.49998C7.10002 1.72089 7.2791 1.89998 7.50002 1.89998H8.10002V2.49998C8.10002 2.72089 8.2791 2.89998 8.50002 2.89998C8.72093 2.89998 8.90002 2.72089 8.90002 2.49998V1.89998H9.50002C9.72093 1.89998 9.90002 1.72089 9.90002 1.49998C9.90002 1.27906 9.72093 1.09998 9.50002 1.09998H8.90002V0.499976Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </Flex>
                        <Heading as="h4" css={{ mb: '$2' }}>
                            Coming soon...
                        </Heading>
                        <Text
                            as="p"
                            size={{
                                '@initial': '4',
                                '@bp2': '5',
                            }}
                            variant="gray"
                            css={{
                                lineHeight: '25px',
                            }}
                        >
                            More Scratch experiments will be available in the future. Check back soon!
                        </Text>
                    </Box>
                </Grid>
            </Container>
        </Section>
    );
}

export default Hero;
