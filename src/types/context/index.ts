interface Topic {
    id: string;
    text: string;
}
export interface Post {
    title: string;
    featuredImg: string | null;
    imgCaption: string;
    content: string;
    tags: Topic[];
    categorySlug: string;
}