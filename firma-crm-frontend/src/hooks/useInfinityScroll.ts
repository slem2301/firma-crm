import { useCallback, useRef } from "react";

type useInfinityScrollProps = {
    loading: boolean;
    hasMore: boolean;
    setPage: (value: number) => void;
    page: number;
};

export const useInfinityScroll = ({
    loading,
    hasMore,
    setPage,
    page,
}: useInfinityScrollProps) => {
    const observer = useRef<IntersectionObserver>();
    const lastElementRef = useCallback(
        (node: HTMLElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore) {
                        setPage(page + 1);
                    }
                },
                { threshold: 0 }
            );
            if (node) observer.current.observe(node);
        },
        [loading, hasMore, setPage, page]
    );

    return lastElementRef;
};
