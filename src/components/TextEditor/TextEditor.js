import { useEditor, EditorContent } from '@tiptap/react';
import { isObject, isObjectEmpty } from '@utils/object';

import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import CharacterCount from '@tiptap/extension-character-count';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import TipTapText from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';

import { Box, Button, Flex, Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverArrow, Text, styled, keyframes, css } from '@design-system';
import {
    FontBoldIcon,
    FontItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
    CodeIcon,
    ListBulletIcon,
    TextAlignBottomIcon,
    QuoteIcon,
    ReloadIcon,
    DividerHorizontalIcon,
    Cross2Icon,
    ChevronDownIcon,
} from '@radix-ui/react-icons';

import { useEffect } from 'react';

const Toggle = styled('button', {
    all: 'unset',
    backgroundColor: '$card2',
    color: '$neutral11',
    height: '$6',
    px: '$2',
    borderRadius: '$2',
    display: 'flex',
    fontSize: '$4',
    lineHeight: 1,
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': { backgroundColor: '$accent3', color: '$accent10' },
    '&[data-state=on]': { backgroundColor: '$accent4', color: '$accent11' },
    '&:focus': { boxShadow: `0 0 0 2px $colors$accent8` },
    '&:disabled': {
        pointerEvents: 'none !important',
        backgroundColor: '$neutral3 !important',
        color: '$neutral8 !important',
    },

    variants: {
        variant: {
            pressed: {
                backgroundColor: '$accent6',
                color: '$accent11',
            },
            dark: {
                backgroundColor: '$card4',
            },
        },
        type: {
            icon: {
                height: '$6',
                width: '$6',
                p: 0,
            },
        },
    },
});

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <Flex gap={1} wrap="wrap" align="center">
            <Toggle onClick={() => editor.chain().focus().toggleBold().run()} variant={editor.isActive('bold') && 'pressed'} type="icon">
                <FontBoldIcon width="24" height="24" />
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().toggleItalic().run()} variant={editor.isActive('italic') && 'pressed'} type="icon">
                <FontItalicIcon width="24" height="24" />
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().toggleUnderline().run()} variant={editor.isActive('underline') && 'pressed'} type="icon">
                <UnderlineIcon width="24" height="24" />
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().toggleStrike().run()} variant={editor.isActive('strike') && 'pressed'} type="icon">
                <StrikethroughIcon width="24" height="24" />
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} variant={editor.isActive('heading', { level: 1 }) && 'pressed'} type="icon">
                h1
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant={editor.isActive('heading', { level: 2 }) && 'pressed'} type="icon">
                h2
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} variant={editor.isActive('heading', { level: 3 }) && 'pressed'} type="icon">
                h3
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} variant={editor.isActive('heading', { level: 4 }) && 'pressed'} type="icon">
                h4
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} variant={editor.isActive('heading', { level: 5 }) && 'pressed'} type="icon">
                h5
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} variant={editor.isActive('heading', { level: 6 }) && 'pressed'} type="icon">
                h6
            </Toggle>
            <Toggle disabled onClick={() => editor.chain().focus().toggleBulletList().run()} variant={editor.isActive('bulletList') && 'pressed'} type="icon">
                <ListBulletIcon width="24" height="24" />
            </Toggle>
            <Toggle disabled onClick={() => editor.chain().focus().toggleOrderedList().run()} variant={editor.isActive('orderedList') && 'pressed'} type="icon">
                <Box css={{ transform: 'translateY(-3px)' }}>
                    <TextAlignBottomIcon width="24" height="24" />
                </Box>
            </Toggle>
            <Toggle disabled onClick={() => editor.chain().focus().toggleCode().run()} variant={editor.isActive('code') && 'pressed'} type="icon">
                <CodeIcon width="24" height="24" />
            </Toggle>
            <Toggle disabled onClick={() => editor.chain().focus().toggleBlockquote().run()} variant={editor.isActive('blockquote') && 'pressed'} type="icon">
                <QuoteIcon width="24" height="24" />
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().setHorizontalRule().run()} type="icon">
                <DividerHorizontalIcon width="24" height="24" />
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().undo().run()} type="icon">
                <Box css={{ transform: 'scaleX(-1)' }}>
                    <ReloadIcon width="24" height="24" />
                </Box>
            </Toggle>
            <Toggle onClick={() => editor.chain().focus().redo().run()} type="icon">
                <ReloadIcon width="24" height="24" />
            </Toggle>
            <Popover>
                <PopoverTrigger asChild>
                    <Button size="small" css={{ mr: '$2' }}>
                        Utilities
                        <Box css={{ ml: '$1' }}>
                            <ChevronDownIcon width={24} height={24} />
                        </Box>
                    </Button>
                </PopoverTrigger>
                <PopoverContent sideOffset={5} css={{ width: '17rem' }}>
                    <PopoverArrow width={20} height={10} />
                    <PopoverClose>
                        <Cross2Icon width={20} height={20} />
                    </PopoverClose>
                    <Flex gap="1" wrap="wrap" justify="center">
                        {/* <Toggle onClick={() => editor.chain().focus().toggleCodeBlock().run()} variant={editor.isActive('codeBlock') ? 'pressed' : 'dark'}>
                            code block
                        </Toggle> */}
                        <Toggle onClick={() => editor.chain().focus().setHardBreak().run()} variant="dark">
                            hard break
                        </Toggle>
                        <Toggle onClick={() => editor.chain().focus().unsetAllMarks().run()} variant="dark">
                            clear marks
                        </Toggle>
                        <Toggle onClick={() => editor.chain().focus().clearNodes().run()} variant="dark">
                            clear nodes
                        </Toggle>
                    </Flex>
                </PopoverContent>
            </Popover>
        </Flex>
    );
};

