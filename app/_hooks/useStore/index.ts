import { create } from "zustand";
import type { TransitionStore } from "./type";
import type { _MapProps } from "react-kakao-maps-sdk";

export default create<TransitionStore>((set) => ({
  position: { lat: 0, lng: 0 },
  titleTransitionRect: null,
  contentTransitionRect: null,
  setPosition: (position: _MapProps["center"]) => set({ position }),
  setTitleTransitionRect: (titleTransitionRect) => set({ titleTransitionRect }),
  setContentTransitionRect: (contentTransitionRect) =>
    set({ contentTransitionRect }),
}));
