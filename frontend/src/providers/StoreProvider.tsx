'use client';

import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { initAuth } from '@/store/slices/authSlice';

export default function StoreProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        store.dispatch(initAuth());
    }, []);

    return <Provider store={store}>{children}</Provider>;
}