const blockquoteClass = css({
    color: 'red',
});

const headingClass = css({
    color: '$accent11',
    mb: '$2',
});

const paragraphClass = css({
    lineHeight: '$sm',
    mb: '$2',
});

const textClass = css({
    color: '$hiContrast',
    outline: 'none',
});

const characterCountWarningAnimation = keyframes({
    '0%': {
        opacity: 1,
    },
    '50%': {
        opacity: 0.3,
    },
    '100%': {
        opacity: 1,
    },
});

const emptyEditorClass = css({
    '&:first-child::before': {
        color: '$neutral8',
        content: 'attr(data-placeholder)',
        pointerEvents: 'none',
        float: 'left',
        height: 0,
    },
    mb: '$8',
    '@bp1': {
        mb: '$6',
    },
    '@bp2': {
        mb: '$4',
    },
});

const StyledCharacterCount = styled(Text, {
    color: '$neutral11 !important',
    variants: {
        variant: {
            warning: {
                color: '$danger11 !important',
            },
            danger: {
                color: '$danger11 !important',
                fontWeight: '$bold',
                animation: `${characterCountWarningAnimation} 1s ease-in-out infinite`,
            },
        },
    },
});

const characterLimit = 5000;

const TextEditor = ({ content, onContentChange, editable = false }) => {
    const editor = useEditor({
        extensions: [
            Blockquote.configure({
                HTMLAttributes: {
                    class: blockquoteClass,
                },
            }),
            Bold,
            BulletList,
            CharacterCount.configure({
                limit: characterLimit,
            }),
            Code,
            Document,
            HardBreak,
            Heading.configure({
                HTMLAttributes: {
                    class: headingClass,
                },
            }),
            History,
            HorizontalRule,
            Italic,
            ListItem,
            OrderedList,
            Paragraph.configure({
                HTMLAttributes: {
                    class: paragraphClass,
                },
            }),
            Placeholder.configure({
                emptyEditorClass: emptyEditorClass,
                placeholder: 'Elaborate on the summary. Explain the theme of the game jam, the rules & requirements, the prize, etc...',
            }),
            Strike,
            TipTapText,
            Underline,
        ],
        editorProps: {
            attributes: {
                class: textClass,
            },
        },
        onUpdate: ({ editor }) => {
            const JSONContent = editor.getJSON();
            onContentChange(JSONContent);
        },
    });

    useEffect(() => {
        if (!editor) {
            return undefined;
        }

        editor.setEditable(editable);
    }, [editor, editable]);

    useEffect(() => {
        if (!editor) return;

        try {
            editor.commands.setContent(!isObject(content) && !isObjectEmpty(content) ? JSON.parse(content) : content);
        } catch {
            editor.commands.setContent([]);
        }
    }, [editor, content]);

    return (
        <>
            {editable && <MenuBar editor={editor} />}
            <EditorContent editor={editor} />
            {editable && (
                <StyledCharacterCount
                    variant={
                        characterLimit - (editor?.storage.characterCount.characters() || 0) < 0 ? 'danger' : characterLimit - (editor?.storage.characterCount.characters() || 0) < 500 && 'warning'
                    }
                >
                    {editor?.storage.characterCount.characters()}/{characterLimit} character{editor?.storage.characterCount.characters() !== 1 && 's'}
                    <br />
                    {editor?.storage.characterCount.words()} word{editor?.storage.characterCount.words() !== 1 && 's'}
                </StyledCharacterCount>
            )}
        </>
    );
};

export default TextEditor;
