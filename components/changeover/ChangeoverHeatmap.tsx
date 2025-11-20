'use client';

import React from 'react';
import type { ChangeoverCell, SKU } from '@/types';

interface ChangeoverHeatmapProps {
  matrix: ChangeoverCell[];
  skus: SKU[];
}

export default function ChangeoverHeatmap({ matrix, skus }: ChangeoverHeatmapProps) {
  // Get unique SKUs that appear in the matrix
  const uniqueSKUIdsFrom = [...new Set(matrix.map(c => c.fromSKUId))];
  const uniqueSKUIdsTo = [...new Set(matrix.map(c => c.toSKUId))];
  
  // Limit to first 15 SKUs for display
  const displaySKUs = skus.filter(s => 
    uniqueSKUIdsFrom.includes(s.id) || uniqueSKUIdsTo.includes(s.id)
  ).slice(0, 15);

  const CELL_SIZE = 50;
  const LABEL_WIDTH = 150;
  const LABEL_HEIGHT = 80;

  // Get color based on time
  const getColor = (minutes: number): string => {
    if (minutes === 0) return '#f0f0f0';
    if (minutes < 15) return '#52c41a'; // Green
    if (minutes < 30) return '#faad14'; // Orange
    if (minutes < 60) return '#ff7a45'; // Light red
    return '#ff4d4f'; // Red
  };

  // Create matrix lookup
  const matrixLookup: Record<string, ChangeoverCell> = {};
  matrix.forEach(cell => {
    matrixLookup[`${cell.fromSKUId}-${cell.toSKUId}`] = cell;
  });

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '700px' }}>
      <svg
        width={LABEL_WIDTH + displaySKUs.length * CELL_SIZE}
        height={LABEL_HEIGHT + displaySKUs.length * CELL_SIZE}
      >
        {/* Column headers (To SKUs) */}
        {displaySKUs.map((sku, i) => (
          <g key={`col-header-${sku.id}`}>
            <text
              x={LABEL_WIDTH + i * CELL_SIZE + CELL_SIZE / 2}
              y={LABEL_HEIGHT - 10}
              fontSize="10"
              fill="#666"
              textAnchor="middle"
              transform={`rotate(-45 ${LABEL_WIDTH + i * CELL_SIZE + CELL_SIZE / 2} ${LABEL_HEIGHT - 10})`}
            >
              {sku.code}
            </text>
          </g>
        ))}

        {/* Row headers (From SKUs) */}
        {displaySKUs.map((sku, i) => (
          <g key={`row-header-${sku.id}`}>
            <text
              x={LABEL_WIDTH - 10}
              y={LABEL_HEIGHT + i * CELL_SIZE + CELL_SIZE / 2 + 5}
              fontSize="10"
              fill="#666"
              textAnchor="end"
            >
              {sku.code}
            </text>
          </g>
        ))}

        {/* Heatmap cells */}
        {displaySKUs.map((fromSKU, i) =>
          displaySKUs.map((toSKU, j) => {
            const cell = matrixLookup[`${fromSKU.id}-${toSKU.id}`];
            const time = cell?.time.total || 0;
            const color = getColor(time);

            return (
              <g key={`cell-${fromSKU.id}-${toSKU.id}`}>
                <rect
                  x={LABEL_WIDTH + j * CELL_SIZE}
                  y={LABEL_HEIGHT + i * CELL_SIZE}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={1}
                  style={{ cursor: 'pointer' }}
                >
                  <title>
                    {fromSKU.code} → {toSKU.code}: {time} min
                    {cell && `\nComplexity: ${cell.complexity}`}
                  </title>
                </rect>
                {time > 0 && (
                  <text
                    x={LABEL_WIDTH + j * CELL_SIZE + CELL_SIZE / 2}
                    y={LABEL_HEIGHT + i * CELL_SIZE + CELL_SIZE / 2 + 5}
                    fontSize="10"
                    fill={time > 30 ? '#fff' : '#000'}
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {time}
                  </text>
                )}
              </g>
            );
          })
        )}

        {/* Legend */}
        <g transform={`translate(${LABEL_WIDTH}, 20)`}>
          <text x="0" y="0" fontSize="12" fontWeight="600">Legend (minutes):</text>
          {[
            { color: '#52c41a', label: '< 15' },
            { color: '#faad14', label: '15-30' },
            { color: '#ff7a45', label: '30-60' },
            { color: '#ff4d4f', label: '60+' },
          ].map((item, i) => (
            <g key={item.label} transform={`translate(${i * 80}, 15)`}>
              <rect x="0" y="0" width="15" height="15" fill={item.color} />
              <text x="20" y="12" fontSize="10">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

