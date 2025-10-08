'use client'; // important: provider must be a client component

import { Provider } from 'react-redux';
import { store } from './store';

interface Props {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
