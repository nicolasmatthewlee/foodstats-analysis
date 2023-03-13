import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

export const useResizeObserver = (ref: React.RefObject<SVGSVGElement>) => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      setDimensions(entries[0].contentRect);
    });
    if (observeTarget) resizeObserver.observe(observeTarget);
    return () => {
      if (observeTarget) resizeObserver.unobserve(observeTarget); // cleanup
    };
  }, [ref]);
  return dimensions;
};
