// import { reportError } from './reportError'
//
// export function createBlankScreenMonitor(adress: string) {
//   return function (url?: string) {
//     const name = 'blank-screen'
//     const entryType = 'paint'
//     if (url === '' || url === undefined) {
//       url = window.location.pathname
//     }
//     function start() {
//       const p = new PerformanceObserver((list) => {
//         const entries = list.getEntries()
//         const firstPaintEntry = entries.find(
//           (entry) => entry.name === 'first-paint',
//         )
//         const firstContentfulPaintEntry = entries.find(
//           (entry) => entry.name === 'first-contentful-paint',
//         )
//
//         if (firstPaintEntry && firstContentfulPaintEntry) {
//           const blankScreenTime =
//             firstContentfulPaintEntry.startTime - firstPaintEntry.startTime
//           const report = reportError(adress)
//           report({ name, blankScreenTime }, url as string, name)
//         }
//       })
//
//       p.observe({ entryTypes: [entryType] })
//     }
//
//     return { name, start }
//   }
// }
import { reportError } from './reportError'

export function createBlankScreenMonitor(address: string) {
  return function (url?: string) {
    const name = 'blank-screen'
    const entryType = 'paint'

    // 处理 URL 默认值
    if (!url) url = window.location.pathname

    function start() {
      const p = new PerformanceObserver((list) => {
        const entries = list.getEntries()

        // 直接查找 FCP 条目
        const fcpEntry = entries.find(
          (entry) => entry.name === 'first-contentful-paint',
        )

        if (fcpEntry) {
          // 获取导航开始时间（兼容性处理）
          const navigationStart =
            performance.timing.navigationStart || // 传统 API
            performance.timeOrigin // 现代浏览器（需验证时间基准）

          // 计算白屏时间 = FCP时间 - 导航开始时间
          const blankScreenTime = fcpEntry.startTime - navigationStart

          // 上报数据
          const report = reportError(address)
          report(
            {
              name,
              blankScreenTime,
              navigationStart,
              fcpTime: fcpEntry.startTime,
            },
            url as string,
            name,
          )
        }
      })

      // 监听 paint 类型条目
      p.observe({ entryTypes: [entryType] })
    }

    return { name, start }
  }
}
