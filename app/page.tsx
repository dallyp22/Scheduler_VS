'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Progress, Table } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { getMockSchedule, getMockOrders } from '@/lib/mock-data';
import { OrderStatus } from '@/types/enums';

export default function HomePage() {
  const schedule = getMockSchedule();
  const orders = getMockOrders(50);
  
  const scheduledOrders = orders.filter(o => o.status === OrderStatus.SCHEDULED).length;
  const inProgressOrders = orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length;
  const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED).length;
  
  const upcomingOrders = orders
    .filter(o => o.status === OrderStatus.SCHEDULED || o.status === OrderStatus.PLANNED)
    .slice(0, 5);

  const recentBlocks = schedule.blocks.slice(0, 5);

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: 24 }}>
        Production Dashboard
      </h1>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Line Utilization"
              value={schedule.metrics.avgUtilization}
              precision={1}
              suffix="%"
              valueStyle={{ color: schedule.metrics.avgUtilization > 85 ? '#3f8600' : '#cf1322' }}
              prefix={schedule.metrics.avgUtilization > 85 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Schedule Adherence"
              value={schedule.metrics.scheduleAdherence}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Changeover Time"
              value={schedule.metrics.avgChangeoverMinutes}
              precision={0}
              suffix="min"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Orders Completed"
              value={completedOrders}
              suffix={`/ ${orders.length}`}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Production Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Production Status" variant="borderless">
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <span>Scheduled: {scheduledOrders}</span>
              </div>
              <Progress percent={(scheduledOrders / orders.length) * 100} showInfo={false} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <span>In Progress: {inProgressOrders}</span>
              </div>
              <Progress 
                percent={(inProgressOrders / orders.length) * 100} 
                showInfo={false}
                status="active"
              />
            </div>
            <div>
              <div style={{ marginBottom: 8 }}>
                <span>Completed: {completedOrders}</span>
              </div>
              <Progress 
                percent={(completedOrders / orders.length) * 100} 
                showInfo={false}
                status="success"
              />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Line Utilization" variant="borderless">
            {Object.entries(schedule.metrics.lineUtilization).slice(0, 5).map(([lineId, util]) => (
              <div key={lineId} style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8 }}>
                  <span>Line {lineId.split('-')[1]}</span>
                  <span style={{ float: 'right' }}>{util.toFixed(1)}%</span>
                </div>
                <Progress 
                  percent={util} 
                  showInfo={false}
                  strokeColor={util > 95 ? '#ff4d4f' : util > 80 ? '#52c41a' : '#1890ff'}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Upcoming Orders" variant="borderless">
            <Table
              dataSource={upcomingOrders}
              columns={[
                {
                  title: 'Order #',
                  dataIndex: 'orderNumber',
                  key: 'orderNumber',
                },
                {
                  title: 'SKU',
                  dataIndex: ['sku', 'code'],
                  key: 'sku',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  render: (val: number) => val.toLocaleString(),
                },
                {
                  title: 'Priority',
                  dataIndex: 'priority',
                  key: 'priority',
                  render: (val: number) => (
                    <span style={{ color: val >= 8 ? '#ff4d4f' : val >= 5 ? '#faad14' : '#52c41a' }}>
                      {val >= 8 ? 'High' : val >= 5 ? 'Medium' : 'Low'}
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
        <Col span={12}>
          <Card title="Active Production Blocks" variant="borderless">
            <Table
              dataSource={recentBlocks}
              columns={[
                {
                  title: 'Line',
                  dataIndex: ['line', 'code'],
                  key: 'line',
                },
                {
                  title: 'SKU',
                  dataIndex: ['order', 'sku', 'code'],
                  key: 'sku',
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <span style={{
                      color: status === 'COMPLETED' ? '#52c41a' : 
                             status === 'RUNNING' ? '#1890ff' : 
                             status === 'CHANGEOVER' ? '#faad14' : '#999'
                    }}>
                      {status}
                    </span>
                  ),
                },
                {
                  title: 'Progress',
                  key: 'progress',
                  render: (_, record: any) => {
                    const now = new Date().getTime();
                    const start = record.startTime.getTime();
                    const end = record.endTime.getTime();
                    const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
                    return <Progress percent={progress} size="small" showInfo={false} />;
                  },
                },
              ]}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
