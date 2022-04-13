import { useState, useEffect } from 'react';

export default function usePagination({ limit = 5, dataLength = 0 /* itemsPerPage = 5, dataLength = 0, isLoading = false, size = 4, isOffsetZero = true */ }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        setMaxPage(Math.ceil(dataLength / limit));
    }, [limit, dataLength]);

    useEffect(() => {
        if (currentPage > maxPage && maxPage !== 0) {
            setCurrentPage(maxPage);
            console.log(currentPage, maxPage);
        }
    }, [maxPage]);

    useEffect(() => {
        setOffset(currentPage - 1);
    }, [currentPage]);

    const jumpToPage = (newPage) => {
        setCurrentPage(Math.round(newPage) > maxPage ? maxPage : Math.round(newPage) > 0 ? Math.round(newPage) : 1);
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

    /* const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState({ limit: itemsPerPage, offset: isOffsetZero ? currentPage - 1 : currentPage });
    const [pageRange, setPageRange] = useState([]);
    const [maxPage, setMaxPage] = useState(0);

    const nextPage = () => {
        if (isLoading) return;
        setCurrentPage(currentPage >= maxPage ? maxPage : currentPage + 1);
    };
    const previousPage = () => {
        if (isLoading) return;
        setCurrentPage(currentPage <= 1 ? 1 : currentPage - 1);
    };

    const jumpToFirstPage = () => {
        if (isLoading) return;
        setCurrentPage(1);
    };
    const jumpToLastPage = () => {
        if (isLoading) return;
        setCurrentPage(maxPage);
    };

    const jumpToPage = (newPage) => {
        if (isLoading) return;
        setCurrentPage(newPage > maxPage ? maxPage : newPage);
    };

    const rangeRebuild = () => {
        const numberOfPages = Math.ceil(dataLength / itemsPerPage);
        const pageLength = numberOfPages < size ? numberOfPages : size;

        if (pageRange.length == 0 || currentPage < size) {
            setPageRange(Array.from(Array(pageLength), (_, i) => i + 1));
        }

        setPageRange(Array.from(Array(pageLength), (_, i) => i + (currentPage - size >= 1 ? currentPage - size + 1 : 1)));
        return { pageLength };
    };

    useEffect(() => {
        //setCurrentPage(1);
        rangeRebuild();
    }, [itemsPerPage]);

    useEffect(() => {
        if (pageRange.length === 0) {
            setCurrentPage(1);
        }
        if (isOffsetZero) {
            if (pageRange.length === 1) {
                setCurrentPage(1);
            }
        }
        if (pageRange[pageRange.length - 1] > rangeRebuild().pageLength) {
            setCurrentPage(maxPage);
        }
        if (currentPage > pageRange[pageRange.length - 1]) {
            setCurrentPage(maxPage);
        }
    }, [maxPage, isOffsetZero]);

    useEffect(() => {
        setMaxPage(Math.ceil(dataLength / itemsPerPage));
        rangeRebuild();
    }, [itemsPerPage, currentPage, dataLength]);

    useEffect(() => {
        if (isLoading) return;
        setQuery({ limit: itemsPerPage, offset: isOffsetZero ? currentPage - 1 : currentPage });
        setMaxPage(Math.ceil(dataLength / itemsPerPage));
        rangeRebuild();
    }, [itemsPerPage, currentPage, isOffsetZero]);

    return {
        page: currentPage,
        query,
        nextPage,
        previousPage,
        pageRange,
        jumpToPage,
        jumpToFirstPage,
        jumpToLastPage,
        lastPage: maxPage,
    }; */
}
