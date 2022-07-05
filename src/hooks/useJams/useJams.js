import useSWR from 'swr';
import { fetcher } from '@constants';

// https://stackoverflow.com/a/1714899
const serialize = (obj) => {
    const str = [];
    for (let p in obj) {
        if (obj.hasOwnProperty(p) && obj[p] !== undefined) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    }
    return str.join('&');
};

export default function useJams(jam = null, filters = { limit: 20, offset: 0 }, shouldFetch = true, fallbackData = null) {
    const { data, error, isValidating, mutate } = useSWR(
        shouldFetch ? `/api/scratch-jams${jam === null ? filters !== {} && '?' + serialize(filters) : '/' + jam}` : null,
        fetcher,
        fallbackData && { fallbackData: fallbackData },
    );
    /* const { data, error, isValidating, mutate } = useSWR(
        shouldFetch ? ['/api/scratch-jams']`/api/scratch-jams${jam === null ? filters !== {} && '?' + serialize(filters) : '/' + jam}` : null,
        fetcher,
        fallbackData && { fallbackData: fallbackData },
    ); */

    return {
        data: data,
        mutate: mutate,
        isLoading: !error && !data,
        isValidating: isValidating,
        isError: error,
    };
}
