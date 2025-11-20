'use client';

import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  ClockCircleOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ScheduleMetrics } from '@/types';

interface KPIHeaderBarProps {
  metrics: ScheduleMetrics;
}

export default function KPIHeaderBar({ metrics }: KPIHeaderBarProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Avg Line Utilization"
            value={metrics.avgUtilization}
            precision={1}
            suffix="%"
            valueStyle={{ 
              color: metrics.avgUtilization > 85 ? '#3f8600' : '#cf1322',
              fontSize: '24px'
            }}
            prefix={<ThunderboltOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Total Changeovers"
            value={metrics.totalChangeovers}
            suffix={`/ ${metrics.totalChangeoverMinutes}min`}
            valueStyle={{ fontSize: '24px' }}
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Scheduled Orders"
            value={metrics.scheduledOrders}
            suffix={`/ ${metrics.completedOrders} done`}
            valueStyle={{ fontSize: '24px', color: '#1890ff' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Bottlenecks"
            value={metrics.bottlenecks.length}
            valueStyle={{ 
              fontSize: '24px',
              color: metrics.bottlenecks.length > 0 ? '#faad14' : '#52c41a'
            }}
            prefix={<WarningOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}

