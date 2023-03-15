import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import * as d3 from "d3";

const useResizeObserver = (ref: React.RefObject<SVGSVGElement>) => {
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

const truncateSVGText = (element: SVGTextElement, maxWidth: number) => {
  // must be called after text and all text attributes/styles are assigned
  if (element.getComputedTextLength() < maxWidth) return;
  if (maxWidth < 0) throw Error("maxWidth cannot be less than 0");

  element.textContent += "...";
  console.log("hi");
  while (element.getComputedTextLength() > maxWidth) {
    element.textContent = element.textContent
      ? element.textContent.length <= 3
        ? element.textContent.slice(0, -1)
        : element.textContent.slice(0, -4) + element.textContent.slice(-3)
      : "";
  }
};

export { useResizeObserver, truncateSVGText };
