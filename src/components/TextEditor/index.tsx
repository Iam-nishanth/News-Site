import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import { uploadToCloudinary } from '@/utils/cloudinary';
import { useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { INITIAL_VALUE } from './initValue';

const plugins = [
    Paragraph,
    Table,
    Divider,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    Blockquote,
    Callout,
    NumberedList,
    BulletedList,
    TodoList,
    Code,
    Link,
    Embed,
    Image.extend({
        options: {
            async onUpload(file) {
                const data = await uploadToCloudinary(file, 'image');

                return {
                    src: data.secure_url,
                    alt: 'cloudinary',
                    sizes: {
                        width: data.width,
                        height: data.height
                    }
                };
            }
        }
    }),
    Video.extend({
        options: {
            onUpload: async (file) => {
                const data = await uploadToCloudinary(file, 'video');
                return {
                    src: data.secure_url,
                    alt: 'cloudinary',
                    sizes: {
                        width: data.width,
                        height: data.height
                    }
                };
            },
            onUploadPoster: async (file) => {
                const image = await uploadToCloudinary(file, 'image');
                return image.secure_url;
            }
        }
    }),
    File.extend({
        options: {
            onUpload: async (file) => {
                const response = await uploadToCloudinary(file, 'auto');
                return { src: response.secure_url, format: response.format, name: response.name, size: response.bytes };
            }
        }
    })
];

const TOOLS = {
    ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList
    },
    Toolbar: {
        render: DefaultToolbarRender,
        tool: Toolbar
    },
    LinkTool: {
        render: DefaultLinkToolRender,
        tool: LinkTool
    }
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

function WithBasicUsageExample() {
    const editor = useMemo(() => createYooptaEditor(), []);
    const { setTheme, theme } = useTheme();
    const selectionRef = useRef(null);

    useEffect(() => {
        setTheme('dark');
        return () => setTheme('light');
    }, []);

    const isLightTheme = theme === 'light';
    const onSwitchTheme = () => {
        setTheme(isLightTheme ? 'dark' : 'light');
    };

    return (
        <div className="w-full h-full px-20" ref={selectionRef}>
            <YooptaEditor editor={editor} plugins={plugins} tools={TOOLS} marks={MARKS} selectionBoxRoot={selectionRef} autoFocus value={INITIAL_VALUE} />
        </div>
    );
}

export default WithBasicUsageExample;
