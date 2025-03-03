// import {
//   IAPIInfo,
//   MetaInfo,
//   NormalParamsType,
//   RequestParamsType,
// } from '@/types/api'
import { IAPIInfoPlus, SwaggerDoc, SwaggerParameter } from './type'
import { StatusValue } from '@/types/enum'
import { Method } from '@/types/components'
import { getRangeRandom } from '../math'
import YAML from 'yaml'

/**
 *  解析前端定义的请求信息类型对象
 * @param dataJsonStr 前端定义的请求信息类型对象的json字符串
 * @returns IAPIInfoPlus类型工具类
 */
export function parseAPIInfo(dataJsonStr: string): IAPIInfoPlus {
  const res = {} as IAPIInfoPlus
  try {
    const apiData = JSON.parse(dataJsonStr)
    res.value = apiData
    res.getMethod = () => apiData.apiInfo.base.method
    res.getPath = () => apiData.apiInfo.base.path
    res.getFullUrl = () => res.getPath() + '/' + apiData.apiInfo.base.prefix
    return res
  } catch (e) {
    throw new Error(`parseAPIInfo Fail:${e.message}`)
  }
}

/**
 * @param dataJsonStr Swagger2.0文档JSON
 * @param ownerId 接口拥者的id
 * @returns Map<目录名 string, 目录下的所有接口列表 IAPIInfo[]>
 */
// export function parseSwaggerDoc(
//   swaggerDoc: SwaggerDoc,
//   ownerId: string,
// ): Map<string, IAPIInfo[]> {
//   const rst = new Map<string, IAPIInfo[]>()
//   console.log(swaggerDoc)
//   const basePath = swaggerDoc.Path
//   const swaggerPaths = swaggerDoc.paths
//   console.log(basePath, swaggerPaths)
//   // debugger
//   // Object.keys(swaggerPaths).map((pathKey: string) => {
//   //   const fullInfo = swaggerPaths[pathKey]
//   //   const method = Object.keys(fullInfo)[0]
//   //   const needInfo = fullInfo[method]
//   //   // 接口本身的描述信息
//   //   const meta_info: MetaInfo = {
//   //     created: new Date().getTime(),
//   //     status: StatusValue.DEVELOPING,
//   //     owner_id: ownerId,
//   //     tags: ['默认标签'],
//   //     desc: needInfo?.description,
//   //     name: needInfo?.summary,
//   //     notes: '从swagger2.0文档转换而来',
//   //   }
//   //
//   //   // 接口请求信息
//   //   const apiInfo: IAPIInfo['apiInfo'] = {
//   //     base: {
//   //       method: method.toUpperCase() as Method,
//   //       path: pathKey.slice(1),
//   //       prefix: basePath || '',
//   //     },
//   //     request: parseSwaggerParameters(needInfo.parameters),
//   //     response: { status: 200, body: '{}' },
//   //   }
//   //   const folderName = needInfo?.tags?.[0] || '根目录'
//   //   if (rst.has(folderName)) {
//   //     rst.get(folderName).push({ meta_info, apiInfo })
//   //   } else {
//   //     rst.set(folderName, [{ meta_info, apiInfo }])
//   //   }
//   // })
//   return rst
// }
//
// function parseSwaggerParameters(
//   swaggerParams: SwaggerParameter[],
// ): RequestParamsType {
//   const paramsInfo: NormalParamsType[] = []
//   const headersInfo: NormalParamsType[] = []
//   const cookieInfo: NormalParamsType[] = []
//   let bodyInfo: string = ''
//
//   swaggerParams.forEach((paramItem) => {
//     const singleApiInfo: NormalParamsType = {} as NormalParamsType
//     singleApiInfo.id = Date.now() + getRangeRandom(1000, 9999)
//     singleApiInfo.paramName = paramItem?.name
//     singleApiInfo.required = paramItem?.required
//     singleApiInfo.desc = paramItem?.description
//     singleApiInfo.type = paramItem?.type
//     singleApiInfo.value = paramItem?.['x-example']?.[0]
//     switch (paramItem.in) {
//       case 'query':
//         paramsInfo.push(singleApiInfo)
//         break
//       case 'header':
//         headersInfo.push(singleApiInfo)
//         break
//       case 'cookie':
//         cookieInfo.push(singleApiInfo)
//         break
//       case 'body':
//         bodyInfo = '{}'
//     }
//   })
//   const rst = {
//     params: paramsInfo,
//     headers: headersInfo,
//     cookie: cookieInfo,
//     body: bodyInfo,
//   }
//   return rst
// }

