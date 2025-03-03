import { Method } from '@/types/components'
import axios from 'axios'

/**
 * 通过mock接口实现基于服务器的代理发送请求（处理跨域问题）
 * @param options 请求参数
 * @returns 返回的数据
 */
interface Options {
  url: string
  method: Method
  headers: string | null | Record<string, string>
  data: string
}
export const requestByServerProxy = async ({
  url,
  method = 'GET',
  params = {}, // URL 查询参数 (GET参数)
  data = {}, // 请求体数据 (POST/PUT数据)
  headers = {}, // 真正的 HTTP 头
}) => {
  try {
    const finalMethod = method.toUpperCase()
    const isGetRequest = finalMethod === 'GET'
    // 构建 Axios 配置
    const config = {
      url,
      method: finalMethod,
      headers: {
        'Content-Type': 'application/json', // 默认 JSON 类型
        ...headers, // 合并自定义头（不要放业务参数！）
      },
      params, // 自动转为 URL 参数，如 /posts?key=value
      data: isGetRequest ? undefined : data, // 强制清除 GET 的 body
    }

    // 警告非法用法
    if (isGetRequest && data) {
      console.warn('GET 请求不应包含 body 数据，请使用 `params` 传递参数')
    }
    console.log(config)
    const response = await axios(config)
    console.log(response)
    return response
  } catch (error) {
    // 错误处理逻辑（保持原有）
    const errorDetails = {
      status: error.response?.status || 'NO_RESPONSE',
      message: error.message,
      url,
      method: method.toUpperCase(),
    }
    throw Object.assign(
      new Error(`请求失败: ${errorDetails.message}`),
      errorDetails,
    )
  }
}
