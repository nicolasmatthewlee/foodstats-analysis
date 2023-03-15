import { useEffect, useRef } from "react";
import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";
import { useResizeObserver } from "./graph-utilities";

interface Props {
  title: string;
  data: number[];
  units: string[];
  labels: string[];
}

export const BarGraph = ({ title, data, units, labels }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = useResizeObserver(svgRef);

  useEffect(() => {
    if (!dimensions) return;
    const svg = select(svgRef.current);

    const xScale = scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, dimensions?.width])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, Math.max(...data)])
      .range([0, dimensions?.height]);
    const yAxisScale = scaleLinear()
      .domain([0, Math.max(...data)])
      .range([dimensions?.height, 0]);

    const xAxis = axisBottom(xScale).tickFormat((n: number) => labels[n]);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions?.height}px)`)
      .call(xAxis);

    const yAxis = axisLeft(yAxisScale).tickSizeOuter(0);
    svg.select(".y-axis").call(yAxis);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1,-1)")
      .attr("x", (_: any, i: number) => xScale(i))
      .attr("y", dimensions ? -dimensions.height : 0)
      .attr("width", xScale.bandwidth())
      .attr("height", (v: number) => yScale(v))
      .on("mouseenter", (event: any, value: number) => {
        svg
          .selectAll(".data-label")
          .data([value])
          .join("text")
          .attr("class", "data-label")
          .text((v: number, i: number) => `${v} ${units[i]}`)
          .attr("x", event.target.x.baseVal.value + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("y", yAxisScale(value) - 2)
          .style("font-size", "10px");
      })
      .on("mouseleave", () => svg.selectAll(".data-label").remove());
  }, [data, units, labels, dimensions]);

  return (
    <div className="w-full h-full space-y-[10px] flex flex-col">
      <p className="text-[12px]">{title}</p>
      <svg
        ref={svgRef}
        className="w-full h-full overflow-visible pl-[20px] pb-[18px] border-t border-white"
      >
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
