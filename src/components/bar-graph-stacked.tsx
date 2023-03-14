import { useEffect, useRef } from "react";
import { useResizeObserver } from "./graph-utilities";
import { select, cumsum, scaleLinear } from "d3";

interface Props {
  title: string;
  data: number[];
  units: string[];
  labels: string[];
}

export const BarGraphStacked = ({ title, data, units, labels }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = useResizeObserver(svgRef);

  useEffect(() => {
    if (!dimensions) return;
    const svg = select(svgRef.current);

    const cumSum = [0].concat(...cumsum(data));

    // domain is [0,100] because max position is 100 (for a 100g sample)
    const xScale = scaleLinear().domain([0, 100]).range([0, dimensions.width]);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("data-index", (_: number, i: number) => i)
      .attr("x", (_: number, i: number) => xScale(cumSum[i]))
      .attr("width", (v: number) => xScale(v))
      .attr("height", dimensions.height)
      .attr(
        "fill",
        (_: any, i: number) => `hsl(0,0%,${i * (100 / data.length)}%)`
      )
      .on("mouseenter", function (event: any, value: number) {
        svg
          .selectAll("data-label")
          .data([value])
          .join("text")
          .attr("class", "data-label")
          .text(
            (v: number) =>
              `${labels[event.target.dataset.index]} ${v} ${
                units[event.target.dataset.index]
              }`
          )
          .style("font-size", "10px")
          .attr("y", -2)
          .attr("x", (v: number, i: number, nodes: any) => {
            const textWidth = nodes[0].getComputedTextLength();
            const remainingSpace = xScale(
              100 - cumSum[event.target.dataset.index]
            );
            return xScale(
              (textWidth < remainingSpace ? 0 : v) +
                cumSum[event.target.dataset.index]
            );
          })
          .attr("text-anchor", (v: number, i: number, nodes: any) => {
            const textWidth = nodes[0].getComputedTextLength();
            const remainingSpace = xScale(
              100 - cumSum[event.target.dataset.index]
            );
            return textWidth < remainingSpace ? "start" : "end";
          });
      })
      .on("mouseleave", () => svg.selectAll(".data-label").remove());

    return () => {
      svg.selectAll("rect").remove();
    };
  });

  return (
    <div className="w-full space-y-[10px]">
      <p className="text-[10px]">{title}</p>
      <svg ref={svgRef} className="w-full h-full overflow-visible border">
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
