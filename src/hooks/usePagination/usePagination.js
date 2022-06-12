import { useState, useEffect } from 'react';

export default function usePagination({ limit = 5, dataLength = 0, isInitialized }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        if (!isInitialized) return;
        setMaxPage(Math.ceil(dataLength / limit));
    }, [limit, dataLength, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        if (currentPage > maxPage && maxPage !== 0) {
            setCurrentPage(maxPage);
        }
    }, [maxPage]);

    useEffect(() => {
        if (!isInitialized) return;
        setOffset(currentPage - 1);
    }, [currentPage]);

    const jumpToPage = (newPage) => {
        setCurrentPage(isInitialized ? (Math.round(newPage) > maxPage ? maxPage : Math.round(newPage) > 0 ? Math.round(newPage) : 1) : newPage);
    };

    const nextPage = () => {
        setCurrentPage(currentPage >= maxPage ? maxPage : Number(currentPage) + 1);
    };

    const previousPage = () => {
        setCurrentPage(currentPage <= 1 ? 1 : Number(currentPage) - 1);
    };

    const jumpToFirstPage = () => {
        setCurrentPage(1);
    };

    const jumpToLastPage = () => {
        setCurrentPage(maxPage);
    };

    return {
        page: currentPage,
        offset,
        jumpToPage,
        jumpToFirstPage,
        jumpToLastPage,
        nextPage,
        previousPage,
        lastPage: maxPage,
    };
}
