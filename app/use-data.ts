import { useState, useEffect, useCallback, useRef } from 'react';

export interface User {
    id: number;
    username: string;
    name: string;
    avatar_template: string;
}

export interface Post {
    id: number;
    name: string;
    username: string;
    avatar_template: string;
    created_at: string;
    like_count: number;
    blurb: string;
    post_number: number;
    topic_id: number;
}

export interface Topic {
    id: number;
    title: string;
    fancy_title: string;
    slug: string;
    posts_count: number;
    reply_count: number;
    highest_post_number: number;
    created_at: string;
    last_posted_at: string;
    bumped: boolean;
    bumped_at: string;
    archetype: string;
    unseen: boolean;
    pinned: boolean;
    unpinned: boolean | null;
    visible: boolean;
    closed: boolean;
    archived: boolean;
    bookmarked: boolean | null;
    liked: boolean | null;
    tags: string[];
    tags_descriptions: Record<string, string>;
    category_id: number;
    has_accepted_answer: boolean;
    can_have_answer: boolean;
}

export interface DiscussionStream {
    posts: Post[];
    topics: Topic[];
    users: User[];
}

export interface DiscussionDataResponse {
    data: DiscussionStream;
    status: string;
}

export const reindexData = (data: any): DiscussionStream => {
    return data;
};

export const useData = (searchTerm: string, interval: number = 60000) => {
    const [data, setData] = useState<DiscussionStream | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const hasFetchedOnce = useRef(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/search?term=${searchTerm}`, {
                cache: 'no-cache',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const rawData: DiscussionDataResponse = await response.json();
            const reindexedData = reindexData(rawData);
            setData(reindexedData);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (searchTerm && !hasFetchedOnce.current) {
            fetchData();
            hasFetchedOnce.current = true;
            const intervalId = setInterval(fetchData, interval);

            return () => clearInterval(intervalId);
        }
    }, [searchTerm, fetchData, interval]);

    const refresh = () => {
        setError(null);
        setData(null);
        fetchData();
    };

    return { data, error, loading, refresh };
};

export default useData;