import { create } from "zustand";
import type { TransitionStore } from "./type";
import type { _MapProps } from "react-kakao-maps-sdk";

export default create<TransitionStore>((set) => ({
  map: { center: { lat: 0, lng: 0 }, isPanto: false },
  titleTransitionRect: null,
  contentTransitionRect: null,
  setMap: (map: _MapProps) => set({ map }),
  setTitleTransitionRect: (titleTransitionRect) => set({ titleTransitionRect }),
  setContentTransitionRect: (contentTransitionRect) =>
    set({ contentTransitionRect }),
}));
