import React, { memo, useState, useEffect } from 'react'
import { Button, message } from 'antd'
import Mock from 'mockjs'
import type { MockjsRequestOptions } from 'mockjs'

// 假设这些类型定义已经在 @/types/components 和 @/types/api 中正确定义
import type { ApiOptReqOptType } from '@/types/components'
import {
  BaseInfoType,
  IAPIInfo,
  MetaInfo,
  RequestParamsType,
} from '@/types/api'

// 假设这些组件和函数已经在相应路径下正确定义
import ApiOperator from '@/components/ApiOperator'
import withMode from '../../with-mode'
import { requestByServerProxy } from '@/api/service'
import { createMock } from '@/api'

// 引入 Redux 相关的 Hooks 和 action
import { useAppSelector, useAppDispatch } from '@/store'
import {
  changeResponseBodyAction,
  changeMethodAction,
  changePathAction,
  changePrefixAction,
} from '@/store/modules/mock'

import './index.less'

type MockUrlProps = {
  mode: 'run' | 'mock'
  mockPrefix?: string
}

// eslint-disable-next-line react-refresh/only-export-components
const MockUrl: React.FunctionComponent<MockUrlProps> = (props) => {
  const { mode } = props
  const [mockPrefix, setMockPrefix] = useState(
    'http://localhost:7000/api/v1/mock/project_id',
  )
  const dispatch = useAppDispatch()

  // 根据模式，获取对应的数据
  const { userReqInfo, reqParams, projectId, metaInfo, apiData } =
    useAppSelector((state) => {
      const res = {} as {
        userReqInfo: BaseInfoType
        reqParams: RequestParamsType
        metaInfo: MetaInfo
        apiData: IAPIInfo
      }
      if (mode === 'mock') {
        res.userReqInfo = state.mock.mockData.apiInfo.base
        res.reqParams = state.mock.mockData.apiInfo.request
        res.metaInfo = state.mock.mockData.meta_info
        res.apiData = state.mock.mockData
      } else {
        res.userReqInfo = state.mock.runData.apiInfo.base
        res.reqParams = state.mock.runData.apiInfo.request
        res.metaInfo = state.mock.runData.meta_info
        res.apiData = state.mock.runData
      }
      return { ...res, projectId: state.project.projectInfo.id }
    })

  useEffect(() => {
    setMockPrefix(`http://localhost:7000/api/v1/mock/${projectId}`)
  }, [projectId])

  // 由于组件需要额外冗余增加一个属性，需要保持与userReqInfo中的method一致
  const [userMethod, setUserMethod] = useState<ApiOptReqOptType>({
    label: 'GET',
    value: 'GET',
  })

  useEffect(() => {
    setUserMethod({ label: userReqInfo.method, value: userReqInfo.method })
  }, [userReqInfo])

  // 输入框改变事件
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'prefix' | 'path',
  ): void => {
    // 拿到最新的值
    const newVal = e.target.value
    if (type === 'prefix') {
      dispatch(changePrefixAction(newVal))
    } else {
      dispatch(changePathAction(newVal))
    }
  }

  // 请求方式改变事件
  const handleMethodChange = (methodOpt: ApiOptReqOptType): void => {
    setUserMethod(methodOpt)
    dispatch(changeMethodAction(methodOpt.value))
  }

  // 普通的发送请求按钮，与运行页面功能一致当是mock时，改为发送mock请求
  const handleSend = async () => {
    let response
    try {
      if (mode === 'run') {
        // 将ApiKnight文档中的参数格式转换成发送请求的格式
        const headers = {}
        const queries = {}
        let cookies = ''

        // 组织headers和cookies
        reqParams.params.forEach(
          (item) => (headers[item.paramName] = item.value),
        )
        reqParams.cookie.forEach(
          (item) => (cookies += `${item.paramName}=${item.value}; `),
        )
        if (cookies) {
          headers['Cookie'] = cookies
        }

        reqParams.params.forEach(
          (item) => (queries[item.paramName] = item.value),
        )

        const url = `${userReqInfo.prefix}/${userReqInfo.path}`
        response = await requestByServerProxy({
          url: url,
          method: userReqInfo.method,
          params: headers,
          data: reqParams.body,
        })
        try {
          const jsonResBody = JSON.stringify(response.data)
          dispatch(changeResponseBodyAction(jsonResBody))
        } catch (err) {
          dispatch(changeResponseBodyAction(response.data + ''))
        }
      } else {
        const tryParseJSON = (str: string) => {
          try {
            return JSON.parse(str)
          } catch (e) {
            return str
          }
        }
        const mockConfig = {
          url: `${userReqInfo.prefix}/${userReqInfo.path}`,
          method: userReqInfo.method.toLowerCase(),
          query: reqParams.params.reduce(
            (acc, item) => {
              acc[item.paramName] = item.value
              return acc
            },
            {} as Record<string, string>,
          ),
          headers: reqParams.params.reduce(
            (acc, item) => {
              acc[item.paramName] = item.value
              return acc
            },
            {} as Record<string, string>,
          ),
          body: tryParseJSON(reqParams.body),
        }
        console.log(mockConfig)
        Mock.setup({
          timeout: Math.floor(Math.random() * 1300) + 200,
        })
        Mock.mock(
          new RegExp(`${mockConfig.url}.*`),
          mockConfig.method,
          (options: MockjsRequestOptions) => {
            // 记录请求日志
            console.log('[Mock Request]', {
              url: options.url,
              method: options.type,
              query: mockConfig.query,
              headers: options.headers,
              body: tryParseJSON(options.body),
            })

            // 获取预设响应数据
            const responseData = tryParseJSON(apiData.apiInfo.response.body)

            // 更新响应到Redux
            dispatch(
              changeResponseBodyAction(
                typeof responseData === 'string'
                  ? responseData
                  : JSON.stringify(responseData, null, 2),
              ),
            )

            // 返回符合Mockjs格式的响应
            return Mock.mock({
              code: 200,
              message: 'success',
              data: responseData,
              timestamp: +new Date(),
            })
          },
        )
        console.log({
          method: mockConfig.method,
          headers: mockConfig.headers,
          body:
            mockConfig.method === 'get'
              ? null
              : JSON.stringify(mockConfig.body),
        })
        response = await fetch(mockConfig.url, {
          method: mockConfig.method,
          headers: mockConfig.headers,
          body:
            mockConfig.method === 'get'
              ? null
              : JSON.stringify(mockConfig.body),
        })
        message.success('Mock请求已拦截')
        console.log(response)
        try {
          const responseJson = await response.json()
          console.log(responseJson)

          dispatch(changeResponseBodyAction(responseJson))
        } catch (err) {
          dispatch(changeResponseBodyAction(responseJson + ''))
        }
      }
    } catch (error) {
      console.error('Request error:', error)
      message.error('请求失败，请检查网络或接口配置')
    }
  }

  // 创建Mock服务
  const handleCreateMock = async () => {
    try {
      // 将ApiKnight文档中的参数格式转换成发送请求的格式
      const headers = {}
      const queries = {}
      let cookies = ''

      // 组织headers和cookies
      reqParams.params.forEach((item) => (headers[item.paramName] = item.value))
      reqParams.cookie.forEach(
        (item) => (cookies += `${item.paramName}=${item.value}; `),
      )
      headers['Cookie'] = cookies

      // 组织queries
      reqParams.params.forEach((item) => (queries[item.paramName] = item.value))
      console.log({
        project_id: projectId,
        url: '/' + userReqInfo.path,
        method: userReqInfo.method.toLowerCase(),
        apis_id: metaInfo.api_id,
        name: metaInfo.name,
        headers: JSON.stringify(headers),
        params: JSON.stringify(queries),
        response: getMockNeedResponse(apiData.apiInfo.response.body),
        data: apiData.apiInfo.response.body,
      })
      const res = await createMock({
        project_id: projectId,
        url: '/' + userReqInfo.path,
        method: userReqInfo.method.toLowerCase(),
        apis_id: metaInfo.api_id,
        name: metaInfo.name,
        headers: JSON.stringify(headers),
        params: JSON.stringify(queries),
        response: getMockNeedResponse(apiData.apiInfo.response.body),
        data: apiData.apiInfo.response.body,
      })

      if (res.code === 200) {
        message.success('创建成功')
      } else {
        message.error('创建失败，请检查参数或服务器状态')
      }
    } catch (error) {
      console.error('Create mock error:', error)
      message.error('创建失败，请检查网络或服务器状态')
    }
  }

  // 对用户对response进行处理
  const getMockNeedResponse = (body: string) => {
    let res = {}
    try {
      const respObj = JSON.parse(body)
      res = {
        example: respObj,
      }
    } catch (error) {
      res = {
        example: { data: body },
      }
    }
    console.log('Mock response:', res)
    return JSON.stringify(res)
  }

  return (
    <div className='doc-operator'>
      <ApiOperator
        methodValue={userMethod}
        onOptionChange={(m) => handleMethodChange(m)}
        onPrefixInputChange={(e) => handleInputChange(e, 'prefix')}
        onInputChange={(e) => handleInputChange(e, 'path')}
        inputValue={userReqInfo.path}
        urlPrefixValue={userReqInfo.prefix}
        rightWidth={mode === 'mock' ? '250px' : '150px'}>
        {/* 运行的发送由handleSendBtnClick控制，mock的发送和创建由handleMock控制 */}
        <Button className='btn' type='primary' onClick={handleSend}>
          发送
        </Button>

        {mode === 'mock' && (
          <Button
            type='primary'
            style={{ marginLeft: '10px' }}
            onClick={handleCreateMock}>
            创建Mock
          </Button>
        )}
      </ApiOperator>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(withMode(MockUrl))
