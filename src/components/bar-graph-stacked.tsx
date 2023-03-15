import { useEffect, useRef } from "react";
import { useResizeObserver } from "./graph-utilities";
import * as d3 from "d3";

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
    const svg = d3.select(svgRef.current);

    const cumSum = [0].concat(...d3.cumsum(data));

    // domain is [0,100] because max position is 100 (for a 100g sample)
    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, dimensions.width]);

    const colors = data.map((_d, i) => `hsl(0,0%,${i * (100 / data.length)}%)`);

    // create legend
    // clear legend
    svg.selectAll(".legend-item").remove();
    const itemSpacing = 20;
    const itemSpacingInner = 3;
    const leftOffset = 5;
    for (let i = 0; i < labels.length; i++) {
      const legendItem = svg
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", () => {
          // get the previous legendItem's placement
          const offset =
            i > 0
              ? svg
                  .selectAll(".legend-item>text")
                  ._groups[0][i - 1].getComputedTextLength() +
                svg.selectAll(".legend-item>text")._groups[0][i - 1].x
                  .baseVal[0].value +
                svg.selectAll(".legend-item")._groups[0][i - 1].transform
                  .baseVal[0].matrix.e
              : 0;

          return `translate(${offset + (i > 0 ? itemSpacing : leftOffset)},${
            dimensions.height + 5
          })`;
        });
      const rect = legendItem
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", colors[i]);
      legendItem
        .append("text")
        .text(labels[i])
        .attr("font-size", "10px")
        .attr("x", rect._groups[0][0].width.baseVal.value + itemSpacingInner)
        .attr("y", 9);
    }

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("data-index", (_: number, i: number) => i)
      .attr("x", (_: number, i: number) => xScale(cumSum[i]))
      .attr("width", (v: number) => xScale(v))
      .attr("height", dimensions.height)
      .attr("fill", (_: any, i: number) => colors[i])
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
    <div className="max-w-full h-full space-y-[10px] flex flex-col pb-[15px]">
      <p className="text-[12px]">{title}</p>
      <svg ref={svgRef} className="w-full h-full overflow-visible border">
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
