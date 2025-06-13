import type { _MapProps } from "react-kakao-maps-sdk";

export interface TransitionStore {
  map: _MapProps;
  titleTransitionRect: DOMRect | null;
  contentTransitionRect: DOMRect | null;
  setMap: (position: _MapProps) => void;
  setTitleTransitionRect: (rect: DOMRect | null) => void;
  setContentTransitionRect: (rect: DOMRect | null) => void;
}
