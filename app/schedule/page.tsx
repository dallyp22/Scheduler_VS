'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Button, DatePicker, Select, Space, Tag, Switch } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SyncOutlined,
  DownloadOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { getMockSchedule, getMockLines } from '@/lib/mock-data';
import InteractiveTimeline from '@/components/scheduling/InteractiveTimeline';
import DraggableTimeline from '@/components/scheduling/DraggableTimeline';
import ScenarioRunner from '@/components/scheduling/ScenarioRunner';
import KPIHeaderBar from '@/components/scheduling/KPIHeaderBar';

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [dragEnabled, setDragEnabled] = useState(true);
  const [scenarioModalVisible, setScenarioModalVisible] = useState(false);
  
  const schedule = getMockSchedule();
  const lines = getMockLines();
  
  const filteredBlocks = selectedLine
    ? schedule.blocks.filter(block => block.lineId === selectedLine)
    : schedule.blocks;

  const handleOptimize = () => {
    setScenarioModalVisible(true);
  };

  const handleExport = () => {
    console.log('Exporting schedule...');
  };

  const handleBlockMove = (blockId: string, newLineId: string, newStartTime: Date) => {
    console.log('Block moved:', blockId, 'to line:', newLineId, 'at:', newStartTime);
    // Here you would update the schedule via your API
  };

  const handleScenarioRun = (config: any) => {
    console.log('Running scenario with config:', config);
    // Here you would call your optimization API
  };

  return (
    <div>
      {/* Header with actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
          Production Schedule
        </h1>
        <Space>
          <span style={{ fontSize: '12px', marginRight: 8 }}>Drag & Drop:</span>
          <Switch 
            checked={dragEnabled} 
            onChange={setDragEnabled}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
          <DatePicker 
            value={selectedDate} 
            onChange={setSelectedDate}
            style={{ width: 200 }}
          />
          <Select
            placeholder="All Lines"
            allowClear
            style={{ width: 200 }}
            onChange={setSelectedLine}
            value={selectedLine}
            options={lines.map(line => ({
              label: `${line.code} - ${line.name}`,
              value: line.id,
            }))}
          />
          <Select
            value={viewMode}
            onChange={setViewMode}
            style={{ width: 120 }}
            options={[
              { label: 'Day View', value: 'day' },
              { label: 'Week View', value: 'week' },
            ]}
          />
          <Button 
            type="primary" 
            icon={<ThunderboltOutlined />}
            onClick={handleOptimize}
          >
            Run Scenario
          </Button>
          <Button 
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Space>
      </div>

      {/* KPI Bar */}
      <KPIHeaderBar metrics={schedule.metrics} />

      {/* Timeline */}
      <Card 
        style={{ marginTop: 24 }}
        styles={{ body: { padding: 0 } }}
      >
        {dragEnabled ? (
          <DraggableTimeline
            blocks={filteredBlocks}
            lines={lines}
            startDate={schedule.startDate}
            endDate={schedule.endDate}
            onBlockMove={handleBlockMove}
          />
        ) : (
          <InteractiveTimeline
            blocks={filteredBlocks}
            lines={lines}
            startDate={schedule.startDate}
            endDate={schedule.endDate}
            viewMode={viewMode}
          />
        )}
      </Card>

      {/* Legend */}
      <Card style={{ marginTop: 16 }} title="Status Legend">
        <Space size="large">
          <Tag color="blue">Planned</Tag>
          <Tag color="cyan">Ready</Tag>
          <Tag color="orange">Changeover</Tag>
          <Tag color="green">Running</Tag>
          <Tag color="success">Completed</Tag>
          <Tag color="red">Delayed</Tag>
        </Space>
      </Card>

      {/* Scenario Runner Modal */}
      <ScenarioRunner
        visible={scenarioModalVisible}
        currentSchedule={schedule}
        onCancel={() => setScenarioModalVisible(false)}
        onRun={handleScenarioRun}
      />
    </div>
  );
}

