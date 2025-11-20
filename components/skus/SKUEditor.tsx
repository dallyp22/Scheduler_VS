'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Tabs, Space } from 'antd';
import type { SKU } from '@/types';
import { PRODUCT_FAMILIES } from '@/lib/mock-data';
import { CleaningCategory, SKUStatus } from '@/types/enums';

interface SKUEditorProps {
  visible: boolean;
  sku?: SKU;
  onCancel: () => void;
  onSave: (values: any) => void;
}

const { TextArea } = Input;
const { Option } = Select;

export default function SKUEditor({ visible, sku, onCancel, onSave }: SKUEditorProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && sku) {
      form.setFieldsValue(sku);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, sku, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onSave(values);
      form.resetFields();
    });
  };

  const tabItems = [
    {
      key: 'basic',
      label: 'Basic Information',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="SKU Code"
                rules={[{ required: true, message: 'Please enter SKU code' }]}
              >
                <Input placeholder="e.g., SKU-A001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="family"
                label="Product Family"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select family">
                  {PRODUCT_FAMILIES.map(f => (
                    <Option key={f.code} value={f.code}>
                      Family {f.code} - {f.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g., Cola - Classic - 500ml" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Product description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Input placeholder="e.g., Beverages" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select>
                  <Option value={SKUStatus.ACTIVE}>Active</Option>
                  <Option value={SKUStatus.INACTIVE}>Inactive</Option>
                  <Option value={SKUStatus.DEVELOPMENT}>Development</Option>
                  <Option value={SKUStatus.SEASONAL}>Seasonal</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Space>
      ),
    },
    {
      key: 'production',
      label: 'Production',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['production', 'standardRate']}
                label="Standard Rate (units/hr)"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['production', 'yieldPercentage']}
                label="Yield %"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['production', 'minBatch']}
                label="Min Batch Size"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['production', 'maxBatch']}
                label="Max Batch Size"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['production', 'setupTime']} label="Setup Time (min)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['production', 'cycleTime']} label="Cycle Time (sec)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Space>
      ),
    },
    {
      key: 'attributes',
      label: 'Attributes',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['attributes', 'packaging']} label="Packaging Type">
                <Select>
                  <Option value="bottle">Bottle</Option>
                  <Option value="can">Can</Option>
                  <Option value="pouch">Pouch</Option>
                  <Option value="box">Box</Option>
                  <Option value="bulk">Bulk</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['attributes', 'temperature']} label="Storage Temperature">
                <Select>
                  <Option value="ambient">Ambient</Option>
                  <Option value="chilled">Chilled (2-8°C)</Option>
                  <Option value="frozen">Frozen (-18°C)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['attributes', 'weight']} label="Weight (grams)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['attributes', 'volume']} label="Volume (ml)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name={['attributes', 'allergens']} label="Allergens">
            <Select mode="multiple" placeholder="Select allergens">
              <Option value="milk">Milk</Option>
              <Option value="eggs">Eggs</Option>
              <Option value="fish">Fish</Option>
              <Option value="shellfish">Shellfish</Option>
              <Option value="tree_nuts">Tree Nuts</Option>
              <Option value="peanuts">Peanuts</Option>
              <Option value="wheat">Wheat</Option>
              <Option value="soybeans">Soybeans</Option>
            </Select>
          </Form.Item>
        </Space>
      ),
    },
    {
      key: 'planning',
      label: 'Planning',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['planning', 'leadTime']} label="Lead Time (hours)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['planning', 'shelfLife']} label="Shelf Life (days)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={['planning', 'safetyStock']} label="Safety Stock">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['planning', 'reorderPoint']} label="Reorder Point">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={['planning', 'cleaningRequirement']}
            label="Cleaning Requirement"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value={CleaningCategory.A}>Category A - No Cleaning</Option>
              <Option value={CleaningCategory.B}>Category B - Basic Rinse</Option>
              <Option value={CleaningCategory.C}>Category C - Standard Wash</Option>
              <Option value={CleaningCategory.D}>Category D - Deep Clean</Option>
            </Select>
          </Form.Item>
        </Space>
      ),
    },
    {
      key: 'financial',
      label: 'Financial',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name={['financial', 'unitCost']} label="Unit Cost ($)">
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['financial', 'sellingPrice']} label="Selling Price ($)">
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['financial', 'margin']} label="Margin (%)">
                <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name={['financial', 'priority']} label="Priority" rules={[{ required: true }]}>
            <Select>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title={sku ? `Edit SKU: ${sku.code}` : 'Create New SKU'}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={800}
      okText="Save"
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: SKUStatus.ACTIVE,
          production: { yieldPercentage: 95 },
          financial: { priority: 'medium' },
          planning: { cleaningRequirement: CleaningCategory.B },
        }}
      >
        <Tabs items={tabItems} />
      </Form>
    </Modal>
  );
}

