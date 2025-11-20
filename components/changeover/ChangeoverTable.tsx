'use client';

import React from 'react';
import { Table, Tag } from 'antd';
import type { ChangeoverCell, SKU } from '@/types';
import type { ColumnsType } from 'antd/es/table';

interface ChangeoverTableProps {
  matrix: ChangeoverCell[];
  skus: SKU[];
}

export default function ChangeoverTable({ matrix, skus }: ChangeoverTableProps) {
  // Create SKU lookup
  const skuLookup: Record<string, SKU> = {};
  skus.forEach(sku => {
    skuLookup[sku.id] = sku;
  });

  const columns: ColumnsType<ChangeoverCell> = [
    {
      title: 'From SKU',
      dataIndex: 'fromSKU',
      key: 'fromSKU',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'To SKU',
      dataIndex: 'toSKU',
      key: 'toSKU',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Drain',
      dataIndex: ['time', 'drain'],
      key: 'drain',
      width: 80,
      sorter: (a, b) => a.time.drain - b.time.drain,
      render: (val: number) => `${val} min`,
    },
    {
      title: 'Clean',
      dataIndex: ['time', 'clean'],
      key: 'clean',
      width: 80,
      sorter: (a, b) => a.time.clean - b.time.clean,
      render: (val: number) => `${val} min`,
    },
    {
      title: 'Setup',
      dataIndex: ['time', 'setup'],
      key: 'setup',
      width: 80,
      sorter: (a, b) => a.time.setup - b.time.setup,
      render: (val: number) => `${val} min`,
    },
    {
      title: 'Flush',
      dataIndex: ['time', 'flush'],
      key: 'flush',
      width: 80,
      sorter: (a, b) => a.time.flush - b.time.flush,
      render: (val: number) => `${val} min`,
    },
    {
      title: 'Total',
      dataIndex: ['time', 'total'],
      key: 'total',
      width: 100,
      sorter: (a, b) => a.time.total - b.time.total,
      render: (val: number) => (
        <strong style={{
          color: val < 15 ? '#52c41a' : val < 30 ? '#faad14' : val < 60 ? '#ff7a45' : '#ff4d4f'
        }}>
          {val} min
        </strong>
      ),
    },
    {
      title: 'Complexity',
      dataIndex: 'complexity',
      key: 'complexity',
      width: 120,
      filters: [
        { text: 'Simple', value: 'SIMPLE' },
        { text: 'Moderate', value: 'MODERATE' },
        { text: 'Complex', value: 'COMPLEX' },
        { text: 'Critical', value: 'CRITICAL' },
      ],
      onFilter: (value, record) => record.complexity === value,
      render: (complexity: string) => {
        const colors: Record<string, string> = {
          SIMPLE: 'green',
          MODERATE: 'blue',
          COMPLEX: 'orange',
          CRITICAL: 'red',
        };
        return <Tag color={colors[complexity]}>{complexity}</Tag>;
      },
    },
    {
      title: 'Cleaning Type',
      dataIndex: 'cleaningType',
      key: 'cleaningType',
      width: 150,
      render: (type: string) => <Tag>{type.replace(/_/g, ' ')}</Tag>,
    },
    {
      title: 'Labor',
      dataIndex: 'laborCount',
      key: 'laborCount',
      width: 80,
      sorter: (a, b) => a.laborCount - b.laborCount,
      render: (count: number) => `${count} person${count > 1 ? 's' : ''}`,
    },
    {
      title: 'Confidence',
      dataIndex: ['validation', 'confidence'],
      key: 'confidence',
      width: 120,
      sorter: (a, b) => a.validation.confidence - b.validation.confidence,
      render: (confidence: number) => (
        <span style={{ 
          color: confidence > 0.85 ? '#52c41a' : confidence > 0.7 ? '#faad14' : '#ff4d4f' 
        }}>
          {(confidence * 100).toFixed(0)}%
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={matrix.filter(c => c.time.total > 0)} // Only show non-zero changeovers
      rowKey="id"
      scroll={{ x: 1400 }}
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} changeovers`,
        defaultPageSize: 20,
      }}
      size="small"
    />
  );
}

