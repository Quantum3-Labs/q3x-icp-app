import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CanisterState, initialCanisterState } from './canisterState';
import { CanisterActions, createCanisterActions } from './canisterAction';

type CanisterStore = CanisterState & CanisterActions;

export const useCanisterStore = create<CanisterStore>()(
  devtools(
    (set, get, store) => ({
      ...initialCanisterState,
      ...createCanisterActions(set, get, store),
    }),
    { name: 'CanisterStore' }
  )
);
