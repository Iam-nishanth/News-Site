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
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import { useEffect, useMemo, useRef } from 'react';
import { handleUploadFile } from '@/utils/actions/cloudinary';

const plugins = [
    Paragraph,
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
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', 'image');

                const data = await handleUploadFile(formData);

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

export default function WithReadOnly({ content }: { content: any }) {
    const editor = useMemo(() => createYooptaEditor(), []);
    const selectionRef = useRef(null);

    return (
        <div className="w-full" ref={selectionRef}>
            <YooptaEditor
                className="w-full"
                style={{
                    width: '100% !important',
                    margin: '0',
                    padding: '0 0 20px 0'
                }}
                editor={editor}
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                selectionBoxRoot={selectionRef}
                value={JSON.parse(content)}
                autoFocus
                readOnly
            />
        </div>
    );
}
