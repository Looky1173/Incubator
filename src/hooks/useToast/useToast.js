import { useToastDispatchContext } from '@design-system/Toast';

function useToast() {
    const dispatch = useToastDispatchContext();

    function toast(options) {
        // Generate v4 UUID
        const id = crypto.randomUUID();
        // Add toast
        dispatch({ type: 'ADD_TOAST', toast: { options: options, id: id } });
    }

    function deleteToast(id) {
        dispatch({ type: 'DELETE_TOAST', id: id });
    }

    return [toast, deleteToast];
}

export default useToast;
