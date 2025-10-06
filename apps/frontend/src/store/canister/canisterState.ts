export interface CanisterState {
  currentCanisterId: string | null;
  actor: any | null;
}

export const initialCanisterState: CanisterState = {
  currentCanisterId: null,
  actor: null,
};
