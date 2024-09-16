import { create } from 'zustand'

interface SearchState {
    open: boolean;
    handleOpen: () => void;
}

export const searchStore = create<SearchState>()((set) => ({
    open: false,
    // increase: (by) => set((state) => ({ bears: state.bears + by })),
    handleOpen: () => set((state) => ({ open: !(state.open) })),
}))