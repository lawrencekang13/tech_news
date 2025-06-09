import React from 'react';
import { StructuredInfoData, Entity, Metric, TimelineEvent } from '@/types';

type StructuredInfoProps = {
  data: StructuredInfoData;
};

const StructuredInfo: React.FC<StructuredInfoProps> = ({ data }) => {
  // 检查data是否存在
  if (!data) {
    return null;
  }
  
  const { entities, metrics, timeline } = data;
  
  // 如果没有结构化数据，则不渲染
  if (!entities?.length && !metrics?.length && !timeline?.length) {
    return null;
  }

  return (
    <div className="structured-info bg-secondary-50 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-secondary-900 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        结构化信息
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 实体信息 */}
        {entities && entities.length > 0 && (
          <div className="structured-section">
            <h3 className="text-lg font-semibold text-secondary-800 mb-3">关键实体</h3>
            <div className="space-y-3">
              {entities.map((entity, index) => (
                <div key={index} className="bg-white rounded-md p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-secondary-900">{entity.name}</span>
                    <span className="badge badge-secondary">{entity.type}</span>
                  </div>
                  <p className="text-sm text-secondary-600 mt-1">{entity.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 指标信息 */}
        {metrics && metrics.length > 0 && (
          <div className="structured-section">
            <h3 className="text-lg font-semibold text-secondary-800 mb-3">关键指标</h3>
            <div className="space-y-3">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-md p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-secondary-900">{metric.name}</span>
                    <span className="text-primary-600 font-bold">{metric.value}</span>
                  </div>
                  <p className="text-sm text-secondary-600 mt-1">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 时间线信息 */}
      {timeline && timeline.length > 0 && (
        <div className="structured-section mt-6">
          <h3 className="text-lg font-semibold text-secondary-800 mb-3">时间线</h3>
          <div className="relative">
            {/* 时间线轴 */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-secondary-200"></div>
            
            <div className="space-y-4 pl-10">
              {timeline.map((event, index) => (
                <div key={index} className="relative">
                  {/* 时间点 */}
                  <div className="absolute left-[-30px] top-1 w-6 h-6 bg-primary-100 border-2 border-primary-500 rounded-full"></div>
                  
                  <div className="bg-white rounded-md p-3 shadow-sm">
                    <div className="font-medium text-secondary-900">{event.date}</div>
                    <p className="text-secondary-700">{event.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StructuredInfo;