// 类型定义
// 转换函数
// export function parseSwaggerDoc(
//   swaggerStr: string,
//   ownerId: string
// ): Map<string, any[]> {
//   // 1. 解析字符串并转换字段名
//   const parseSwagger = (str: string): SwaggerDoc => {
//     try {
//       console.log('`121231231231233123123123213123')
//       const originDoc = JSON.parse(str)
//       console.log(originDoc)
//       return {
//         Path: originDoc.basePath || '',
//         paths: originDoc.paths || {}
//       }
//     } catch (e) {
//       throw new Error('Invalid Swagger JSON format')
//     }
//   }
//
//   // 2. 执行转换
//   try {
//     const swaggerDoc = parseSwagger(swaggerStr)
//     console.log(swaggerDoc)
//     const rst = new Map<string, any[]>()
//     const validMethods = new Set(['get', 'post', 'put', 'delete', 'patch', 'head', 'options'])
//
//     Object.entries(swaggerDoc.paths).forEach(([pathKey, pathInfo]) => {
//       Object.entries(pathInfo).forEach(([method, operation]) => {
//         // 过滤非HTTP方法
//         if (!validMethods.has(method.toLowerCase())) return
//
//         // 生成分类名称
//         const category = operation.tags?.[0] || '默认分类'
//
//         // 构建接口信息
//         const apiInfo = {
//           meta_info: {
//             created: Date.now(),
//             owner_id: ownerId,
//             name: operation.summary || pathKey,
//             // ...其他元信息
//           },
//           apiInfo: {
//             base: {
//               method: method.toUpperCase(),
//               path: pathKey.replace(/^\/+/, ''),
//               prefix: swaggerDoc.Path
//             },
//             request: {
//               // ...解析参数
//             },
//             response: {
//               // ...解析响应
//             }
//           }
//         }
//
//         // 存入Map
//         if (!rst.has(category)) {
//           rst.set(category, [])
//         }
//         rst.get(category)!.push(apiInfo)
//       })
//     })
//
//     return rst
//   } catch (e) {
//     console.error('Swagger转换失败:', e)
//     return new Map() // 返回空Map或抛出异常根据业务需求
//   }
// }

export function parseSwaggerDoc(
  swaggerStr: string,
  ownerId: string,
): Map<string, any[]> {
  // 1. 修改解析逻辑支持 YAML
  const parseSwagger = (str: string): SwaggerDoc => {
    try {
      // 先尝试解析 YAML
      const originDoc = YAML.parse(str)
      console.log('YAML 解析结果:', originDoc)

      // 校验必要字段
      if (!originDoc.swagger || originDoc.swagger !== '2.0') {
        throw new Error('仅支持 Swagger 2.0 文档')
      }

      return {
        basePath: originDoc.basePath || '', // 修正字段名（原 Path 错误）
        paths: originDoc.paths || {},
        // 保留其他必要字段
        host: originDoc.host || '',
        schemes: originDoc.schemes || ['http'],
      }
    } catch (yamlError) {
      // YAML 解析失败时尝试 JSON
      try {
        const originDoc = JSON.parse(str)
        return {
          basePath: originDoc.basePath || '',
          paths: originDoc.paths || {},
        }
      } catch (jsonError) {
        throw new Error(
          `文档解析失败: ${yamlError.message} (YAML) / ${jsonError.message} (JSON)`,
        )
      }
    }
  }

  // 2. 转换逻辑（保持主要结构不变）
  try {
    const swaggerDoc = parseSwagger(swaggerStr)
    console.log('标准化 Swagger 文档:', swaggerDoc)

    const rst = new Map<string, any[]>()
    const validMethods = new Set([
      'get',
      'post',
      'put',
      'delete',
      'patch',
      'head',
      'options',
    ])

    // 3. 处理路径时添加容错
    Object.entries(swaggerDoc.paths || {}).forEach(([pathKey, pathInfo]) => {
      if (!pathInfo || typeof pathInfo !== 'object') return

      Object.entries(pathInfo).forEach(([method, operation]) => {
        // 过滤非法方法
        const lowerMethod = method.toLowerCase()
        if (!validMethods.has(lowerMethod)) return

        // 确保 operation 对象存在
        if (!operation || typeof operation !== 'object') return

        // 4. 处理 YAML 可能的类型差异
        const safeOperation = operation as any
        const category = [].concat(safeOperation.tags || [])[0] || '默认分类'

        // 构建请求参数（示例）
        const requestParams = {
          params: [],
          headers: [],
          body: '{}',
          // 添加具体参数解析逻辑
          ...parseSwaggerParameters(safeOperation.parameters || []),
        }

        const apiInfo = {
          meta_info: {
            created: Date.now(),
            owner_id: ownerId,
            name: safeOperation.summary || `${method.toUpperCase()} ${pathKey}`,
            desc: safeOperation.description || '无描述',
            tags: [].concat(safeOperation.tags || []),
          },
          apiInfo: {
            base: {
              method: method.toUpperCase(),
              path: pathKey.replace(/^\/+/, ''), // 清理开头的斜杠
              prefix: (swaggerDoc.basePath || '').replace(/^\/+/, ''), // 修正字段名
            },
            request: requestParams,
            response: parseSwaggerResponses(safeOperation.responses || {}),
          },
        }

        // 更新 Map
        const current = rst.get(category) || []
        rst.set(category, [...current, apiInfo])
      })
    })

    return rst
  } catch (e) {
    console.error('Swagger 转换失败:', e)
    return new Map()
  }
}

// 辅助函数示例
function parseSwaggerParameters(params: any[] = []) {
  // 具体参数解析逻辑
  return {
    params: params.filter((p) => p.in === 'query'),
    headers: params.filter((p) => p.in === 'header'),
    body: params.find((p) => p.in === 'body')?.schema || '{}',
  }
}

function parseSwaggerResponses(responses: any = {}) {
  const success = responses['200'] || responses.default
  return {
    status: 200,
    body: success?.schema ? JSON.stringify(success.schema) : '{}',
  }
}

// 类型定义
interface SwaggerDoc {
  basePath: string // 修正字段名
  paths: Record<string, any>
  host?: string
  schemes?: string[]
}
