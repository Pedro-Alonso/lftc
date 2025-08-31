"use client";

import React from "react";
import ReactDraggable, { DraggableEventHandler } from "react-draggable";

interface Props {
  children: React.ReactNode;
  handle?: string;
  nodeRef?: React.RefObject<HTMLDivElement>;
  defaultPosition?: { x: number; y: number };
  onDrag?: DraggableEventHandler;
  onStart?: DraggableEventHandler;
  onStop?: DraggableEventHandler;
}

export const Draggable = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      handle = ".handle",
      defaultPosition,
      nodeRef,
      onDrag,
      onStart,
      onStop,
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);

    const elementRef = nodeRef || internalRef;

    React.useImperativeHandle(forwardedRef, () => elementRef.current!, [
      elementRef,
    ]);

    return (
      <ReactDraggable
        onDrag={onDrag}
        onStart={onStart}
        onStop={onStop}
        nodeRef={elementRef as React.RefObject<HTMLElement>}
        handle={handle}
        defaultPosition={defaultPosition}
      >
        <div ref={elementRef}>{children}</div>
      </ReactDraggable>
    );
  }
);

Draggable.displayName = "Draggable";
