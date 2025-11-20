'use client';

import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Space, Button, Tabs, Card, Statistic, Row, Col, Alert } from 'antd';
import { ThunderboltOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Schedule, ScheduleMetrics } from '@/types';

interface ScenarioRunnerProps {
  visible: boolean;
  currentSchedule: Schedule;
  onCancel: () => void;
  onRun: (config: ScenarioConfig) => void;
}

export interface ScenarioConfig {
  name: string;
  goal: 'minimize_changeover' | 'maximize_throughput' | 'balance_lines' | 'minimize_makespan';
  maxIterations: number;
  timeLimit: number; // seconds
  constraints: {
    respectDueDates: boolean;
    minUtilization: number;
    maxChangeoverTime: number;
  };
}

export default function ScenarioRunner({ visible, currentSchedule, onCancel, onRun }: ScenarioRunnerProps) {
  const [form] = Form.useForm();
  const [selectedGoal, setSelectedGoal] = useState<ScenarioConfig['goal']>('minimize_changeover');
  const [scenarios, setScenarios] = useState<Array<{ name: string; metrics: ScheduleMetrics; improvement: number }>>([]);

  const handleRun = () => {
    form.validateFields().then(values => {
      // Simulate running optimization
      const config: ScenarioConfig = {
        ...values,
        goal: selectedGoal,
      };
      
      // Simulate 3 scenarios with different improvements
      const simulatedScenarios = [
        {
          name: 'Scenario 1: Optimized',
          metrics: {
            ...currentSchedule.metrics,
            totalChangeoverMinutes: currentSchedule.metrics.totalChangeoverMinutes * 0.75,
            avgUtilization: currentSchedule.metrics.avgUtilization * 1.1,
          },
          improvement: 25,
        },
        {
          name: 'Scenario 2: Balanced',
          metrics: {
            ...currentSchedule.metrics,
            totalChangeoverMinutes: currentSchedule.metrics.totalChangeoverMinutes * 0.85,
            avgUtilization: currentSchedule.metrics.avgUtilization * 1.05,
          },
          improvement: 15,
        },
        {
          name: 'Scenario 3: Aggressive',
          metrics: {
            ...currentSchedule.metrics,
            totalChangeoverMinutes: currentSchedule.metrics.totalChangeoverMinutes * 0.65,
            avgUtilization: currentSchedule.metrics.avgUtilization * 1.15,
          },
          improvement: 35,
        },
      ];
      
      setScenarios(simulatedScenarios);
      onRun(config);
    });
  };

  return (
    <Modal
      title="Scenario Runner - What-If Analysis"
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="run" type="primary" onClick={handleRun} icon={<ThunderboltOutlined />}>
          Run Optimization
        </Button>,
      ]}
    >
      <Tabs
        items={[
          {
            key: 'config',
            label: 'Configuration',
            children: (
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  name: 'New Scenario',
                  maxIterations: 1000,
                  timeLimit: 30,
                  constraints: {
                    respectDueDates: true,
                    minUtilization: 70,
                    maxChangeoverTime: 60,
                  },
                }}
              >
                <Form.Item
                  name="name"
                  label="Scenario Name"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g., Optimized for Q1" />
                </Form.Item>

                <Form.Item label="Optimization Goal">
                  <Select
                    value={selectedGoal}
                    onChange={setSelectedGoal}
                    options={[
                      { label: 'Minimize Changeover Time', value: 'minimize_changeover' },
                      { label: 'Maximize Throughput', value: 'maximize_throughput' },
                      { label: 'Balance Line Load', value: 'balance_lines' },
                      { label: 'Minimize Makespan', value: 'minimize_makespan' },
                    ]}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="maxIterations"
                      label="Max Iterations"
                    >
                      <InputNumber min={100} max={10000} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="timeLimit"
                      label="Time Limit (seconds)"
                    >
                      <InputNumber min={5} max={300} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Card title="Constraints" size="small">
                  <Form.Item
                    name={['constraints', 'minUtilization']}
                    label="Minimum Line Utilization (%)"
                  >
                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name={['constraints', 'maxChangeoverTime']}
                    label="Maximum Changeover Time (min)"
                  >
                    <InputNumber min={0} max={180} style={{ width: '100%' }} />
                  </Form.Item>
                </Card>
              </Form>
            ),
          },
          {
            key: 'results',
            label: 'Results',
            children: scenarios.length > 0 ? (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Alert
                  message="Optimization Complete"
                  description="Multiple scenarios have been generated. Compare the results below."
                  type="success"
                  showIcon
                />
                
                {scenarios.map((scenario, index) => (
                  <Card key={index} title={scenario.name} size="small">
                    <Row gutter={16}>
                      <Col span={8}>
                        <Statistic
                          title="Improvement"
                          value={scenario.improvement}
                          suffix="%"
                          prefix={<CheckCircleOutlined />}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="Changeover Time"
                          value={scenario.metrics.totalChangeoverMinutes}
                          suffix="min"
                          prefix={<ClockCircleOutlined />}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="Utilization"
                          value={scenario.metrics.avgUtilization}
                          precision={1}
                          suffix="%"
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Col>
                    </Row>
                    <Button type="link" style={{ marginTop: 16 }}>
                      Apply This Scenario
                    </Button>
                  </Card>
                ))}
              </Space>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p>Run optimization to see results...</p>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
}

