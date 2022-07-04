import useSWR from 'swr';
import { fetcher } from '@constants';

export default function useJamHosts(jam = null) {
    const { data, error, mutate } = useSWR(!jam ? null : `/api/scratch-jams/${jam}/hosts`, fetcher);

    return {
        hosts: data?.hosts,
        isOrganizer: data?.isOrganizer,
        loading: !error && !data,
        mutateHosts: mutate,
        error: error,
    };
}
