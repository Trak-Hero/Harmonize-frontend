import { useEffect, useRef } from 'react';
import cloud from 'd3-cloud';
import * as d3 from 'd3';

export default function GenreCloud({ histogram, unlistened }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!histogram) return;

    const data = [
      ...Object.entries(histogram).map(([g, c]) => ({
        text: g,
        size: 18 + Math.sqrt(c) * 6,  
        listened: true,
      })),
      ...unlistened.map(g => ({
        text: g,
        size: 14,                     
        listened: false,
      })),
    ];

    const layout = cloud()
      .size([window.innerWidth * 0.95, 600]) 
      .words(data)
      .padding(6)
      .rotate(() => 0)
      .font('Inter')
      .fontSize(d => d.size)
      .on('end', draw);

    layout.start();

    function draw(words) {
      const svg = d3.select(ref.current)
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .attr('viewBox', [
          -layout.size()[0] / 2,
          -layout.size()[1] / 2,
          layout.size()[0],
          layout.size()[1],
        ])
        .style('font-family', 'Inter')
        .style('cursor', 'default');

      svg.selectAll('text')
        .data(words)
        .join('text')
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .style('font-size', d => `${d.size}px`)
        .style('fill', (d, i) =>
          d.listened
            ? `hsl(${(i * 30) % 360} 70% 60%)`
            : '#666')
        .style('opacity', d => (d.listened ? 1 : 0.25))
        .text(d => d.text);
    }
  }, [histogram, unlistened]);

  return (
    <div className="mt-16 flex justify-center">
      <svg ref={ref} className="max-w-[1200px]" />
    </div>
  );
}
