import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { VisualizationData } from '@/types';

type VisualizationProps = {
  data: VisualizationData;
};

// 默认颜色方案
const DEFAULT_COLORS = [
  '#3B82F6', // primary-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#06B6D4', // cyan-500
  '#F97316', // orange-500
];

const Visualization: React.FC<VisualizationProps> = ({ data }) => {
  if (!data || !data.type || !data.data || data.data.length === 0) {
    return null;
  }

  const { type, title, data: chartData, colors = DEFAULT_COLORS } = data;

  // 渲染柱状图
  const renderBarChart = () => {
    const xAxisKey = data.xAxisKey || Object.keys(chartData[0])[0];
    const yAxisKeys = data.yAxisKeys || Object.keys(chartData[0]).filter(key => key !== xAxisKey);

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yAxisKeys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={colors[index % colors.length]} 
              name={key}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // 渲染折线图
  const renderLineChart = () => {
    const xAxisKey = data.xAxisKey || Object.keys(chartData[0])[0];
    const yAxisKeys = data.yAxisKeys || Object.keys(chartData[0]).filter(key => key !== xAxisKey);

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yAxisKeys.map((key, index) => (
            <Line 
              key={key} 
              type="monotone" 
              dataKey={key} 
              stroke={colors[index % colors.length]} 
              name={key}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 渲染饼图
  const renderPieChart = () => {
    const nameKey = data.pieKey || Object.keys(chartData[0])[0];
    const valueKey = data.valueKey || Object.keys(chartData[0])[1];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={150}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // 渲染性能对比图（特殊的柱状图）
  const renderPerformanceComparison = () => {
    const xAxisKey = data.xAxisKey || 'name';
    const yAxisKeys = data.yAxisKeys || Object.keys(chartData[0]).filter(key => key !== xAxisKey);

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yAxisKeys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={colors[index % colors.length]} 
              name={key}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // 根据类型渲染不同的图表
  const renderChart = () => {
    switch (type) {
      case 'bar_chart':
        return renderBarChart();
      case 'line_chart':
        return renderLineChart();
      case 'pie_chart':
        return renderPieChart();
      case 'performance_comparison':
        return renderPerformanceComparison();
      default:
        return <div className="text-secondary-500">不支持的可视化类型</div>;
    }
  };

  return (
    <div className="visualization bg-white rounded-lg p-6 mb-8 shadow-sm">
      <h2 className="text-xl font-bold text-secondary-900 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {title}
      </h2>
      <div className="visualization-container">
        {renderChart()}
      </div>
    </div>
  );
};

export default Visualization;