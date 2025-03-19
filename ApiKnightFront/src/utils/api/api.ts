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

export function parseSwaggerDoc(
  swaggerStr: string,
  ownerId: string,
): Map<string, any[]> {
  const parseSwagger = (str: string): SwaggerDoc => {
    try {
      const originDoc = YAML.parse(str)
      console.log('YAML 解析结果:', originDoc)

      if (!originDoc.swagger || originDoc.swagger !== '2.0') {
        throw new Error('仅支持 Swagger 2.0 文档')
      }

      return {
        basePath: originDoc.basePath || '',
        paths: originDoc.paths || {},
        host: originDoc.host || '',
        schemes: originDoc.schemes || ['http'],
      }
    } catch (yamlError) {
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

    Object.entries(swaggerDoc.paths || {}).forEach(([pathKey, pathInfo]) => {
      if (!pathInfo || typeof pathInfo !== 'object') return

      Object.entries(pathInfo).forEach(([method, operation]) => {
        const lowerMethod = method.toLowerCase()
        if (!validMethods.has(lowerMethod)) return

        if (!operation || typeof operation !== 'object') return

        const safeOperation = operation as any
        const category = [].concat(safeOperation.tags || [])[0] || '默认分类'

        const requestParams = {
          params: [],
          headers: [],
          body: '{}',
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

function parseSwaggerParameters(params: any[] = []) {
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
interface SwaggerDoc {
  basePath: string
  paths: Record<string, any>
  host?: string
  schemes?: string[]
}
