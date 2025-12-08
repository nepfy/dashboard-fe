"use client";

import type { CSSProperties } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Placement = "top" | "bottom" | "left" | "right";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  trianglePosition?: string;
  preferredPlacement?: Placement;
  offset?: {
    top?: number;
    left?: number;
  };
  anchorRect?: DOMRect | null;
}

const GAP = 12;
const VIEWPORT_PADDING = 12;
const ARROW_SIZE = 12;
const PANEL_Z_INDEX = 2000;

const clamp = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) return min;
  if (min > max) return min;
  return Math.min(Math.max(value, min), max);
};

const getViewportMetrics = () => {
  if (typeof window === "undefined") {
    return {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    };
  }

  const viewport = window.visualViewport;
  return {
    width: viewport?.width ?? window.innerWidth,
    height: viewport?.height ?? window.innerHeight,
    left: viewport?.offsetLeft ?? 0,
    top: viewport?.offsetTop ?? 0,
  };
};

const placements: Placement[] = ["bottom", "top", "right", "left"];

export default function EditableModal({
  isOpen,
  children,
  className,
  preferredPlacement,
  offset,
  anchorRect,
  ...deprecatedProps
}: ModalProps) {
  void deprecatedProps;
  const anchorRectProp = anchorRect;
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [isPositioned, setIsPositioned] = useState(false);
  const [arrowStyle, setArrowStyle] = useState<CSSProperties | null>(null);
  const rafRef = useRef<number | null>(null);
  const offsetTop = offset?.top ?? 0;
  const offsetLeft = offset?.left ?? 0;

  // Block page scroll when modal is open (mobile behaviour)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsPositioned(false);
      setArrowStyle(null);
    }
  }, [isOpen]);

  const updatePosition = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!isOpen) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = window.requestAnimationFrame(() => {
      const container = placeholderRef.current;
      const panel = panelRef.current;

      if (!container || !panel) return;

      const anchor = container.parentElement;
      const activeAnchorRect =
        anchorRectProp ?? anchor?.getBoundingClientRect() ?? null;
      const viewportMetrics = getViewportMetrics();
      const { width: viewportWidth, height: viewportHeight } = viewportMetrics;
      const viewportLeft = viewportMetrics.left;
      const viewportTop = viewportMetrics.top;

      const panelRect = panel.getBoundingClientRect();
      const panelWidth = panelRect.width;
      const panelHeight = panelRect.height;

      // Fallback: if no anchor available, center in viewport
      if (!activeAnchorRect) {
        const navigationHeight = window.innerWidth < 640 ? 56 : 66;
        const topSafeArea = viewportTop + navigationHeight + VIEWPORT_PADDING;
        const centeredTop = viewportTop + viewportHeight / 2 - panelHeight / 2;
        const centeredLeft = viewportLeft + viewportWidth / 2 - panelWidth / 2;
        const clamped = {
          top: clamp(
            centeredTop + offsetTop,
            topSafeArea,
            viewportTop + viewportHeight - panelHeight - VIEWPORT_PADDING
          ),
          left: clamp(
            centeredLeft + offsetLeft,
            viewportLeft + VIEWPORT_PADDING,
            viewportLeft + viewportWidth - panelWidth - VIEWPORT_PADDING
          ),
        };
        setPosition(clamped);
        setIsPositioned(true);
        setArrowStyle(null);
        return;
      }

      const anchorCenterX =
        activeAnchorRect.left + activeAnchorRect.width / 2;
      const anchorCenterY =
        activeAnchorRect.top + activeAnchorRect.height / 2;

      const navigationHeight = window.innerWidth < 640 ? 56 : 66;
      const topSafeArea = viewportTop + navigationHeight + VIEWPORT_PADDING;

      const availableSpace: Record<Placement, number> = {
        bottom: viewportTop + viewportHeight - activeAnchorRect.bottom,
        top: activeAnchorRect.top - viewportTop,
        right: viewportLeft + viewportWidth - activeAnchorRect.right,
        left: activeAnchorRect.left - viewportLeft,
      };

      const preferredOrder = preferredPlacement
        ? [
            preferredPlacement,
            ...placements.filter(
              (placementOption) => placementOption !== preferredPlacement
            ),
          ]
        : placements;

      const sortedBySpace = [...placements].sort(
        (a, b) => availableSpace[b] - availableSpace[a]
      );

      const candidatePlacements: Placement[] = [
        ...preferredOrder,
        ...sortedBySpace.filter(
          (placementOption) => !preferredOrder.includes(placementOption)
        ),
      ].filter(
        (placementOption, index, array) =>
          array.indexOf(placementOption) === index
      );

      const computeCoords = (targetPlacement: Placement) => {
        switch (targetPlacement) {
          case "bottom": {
            const top = activeAnchorRect.bottom + GAP;
            const left = anchorCenterX - panelWidth / 2;
            return { top, left };
          }
          case "top": {
            const top = activeAnchorRect.top - panelHeight - GAP;
            const left = anchorCenterX - panelWidth / 2;
            return { top, left };
          }
          case "right": {
            const left = activeAnchorRect.right + GAP;
            const top = anchorCenterY - panelHeight / 2;
            return { top, left };
          }
          case "left": {
            const left = activeAnchorRect.left - panelWidth - GAP;
            const top = anchorCenterY - panelHeight / 2;
            return { top, left };
          }
          default:
            return {
              top: viewportTop + VIEWPORT_PADDING,
              left: viewportLeft + VIEWPORT_PADDING,
            };
        }
      };

      const fitsViewport = (
        targetPlacement: Placement,
        coords: {
          top: number;
          left: number;
        }
      ) => {
        switch (targetPlacement) {
          case "bottom":
            return (
              coords.top + panelHeight <=
              viewportTop + viewportHeight - VIEWPORT_PADDING
            );
          case "top":
            return coords.top >= topSafeArea;
          case "right":
            return (
              coords.left + panelWidth <=
              viewportLeft + viewportWidth - VIEWPORT_PADDING
            );
          case "left":
            return coords.left >= viewportLeft + VIEWPORT_PADDING;
          default:
            return true;
        }
      };

      const clampCoords = (coords: { top: number; left: number }) => {
        const clampedTop = clamp(
          coords.top + offsetTop,
          topSafeArea,
          viewportTop + viewportHeight - panelHeight - VIEWPORT_PADDING
        );
        const clampedLeft = clamp(
          coords.left + offsetLeft,
          viewportLeft + VIEWPORT_PADDING,
          viewportLeft + viewportWidth - panelWidth - VIEWPORT_PADDING
        );
        return {
          top: clampedTop,
          left: clampedLeft,
        };
      };

      let chosenPlacement = candidatePlacements[0];
      let chosenCoords = computeCoords(chosenPlacement);

      for (const candidate of candidatePlacements) {
        const candidateCoords = computeCoords(candidate);
        if (fitsViewport(candidate, candidateCoords)) {
          chosenPlacement = candidate;
          chosenCoords = candidateCoords;
          break;
        }
      }

      chosenCoords = clampCoords(chosenCoords);

      const backgroundColor =
        window.getComputedStyle(panel).backgroundColor || "#ffffff";

      const anchorCenterWithinModalX = clamp(
        anchorCenterX,
        chosenCoords.left + ARROW_SIZE + 4,
        chosenCoords.left + panelWidth - ARROW_SIZE - 4
      );

      const anchorCenterWithinModalY = clamp(
        anchorCenterY,
        chosenCoords.top + ARROW_SIZE + 4,
        chosenCoords.top + panelHeight - ARROW_SIZE - 4
      );

      const baseArrowStyle: CSSProperties = {
        position: "fixed",
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: PANEL_Z_INDEX,
      };

      let nextArrowStyle: CSSProperties | null = null;

      switch (chosenPlacement) {
        case "bottom":
          nextArrowStyle = {
            ...baseArrowStyle,
            top: chosenCoords.top - ARROW_SIZE + 1,
            left: anchorCenterWithinModalX,
            transform: "translateX(-50%)",
            borderLeft: `${ARROW_SIZE}px solid transparent`,
            borderRight: `${ARROW_SIZE}px solid transparent`,
            borderBottom: `${ARROW_SIZE}px solid ${backgroundColor}`,
          };
          break;
        case "top":
          nextArrowStyle = {
            ...baseArrowStyle,
            top: chosenCoords.top + panelHeight - 1,
            left: anchorCenterWithinModalX,
            transform: "translateX(-50%)",
            borderLeft: `${ARROW_SIZE}px solid transparent`,
            borderRight: `${ARROW_SIZE}px solid transparent`,
            borderTop: `${ARROW_SIZE}px solid ${backgroundColor}`,
          };
          break;
        case "right":
          nextArrowStyle = {
            ...baseArrowStyle,
            left: chosenCoords.left - ARROW_SIZE + 1,
            top: anchorCenterWithinModalY,
            transform: "translateY(-50%)",
            borderTop: `${ARROW_SIZE}px solid transparent`,
            borderBottom: `${ARROW_SIZE}px solid transparent`,
            borderRight: `${ARROW_SIZE}px solid ${backgroundColor}`,
          };
          break;
        case "left":
          nextArrowStyle = {
            ...baseArrowStyle,
            left: chosenCoords.left + panelWidth - 1,
            top: anchorCenterWithinModalY,
            transform: "translateY(-50%)",
            borderTop: `${ARROW_SIZE}px solid transparent`,
            borderBottom: `${ARROW_SIZE}px solid transparent`,
            borderLeft: `${ARROW_SIZE}px solid ${backgroundColor}`,
          };
          break;
        default:
          nextArrowStyle = null;
      }

      setPosition(chosenCoords);
      setIsPositioned(true);
      setArrowStyle(nextArrowStyle);
    });
  }, [isOpen, preferredPlacement, offsetLeft, offsetTop, anchorRectProp]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleUpdate = () => {
      updatePosition();
    };

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", handleUpdate);
    viewport?.addEventListener("scroll", handleUpdate);

    const anchorElement = placeholderRef.current?.parentElement;
    const observers: ResizeObserver[] = [];

    if (typeof ResizeObserver !== "undefined") {
      if (anchorElement) {
        const anchorObserver = new ResizeObserver(handleUpdate);
        anchorObserver.observe(anchorElement);
        observers.push(anchorObserver);
      }
      if (panelRef.current) {
        const panelObserver = new ResizeObserver(handleUpdate);
        panelObserver.observe(panelRef.current);
        observers.push(panelObserver);
      }
    }

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
      viewport?.removeEventListener("resize", handleUpdate);
      viewport?.removeEventListener("scroll", handleUpdate);
      observers.forEach((observer) => observer.disconnect());
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isOpen, updatePosition]);

  if (!isOpen) return null;

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    top: position.top,
    left: position.left,
    zIndex: PANEL_Z_INDEX,
    visibility: isPositioned ? "visible" : "hidden",
  };

  const arrowNode =
    arrowStyle && isPositioned ? (
      <div className="hidden lg:block" style={arrowStyle} />
    ) : null;

  return (
    <>
      {/* Mobile backdrop - only visible on mobile */}
      <div className="bg-filter fixed inset-0 z-[9999] lg:hidden" />

      {/* Mobile modal container - centered on mobile */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 lg:hidden">
        <div className="bg-white-neutral-light-100 h-[550px] w-full max-w-[360px] overflow-hidden rounded-[8px] border border-[#CDCDCD] px-4 py-6">
          {children}
        </div>
      </div>

      {/* Desktop placeholder to locate anchor element */}
      <div ref={placeholderRef} className="hidden lg:block">
        {arrowNode}
        <div
          ref={panelRef}
          className={`bg-white-neutral-light-100 h-[550px] w-full overflow-hidden rounded-[8px] border border-[#CDCDCD] px-4 py-6 sm:w-[360px] ${className ?? ""}`}
          style={panelStyle}
        >
          {children}
        </div>
      </div>
    </>
  );
}
