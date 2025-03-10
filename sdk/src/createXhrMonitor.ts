// /* eslint-disable */
//
// import { reportError } from './reportError';
//
// interface XhrPayload {
//   method: string;
//   url: string;
//   status?: number;
// }
//
// class XMLHttpRequestWithPayload extends XMLHttpRequest {
//   private payload: XhrPayload = { method: '', url: '' };
//
//   open(method: string, url: string, async = true, username?: string | null, password?: string | null): void {
//     // 存储请求信息
//     this.payload = { method: method.toUpperCase(), url };
//
//     // 调用原生 open 方法
//     super.open(method, url, async, username, password);
//   }
//
//   send(data?: Document | BodyInit | null): void {
//     // 添加状态监听
//     this.addEventListener('readystatechange', () => {
//       if (this.readyState === 4) { // 请求完成
//         if (this.status >= 400) {
//           // 上报错误（包含最终状态码）
//           reportError(
//             {
//               name: 'xhr-error',
//               data: { ...this.payload, status: this.status }
//             },
//             this.payload.url,
//             'xhr-error'
//           );
//         }
//       }
//     });
//
//     // 调用原生 send 方法
//     super.send(data);
//   }
// }
//
// export function createXhrMonitor() {
//   // 保存原生 XMLHttpRequest 引用
//   const originalXMLHttpRequest = window.XMLHttpRequest;
//
//   return {
//     name: 'xhr-error',
//     start: () => {
//       // 避免重复替换
//       if (window.XMLHttpRequest === XMLHttpRequestWithPayload) return;
//
//       // 替换全局构造函数
//       window.XMLHttpRequest = XMLHttpRequestWithPayload;
//     },
//     stop: () => {
//       // 恢复原生 XMLHttpRequest
//       window.XMLHttpRequest = originalXMLHttpRequest;
//     }
//   };
// }
// /* eslint-disable */

import { reportError } from './reportError'

// 定义 XhrPayload 接口，用于存储请求的相关信息
interface XhrPayload {
  method: string
  url: string
  status?: number
}

// 自定义 XMLHttpRequest 类，继承自原生 XMLHttpRequest
class XMLHttpRequestWithPayload extends XMLHttpRequest {
  // 私有属性，用于存储请求的负载信息
  private payload: XhrPayload = { method: '', url: '' }

  // 重写 open 方法
  open(
    method: string,
    url: string,
    async = true,
    username?: string | null,
    password?: string | null,
  ): void {
    // 存储请求信息，将方法名转换为大写
    this.payload = { method: method.toUpperCase(), url }
    // 调用原生 open 方法
    super.open(method, url, async, username, password)
  }

  // 重写 send 方法
  send(data?: Document | BodyInit | null): void {
    // 添加状态监听
    const handleReadyStateChange = () => {
      if (this.readyState === 4) {
        // 请求完成
        if (this.status >= 400) {
          // 上报错误（包含最终状态码）
          reportError(
            {
              name: 'xhr-error',
              data: { ...this.payload, status: this.status },
            },
            this.payload.url,
            'xhr-error',
          )
        }
        // 移除事件监听器，避免内存泄漏
        this.removeEventListener('readystatechange', handleReadyStateChange)
      }
    }

    this.addEventListener('readystatechange', handleReadyStateChange)

    // 调用原生 send 方法
    super.send(data)
  }
}

// 创建 XHR 监控器的函数
export function createXhrMonitor() {
  // 保存原生 XMLHttpRequest 引用
  const originalXMLHttpRequest = window.XMLHttpRequest

  return {
    name: 'xhr-error',
    start: () => {
      // 避免重复替换
      if (window.XMLHttpRequest === XMLHttpRequestWithPayload) return

      // 替换全局构造函数
      window.XMLHttpRequest = XMLHttpRequestWithPayload
    },
    stop: () => {
      // 恢复原生 XMLHttpRequest
      window.XMLHttpRequest = originalXMLHttpRequest
    },
  }
}
