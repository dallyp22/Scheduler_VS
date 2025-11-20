'use client';

import React from 'react';
import { Card, Row, Col, Table } from 'antd';
import type { ChangeoverCell, SKU } from '@/types';
import { ChangeoverComplexity } from '@/types/enums';

interface ChangeoverStatsProps {
  matrix: ChangeoverCell[];
  skus: SKU[];
}

export default function ChangeoverStats({ matrix, skus }: ChangeoverStatsProps) {
  // Calculate complexity breakdown
  const complexityBreakdown = {
    [ChangeoverComplexity.SIMPLE]: matrix.filter(c => c.complexity === ChangeoverComplexity.SIMPLE).length,
    [ChangeoverComplexity.MODERATE]: matrix.filter(c => c.complexity === ChangeoverComplexity.MODERATE).length,
    [ChangeoverComplexity.COMPLEX]: matrix.filter(c => c.complexity === ChangeoverComplexity.COMPLEX).length,
    [ChangeoverComplexity.CRITICAL]: matrix.filter(c => c.complexity === ChangeoverComplexity.CRITICAL).length,
  };

  // Find top 10 fastest changeovers
  const fastest = [...matrix]
    .filter(c => c.time.total > 0)
    .sort((a, b) => a.time.total - b.time.total)
    .slice(0, 10);

  // Find top 10 slowest changeovers
  const slowest = [...matrix]
    .sort((a, b) => b.time.total - a.time.total)
    .slice(0, 10);

  return (
    <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
      <Col span={8}>
        <Card title="Complexity Distribution" size="small">
          <div>
            {Object.entries(complexityBreakdown).map(([key, value]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>{key}</span>
                  <span>{value}</span>
                </div>
                <div style={{ 
                  height: 8, 
                  background: '#f0f0f0', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(value / matrix.length) * 100}%`,
                    background: 
                      key === ChangeoverComplexity.SIMPLE ? '#52c41a' :
                      key === ChangeoverComplexity.MODERATE ? '#1890ff' :
                      key === ChangeoverComplexity.COMPLEX ? '#faad14' : '#ff4d4f',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Col>

      <Col span={8}>
        <Card title="Top 10 Fastest Changeovers" size="small">
          <Table
            dataSource={fastest}
            columns={[
              {
                title: 'From → To',
                key: 'pair',
                render: (_, record) => `${record.fromSKU} → ${record.toSKU}`,
              },
              {
                title: 'Time',
                dataIndex: ['time', 'total'],
                key: 'time',
                render: (val: number) => (
                  <span style={{ color: '#52c41a', fontWeight: 600 }}>
                    {val} min
                  </span>
                ),
              },
            ]}
            pagination={false}
            size="small"
            rowKey="id"
          />
        </Card>
      </Col>

      <Col span={8}>
        <Card title="Top 10 Slowest Changeovers" size="small">
          <Table
            dataSource={slowest}
            columns={[
              {
                title: 'From → To',
                key: 'pair',
                render: (_, record) => `${record.fromSKU} → ${record.toSKU}`,
              },
              {
                title: 'Time',
                dataIndex: ['time', 'total'],
                key: 'time',
                render: (val: number) => (
                  <span style={{ color: '#ff4d4f', fontWeight: 600 }}>
                    {val} min
                  </span>
                ),
              },
            ]}
            pagination={false}
            size="small"
            rowKey="id"
          />
        </Card>
      </Col>
    </Row>
  );
}

