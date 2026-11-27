export interface FrameState {
  index: number;
  playing: boolean;
}

export type FrameAction =
  | { type: 'toggle' | 'next' | 'prev' | 'restart' | 'tick' }
  | { type: 'seek'; index: number };

export const initialFrameState: FrameState = { index: 0, playing: false };

export function isLastFrame(state: FrameState, total: number): boolean {
  return state.index >= total - 1;
}

/** Durata di un fotogramma: più testo da leggere, più tempo */
export function frameMs(caption: string): number {
  return Math.min(9000, Math.max(4500, 2500 + caption.length * 38));
}

export function createFrameReducer(total: number) {
  const clamp = (index: number) => Math.max(0, Math.min(index, total - 1));
  return (state: FrameState, action: FrameAction): FrameState => {
    switch (action.type) {
      case 'tick': {
        if (!state.playing) return state;
        const index = clamp(state.index + 1);
        return { index, playing: index < total - 1 };
      }
      case 'toggle':
        if (isLastFrame(state, total)) return { index: 0, playing: true };
        return { ...state, playing: !state.playing };
      case 'next':
        return { index: clamp(state.index + 1), playing: false };
      case 'prev':
        return { index: clamp(state.index - 1), playing: false };
      case 'seek':
        return { index: clamp(action.index), playing: false };
      case 'restart':
        return { index: 0, playing: true };
    }
  };
}
