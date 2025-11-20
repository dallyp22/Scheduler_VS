'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Tooltip, Tag } from 'antd';
import type { ScheduleBlock, ProductionLine } from '@/types';
import { BlockStatus } from '@/types/enums';

interface InteractiveTimelineProps {
  blocks: ScheduleBlock[];
  lines: ProductionLine[];
  startDate: Date;
  endDate: Date;
  viewMode: 'day' | 'week';
}

const HOUR_WIDTH = 60; // pixels per hour
const LINE_HEIGHT = 60;
const HEADER_HEIGHT = 40;
const SIDEBAR_WIDTH = 200;

export default function InteractiveTimeline({
  blocks,
  lines,
  startDate,
  endDate,
  viewMode,
}: InteractiveTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  
  const activeLines = lines.filter(line => line.status === 'active');
  
  // Calculate time range
  const hours = viewMode === 'day' ? 24 : 24 * 7;
  const timelineWidth = hours * HOUR_WIDTH;
  const timelineHeight = activeLines.length * LINE_HEIGHT;
  
  // Generate hour markers
  const hourMarkers = Array.from({ length: hours + 1 }, (_, i) => {
    const hour = i % 24;
    const day = Math.floor(i / 24);
    return { hour, day, x: i * HOUR_WIDTH };
  });

  // Convert block to timeline position
  const getBlockPosition = (block: ScheduleBlock, lineIndex: number) => {
    const blockStart = block.startTime.getTime();
    const timelineStart = startDate.getTime();
    const hoursFromStart = (blockStart - timelineStart) / (1000 * 60 * 60);
    
    const x = hoursFromStart * HOUR_WIDTH;
    const y = lineIndex * LINE_HEIGHT + 10;
    const width = (block.duration / 60) * HOUR_WIDTH;
    const height = LINE_HEIGHT - 20;
    
    return { x, y, width, height };
  };

  // Get status color
  const getStatusColor = (status: BlockStatus): string => {
    const colors: Record<BlockStatus, string> = {
      [BlockStatus.PLANNED]: '#1890ff',
      [BlockStatus.READY]: '#13c2c2',
      [BlockStatus.CHANGEOVER]: '#faad14',
      [BlockStatus.RUNNING]: '#52c41a',
      [BlockStatus.COMPLETED]: '#95de64',
      [BlockStatus.DELAYED]: '#ff4d4f',
    };
    return colors[status] || '#d9d9d9';
  };

  useEffect(() => {
    // Scroll to current time
    if (containerRef.current) {
      const now = new Date();
      const hoursFromStart = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      const scrollX = Math.max(0, hoursFromStart * HOUR_WIDTH - 400);
      containerRef.current.scrollLeft = scrollX;
    }
  }, [startDate]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: timelineHeight + HEADER_HEIGHT + 40,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', width: timelineWidth + SIDEBAR_WIDTH, height: timelineHeight + HEADER_HEIGHT }}>
        {/* Time header */}
        <div 
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 3,
            background: '#fafafa',
            borderBottom: '2px solid #d9d9d9',
          }}
        >
          <div style={{ display: 'flex' }}>
            <div style={{ width: SIDEBAR_WIDTH, flexShrink: 0, borderRight: '1px solid #d9d9d9' }}>
              <div style={{ padding: '8px', fontWeight: 600, textAlign: 'center' }}>
                Production Lines
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <svg width={timelineWidth} height={HEADER_HEIGHT}>
                {hourMarkers.map((marker, i) => (
                  <g key={i}>
                    <line
                      x1={marker.x}
                      y1={0}
                      x2={marker.x}
                      y2={HEADER_HEIGHT}
                      stroke="#d9d9d9"
                      strokeWidth={marker.hour === 0 ? 2 : 1}
                    />
                    {marker.hour % 2 === 0 && (
                      <text
                        x={marker.x + 5}
                        y={HEADER_HEIGHT / 2 + 5}
                        fontSize="12"
                        fill="#666"
                      >
                        {viewMode === 'week' && marker.hour === 0 && marker.day > 0 
                          ? `Day ${marker.day + 1}` 
                          : `${marker.hour}:00`
                        }
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Timeline body */}
        <div style={{ display: 'flex' }}>
          {/* Line labels (sticky) */}
          <div
            style={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              position: 'sticky',
              left: 0,
              zIndex: 2,
              background: '#fff',
              borderRight: '1px solid #d9d9d9',
            }}
          >
            {activeLines.map((line, index) => (
              <div
                key={line.id}
                style={{
                  height: LINE_HEIGHT,
                  padding: '8px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontWeight: 600 }}>{line.code}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {(line.metrics.currentOEE || 0 * 100).toFixed(0)}% OEE
                </div>
              </div>
            ))}
          </div>

          {/* Timeline grid and blocks */}
          <div style={{ flex: 1, position: 'relative' }}>
            <svg width={timelineWidth} height={timelineHeight}>
              {/* Grid */}
              {hourMarkers.map((marker, i) => (
                <line
                  key={`grid-${i}`}
                  x1={marker.x}
                  y1={0}
                  x2={marker.x}
                  y2={timelineHeight}
                  stroke="#f0f0f0"
                  strokeWidth={marker.hour === 0 ? 2 : 1}
                />
              ))}
              
              {activeLines.map((_, index) => (
                <line
                  key={`line-${index}`}
                  x1={0}
                  y1={(index + 1) * LINE_HEIGHT}
                  x2={timelineWidth}
                  y2={(index + 1) * LINE_HEIGHT}
                  stroke="#f0f0f0"
                  strokeWidth={1}
                />
              ))}

              {/* Blocks */}
              {blocks.map(block => {
                const lineIndex = activeLines.findIndex(l => l.id === block.lineId);
                if (lineIndex === -1) return null;
                
                const pos = getBlockPosition(block, lineIndex);
                const color = block.color || getStatusColor(block.status);
                
                return (
                  <Tooltip
                    key={block.id}
                    title={
                      <div>
                        <div><strong>{block.order?.sku.code}</strong></div>
                        <div>Status: {block.status}</div>
                        <div>Duration: {block.duration} min</div>
                        {block.changeoverMinutes && (
                          <div>Changeover: {block.changeoverMinutes} min</div>
                        )}
                      </div>
                    }
                  >
                    <g
                      onMouseEnter={() => setHoveredBlock(block.id)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        x={pos.x}
                        y={pos.y}
                        width={pos.width}
                        height={pos.height}
                        fill={color}
                        stroke={hoveredBlock === block.id ? '#000' : 'transparent'}
                        strokeWidth={2}
                        rx={4}
                        opacity={0.8}
                      />
                      {pos.width > 60 && (
                        <text
                          x={pos.x + 8}
                          y={pos.y + pos.height / 2 + 5}
                          fontSize="11"
                          fill="#fff"
                          fontWeight="500"
                        >
                          {block.order?.sku.code}
                        </text>
                      )}
                    </g>
                  </Tooltip>
                );
              })}
              
              {/* Current time indicator */}
              {(() => {
                const now = new Date();
                const hoursFromStart = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60);
                const x = hoursFromStart * HOUR_WIDTH;
                
                if (x >= 0 && x <= timelineWidth) {
                  return (
                    <>
                      <line
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={timelineHeight}
                        stroke="#ff4d4f"
                        strokeWidth={2}
                        strokeDasharray="4"
                      />
                      <circle cx={x} cy={10} r={4} fill="#ff4d4f" />
                    </>
                  );
                }
                return null;
              })()}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

