'use client';

import React, { createContext, useState, useEffect } from 'react';
import { Post } from '@/types/context';
// import { getDraftPostsFromServer } from './draftPostsServer';

interface DraftPostsContextValue {
    draftPosts: Post[];
    addDraftPost: (post: Post) => void;
    publishPost: (postId: string) => void;
    open: boolean;
}

export const DraftPostsContext = createContext<DraftPostsContextValue | undefined>(undefined);

interface DraftPostsProviderProps {
    children: React.ReactNode;
}

export const DraftPostsProvider: React.FC<DraftPostsProviderProps> = ({ children }) => {
    const [draftPosts, setDraftPosts] = useState<Post[]>(() => {
        if (typeof window !== 'undefined') {
            // Check if the code is running in the browser
            const storedDraftPosts = JSON.parse(localStorage.getItem('draftPosts') || '[]');
            if (storedDraftPosts) return storedDraftPosts;
        }
        return []; // Return an empty array if running on the server
    });

    // useEffect(() => {
    //   if (typeof window !== 'undefined') { // Check if the code is running in the browser
    //     const serverDraftPosts = getDraftPostsFromServer();
    //     setDraftPosts((prevDraftPosts) => [...prevDraftPosts, ...serverDraftPosts]);
    //   }
    // }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check if the code is running in the browser
            localStorage.setItem('draftPosts', JSON.stringify(draftPosts));
        }
    }, [draftPosts]);

    const addDraftPost = (post: Post) => {
        setDraftPosts((prevDraftPosts) => [...prevDraftPosts, post]);
    };

    const publishPost = (postId: string) => {
        // Implement your logic to publish the post here
        // e.g., send a request to your API to publish the post

        // Remove the published post from the draft posts
        setDraftPosts((prevDraftPosts) => prevDraftPosts.filter((post) => post.title !== postId));
    };

    const [open, setOpen] = useState<boolean>(false);

    return <DraftPostsContext.Provider value={{ draftPosts, addDraftPost, publishPost, open }}>{children}</DraftPostsContext.Provider>;
};
