import type { _MapProps } from "react-kakao-maps-sdk";

export interface TransitionStore {
  position: _MapProps["center"];
  titleTransitionRect: DOMRect | null;
  contentTransitionRect: DOMRect | null;
  setPosition: (position: _MapProps["center"]) => void;
  setTitleTransitionRect: (rect: DOMRect | null) => void;
  setContentTransitionRect: (rect: DOMRect | null) => void;
}
