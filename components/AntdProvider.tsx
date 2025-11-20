'use client';

import React from 'react';
import { ConfigProvider, theme, App } from 'antd';
import enUS from 'antd/locale/en_US';

interface AntdProviderProps {
  children: React.ReactNode;
}

export default function AntdProvider({ children }: AntdProviderProps) {
  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          borderRadius: 8,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        algorithm: theme.defaultAlgorithm,
        components: {
          Layout: {
            siderBg: 'rgba(0, 21, 41, 0.85)',
            headerBg: 'rgba(0, 21, 41, 0.95)',
          },
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}

