'use client';

import React from 'react';
import { Drawer, Descriptions, Tag, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { SKU } from '@/types';
import { PRODUCT_FAMILIES } from '@/lib/mock-data';

interface SKUQuickViewProps {
  sku?: SKU;
  visible: boolean;
  onClose: () => void;
  onEdit: (sku: SKU) => void;
}

export default function SKUQuickView({ sku, visible, onClose, onEdit }: SKUQuickViewProps) {
  if (!sku) return null;

  const familyInfo = PRODUCT_FAMILIES.find(f => f.code === sku.family);

  return (
    <Drawer
      title="SKU Details"
      placement="right"
      width={600}
      onClose={onClose}
      open={visible}
      extra={
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => onEdit(sku)}
        >
          Edit
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Basic Information */}
        <div>
          <h3 style={{ marginBottom: 16 }}>Basic Information</h3>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="SKU Code">
              <strong>{sku.code}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Name">{sku.name}</Descriptions.Item>
            <Descriptions.Item label="Description">{sku.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="Family">
              <Tag color={familyInfo?.color}>
                Family {sku.family} - {familyInfo?.name}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Category">{sku.category}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={sku.status === 'ACTIVE' ? 'green' : 'default'}>
                {sku.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Production */}
        <div>
          <h3 style={{ marginBottom: 16 }}>Production Parameters</h3>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Standard Rate">
              {sku.production.standardRate.toLocaleString()} units/hr
            </Descriptions.Item>
            <Descriptions.Item label="Yield">
              {sku.production.yieldPercentage}%
            </Descriptions.Item>
            <Descriptions.Item label="Min Batch">
              {sku.production.minBatch.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Max Batch">
              {sku.production.maxBatch.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Setup Time">
              {sku.production.setupTime} min
            </Descriptions.Item>
            <Descriptions.Item label="Cycle Time">
              {sku.production.cycleTime} sec
            </Descriptions.Item>
            <Descriptions.Item label="Quality Grade">
              <Tag>{sku.production.qualityGrade}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Attributes */}
        <div>
          <h3 style={{ marginBottom: 16 }}>Product Attributes</h3>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Packaging">
              {sku.attributes.packaging || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Temperature">
              {sku.attributes.temperature || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Weight">
              {sku.attributes.weight ? `${sku.attributes.weight}g` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Volume">
              {sku.attributes.volume ? `${sku.attributes.volume}ml` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Allergens" span={2}>
              {sku.attributes.allergens && sku.attributes.allergens.length > 0 ? (
                <Space>
                  {sku.attributes.allergens.map(a => (
                    <Tag key={a} color="red">{a}</Tag>
                  ))}
                </Space>
              ) : (
                'None'
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Planning */}
        <div>
          <h3 style={{ marginBottom: 16 }}>Planning Parameters</h3>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Lead Time">
              {sku.planning.leadTime} hrs
            </Descriptions.Item>
            <Descriptions.Item label="Shelf Life">
              {sku.planning.shelfLife || '-'} days
            </Descriptions.Item>
            <Descriptions.Item label="Safety Stock">
              {sku.planning.safetyStock.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Reorder Point">
              {sku.planning.reorderPoint.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Cleaning Requirement">
              <Tag color={
                sku.planning.cleaningRequirement === 'A' ? 'green' :
                sku.planning.cleaningRequirement === 'B' ? 'blue' :
                sku.planning.cleaningRequirement === 'C' ? 'orange' : 'red'
              }>
                Category {sku.planning.cleaningRequirement}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Line Compatibility */}
        <div>
          <h3 style={{ marginBottom: 16 }}>Line Compatibility</h3>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Allowed Lines">
              <Space>
                {sku.compatibility.allowedLines.map(lineId => (
                  <Tag key={lineId}>{lineId}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Preferred Lines">
              <Space>
                {sku.compatibility.preferredLines.map(lineId => (
                  <Tag key={lineId} color="blue">{lineId}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Financial */}
        <div>
          <h3 style={{ marginBottom: 16 }}>Financial Information</h3>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Unit Cost">
              ${sku.financial.unitCost.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Selling Price">
              ${sku.financial.sellingPrice.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Margin">
              {sku.financial.margin.toFixed(2)}%
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag color={
                sku.financial.priority === 'high' ? 'red' :
                sku.financial.priority === 'medium' ? 'orange' : 'green'
              }>
                {sku.financial.priority}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Space>
    </Drawer>
  );
}

