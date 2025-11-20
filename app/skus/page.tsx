'use client';

import React, { useState } from 'react';
import { Button, Space, Modal, message } from 'antd';
import { PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import type { SKU } from '@/types';
import { getMockSKUs, PRODUCT_FAMILIES } from '@/lib/mock-data';
import SKUEditor from '@/components/skus/SKUEditor';
import SKUQuickView from '@/components/skus/SKUQuickView';

export default function SKUsPage() {
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<SKU | undefined>();
  const [quickViewSKU, setQuickViewSKU] = useState<SKU | undefined>();
  
  const skus = getMockSKUs();

  const handleEdit = (sku: SKU) => {
    setSelectedSKU(sku);
    setEditorVisible(true);
  };

  const handleCreate = () => {
    setSelectedSKU(undefined);
    setEditorVisible(true);
  };

  const handleDelete = (sku: SKU) => {
    Modal.confirm({
      title: 'Delete SKU',
      content: `Are you sure you want to delete ${sku.code}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        message.success(`SKU ${sku.code} deleted successfully`);
      },
    });
  };

  const handleSave = (values: any) => {
    message.success(`SKU ${values.code} saved successfully`);
    setEditorVisible(false);
  };

  const columns: ProColumns<SKU>[] = [
    {
      title: 'SKU Code',
      dataIndex: 'code',
      key: 'code',
      fixed: 'left',
      width: 150,
      copyable: true,
      render: (text, record) => (
        <a onClick={() => setQuickViewSKU(record)}>
          {text}
        </a>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Family',
      dataIndex: 'family',
      key: 'family',
      width: 100,
      filters: PRODUCT_FAMILIES.map(f => ({ text: `Family ${f.code}`, value: f.code })),
      onFilter: (value, record) => record.family === value,
      render: (family) => {
        const familyInfo = PRODUCT_FAMILIES.find(f => f.code === family);
        return (
          <span 
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: familyInfo?.color || '#999',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            {family}
          </span>
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Production Rate',
      dataIndex: ['production', 'standardRate'],
      key: 'productionRate',
      width: 150,
      sorter: (a, b) => a.production.standardRate - b.production.standardRate,
      render: (_, record) => `${record.production.standardRate?.toLocaleString() || 0} units/hr`,
    },
    {
      title: 'Batch Size',
      key: 'batchSize',
      width: 150,
      render: (_, record) => `${record.production.minBatch} - ${record.production.maxBatch}`,
    },
    {
      title: 'Cleaning',
      dataIndex: ['planning', 'cleaningRequirement'],
      key: 'cleaning',
      width: 100,
      filters: [
        { text: 'Category A', value: 'A' },
        { text: 'Category B', value: 'B' },
        { text: 'Category C', value: 'C' },
        { text: 'Category D', value: 'D' },
      ],
      onFilter: (value, record) => record.planning.cleaningRequirement === value,
      render: (_, record) => {
        const cleaning = record.planning.cleaningRequirement;
        const colors: Record<string, string> = {
          A: '#52c41a',
          B: '#1890ff',
          C: '#faad14',
          D: '#ff4d4f',
        };
        return (
          <span style={{ color: colors[cleaning] || '#999', fontWeight: 600 }}>
            {cleaning}
          </span>
        );
      },
    },
    {
      title: 'Compatible Lines',
      dataIndex: ['compatibility', 'allowedLines'],
      key: 'lines',
      width: 150,
      render: (_, record) => `${record.compatibility.allowedLines.length} lines`,
    },
    {
      title: 'Priority',
      dataIndex: ['financial', 'priority'],
      key: 'priority',
      width: 100,
      filters: [
        { text: 'High', value: 'high' },
        { text: 'Medium', value: 'medium' },
        { text: 'Low', value: 'low' },
      ],
      onFilter: (value, record) => record.financial.priority === value,
      render: (_, record) => {
        const priority = record.financial.priority;
        const colors: Record<string, string> = {
          high: '#ff4d4f',
          medium: '#faad14',
          low: '#52c41a',
        };
        return (
          <span style={{ color: colors[priority] || '#999', textTransform: 'capitalize' }}>
            {priority}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Inactive', value: 'INACTIVE' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <span style={{ color: status === 'ACTIVE' ? '#52c41a' : '#999' }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => setQuickViewSKU(record)}>View</a>
          <a onClick={() => handleDelete(record)} style={{ color: '#ff4d4f' }}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <ProTable<SKU>
        columns={columns}
        dataSource={skus}
        rowKey="id"
        search={false}
        options={{
          search: true,
          reload: true,
          density: true,
        }}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} SKUs`,
          defaultPageSize: 20,
        }}
        scroll={{ x: 1800 }}
        headerTitle="SKU Management"
        toolBarRender={() => [
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={() => message.info('Exporting SKUs...')}
          >
            Export
          </Button>,
          <Button
            key="import"
            icon={<UploadOutlined />}
            onClick={() => message.info('Import functionality coming soon')}
          >
            Import
          </Button>,
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            New SKU
          </Button>,
        ]}
      />

      {/* SKU Editor Modal */}
      <SKUEditor
        visible={editorVisible}
        sku={selectedSKU}
        onCancel={() => setEditorVisible(false)}
        onSave={handleSave}
      />

      {/* Quick View Drawer */}
      <SKUQuickView
        sku={quickViewSKU}
        visible={!!quickViewSKU}
        onClose={() => setQuickViewSKU(undefined)}
        onEdit={(sku) => {
          setQuickViewSKU(undefined);
          handleEdit(sku);
        }}
      />
    </div>
  );
}

