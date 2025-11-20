'use client';

import React, { useState } from 'react';
import { Card, Segmented, Select, Space, Statistic, Row, Col, Button } from 'antd';
import {
  HeatMapOutlined,
  TableOutlined,
  BranchesOutlined,
  CalculatorOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { getMockChangeoverMatrix, getMockSKUs, PRODUCT_FAMILIES } from '@/lib/mock-data';
import ChangeoverHeatmap from '@/components/changeover/ChangeoverHeatmap';
import ChangeoverTable from '@/components/changeover/ChangeoverTable';
import ChangeoverStats from '@/components/changeover/ChangeoverStats';
import type { ProductFamily } from '@/types';

export default function ChangeoversPage() {
  const [viewMode, setViewMode] = useState<'heatmap' | 'table' | 'flow'>('heatmap');
  const [selectedFamily, setSelectedFamily] = useState<ProductFamily | null>(null);
  
  const changeoverMatrix = getMockChangeoverMatrix();
  const skus = getMockSKUs(30);
  
  // Filter by family if selected
  const filteredMatrix = selectedFamily
    ? changeoverMatrix.filter(
        cell =>
          skus.find(s => s.id === cell.fromSKUId)?.family === selectedFamily ||
          skus.find(s => s.id === cell.toSKUId)?.family === selectedFamily
      )
    : changeoverMatrix;

  // Calculate statistics
  const avgChangeoverTime = filteredMatrix.reduce((sum, cell) => sum + cell.time.total, 0) / filteredMatrix.length;
  const maxChangeoverTime = Math.max(...filteredMatrix.map(cell => cell.time.total));
  const minChangeoverTime = Math.min(...filteredMatrix.filter(c => c.time.total > 0).map(cell => cell.time.total));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
          Changeover Matrix
        </h1>
        <Space>
          <Select
            placeholder="All Families"
            allowClear
            style={{ width: 200 }}
            onChange={(value) => setSelectedFamily(value as ProductFamily | null)}
            value={selectedFamily}
            options={PRODUCT_FAMILIES.map(f => ({
              label: `Family ${f.code} - ${f.name}`,
              value: f.code,
            }))}
          />
          <Segmented
            value={viewMode}
            onChange={(value) => setViewMode(value as any)}
            options={[
              { label: 'Heatmap', value: 'heatmap', icon: <HeatMapOutlined /> },
              { label: 'Table', value: 'table', icon: <TableOutlined /> },
              { label: 'Flow', value: 'flow', icon: <BranchesOutlined /> },
            ]}
          />
          <Button icon={<CalculatorOutlined />}>
            Optimize Sequence
          </Button>
          <Button icon={<DownloadOutlined />}>
            Export
          </Button>
        </Space>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Average Changeover"
              value={avgChangeoverTime}
              precision={1}
              suffix="min"
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Fastest Changeover"
              value={minChangeoverTime}
              precision={0}
              suffix="min"
              valueStyle={{ fontSize: '24px', color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Longest Changeover"
              value={maxChangeoverTime}
              precision={0}
              suffix="min"
              valueStyle={{ fontSize: '24px', color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Pairs"
              value={filteredMatrix.length}
              valueStyle={{ fontSize: '24px', color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card styles={{ body: { padding: viewMode === 'heatmap' ? 24 : 0 } }}>
        {viewMode === 'heatmap' && (
          <ChangeoverHeatmap
            matrix={filteredMatrix}
            skus={skus}
          />
        )}
        {viewMode === 'table' && (
          <ChangeoverTable
            matrix={filteredMatrix}
            skus={skus}
          />
        )}
        {viewMode === 'flow' && (
          <div style={{ padding: 24, textAlign: 'center', height: 400 }}>
            <p>Flow visualization coming soon...</p>
          </div>
        )}
      </Card>

      {/* Additional Statistics */}
      <ChangeoverStats matrix={filteredMatrix} skus={skus} />
    </div>
  );
}

