/**
 * API响应格式化工具
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * 创建标准化的API响应
 * @param success 是否成功
 * @param data 响应数据
 * @param message 响应消息
 * @returns 格式化的API响应
 */
export function createApiResponse<T = any>(
  success: boolean,
  data: T,
  message: string = ''
): ApiResponse<T> {
  return {
    success,
    data,
    message
  };
}