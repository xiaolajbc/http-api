import React, { memo, useState } from 'react'
import classNames from 'classnames'
import { Input, Table, Button, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { NavType } from '@/types/enum'
import type { NormalParamsType, RequestParamsType } from '@/types/api'

import './index.less'
import { useAppSelector, shallowEqualApp, useAppDispatch } from '@/store'
import {
  changeNormalParamsAction,
  changeParamsItemOptAction,
  changeRequestBodyAction,
} from '@/store/modules/mock'
import { NavItem } from './type'
import withMode from '../../with-mode'
import CodeEditor from '@/components/CodeEditor'

// eslint-disable-next-line react-refresh/only-export-components
const NavItems: NavItem[] = [
  { label: 'Params', value: NavType.Params },
  { label: 'Body', value: NavType.Body },
  { label: 'Cookie', value: NavType.Cookie },
  { label: 'Header', value: NavType.Header },
]

// eslint-disable-next-line react-refresh/only-export-components
const MockReqParams: React.FunctionComponent<{ mode: 'run' | 'mock' }> = (
  props,
) => {
  const dispatch = useAppDispatch()

  // 根据模式，获取对应的数据
  const { requestInfo } = useAppSelector((state) => {
    let res = {} as RequestParamsType
    if (props.mode === 'mock') {
      res = state.mock.mockData.apiInfo.request
    } else {
      res = state.mock.runData.apiInfo.request
    }
    return { requestInfo: res }
  }, shallowEqualApp)

  // 当前选择的项
  const [currentNav, setCurrentNav] = useState(NavType.Params)

  // 表格列信息
  const columns: ColumnsType<NormalParamsType> = [
    {
      title: '参数名',
      dataIndex: 'paramName',
      width: 150,
      render: (text: string, _, index: number) => (
        <Input
          placeholder='参数名'
          value={text}
          onChange={(e) =>
            handleNormalParamsChange(e.target.value, 'paramName', index)
          }
        />
      ),
    },
    {
      title: '类型',
      width: 150,
      render: (_text: string, _, index: number) => (
        // <Input
        //   placeholder='类型'
        //   value={'string'}
        //   style={{ color: '#1677ff', textAlign: 'center', fontWeight: 'bold' }}
        // />
        <Select
          placeholder='类型'
          className='text-blue-600 text-center font-bold w-full'
          onChange={(e) => handleNormalParamsChange(e, 'type', index)}
          defaultValue='string'>
          <Option value='string'>String</Option>
          <Option value='number'>Number</Option>
          <Option value='boolean'>Boolean</Option>
        </Select>
      ),
    },
    {
      title: '参数值',
      dataIndex: 'value',
      render: (text: string, _, index: number) => (
        <Input
          placeholder='参数值'
          value={text}
          onChange={(e) =>
            handleNormalParamsChange(e.target.value, 'value', index)
          }
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 50,
      align: 'center',
      className: 'action',
      render: (_, _record, index) => (
        <Button
          type='text'
          size='small'
          onClick={() => handleNormalParamsAction(false, index)}
          block>
          <MinusCircleOutlined />
        </Button>
      ),
    },
  ]

  // 键值对参数内容编辑事件
  const handleNormalParamsChange = (
    value: string,
    type: 'paramName' | 'value' | 'type',
    index: number,
  ) => {
    const payload = { key: type, value, index, paramType: currentNav }
    console.log(payload)
    dispatch(changeNormalParamsAction(payload))
  }

  // 键值对参数项增减事件
  const handleNormalParamsAction = (isInsert: boolean, removeIndex: number) => {
    dispatch(
      changeParamsItemOptAction({
        isInsert,
        removeIndex,
        paramType: currentNav,
      }),
    )
  }

  // 从源数据中提取出表格的展示数据
  const getTableData = (): NormalParamsType[] => {
    switch (currentNav) {
      case NavType.Params:
        return requestInfo.params
      case NavType.Header:
        return requestInfo.headers
      case NavType.Cookie:
        return requestInfo.cookie
      default:
        return []
    }
  }

  // 获取表格数据
  const handleBodyChange = (value: string): void => {
    dispatch(changeRequestBodyAction(value))
  }

  // 请求参数内容渲染
  const renderContent = (): JSX.Element => {
    if (currentNav === NavType.Body) {
      return (
        <>
          <div className='section-title' style={{ marginBottom: '10px' }}>
            请输入JSON格式的请求体
          </div>
          <CodeEditor
            defaultValue={requestInfo.body}
            height='200px'
            onChange={(val) => handleBodyChange(val)}
            withBorder
          />
        </>
      )
    } else {
      return (
        <Table
          dataSource={getTableData()}
          columns={columns}
          rowKey='id'
          pagination={false}
          footer={() => getTableFooter()}
          bordered
          size='small'
        />
      )
    }
  }
  // 表格footer渲染
  const getTableFooter = (): JSX.Element => {
    return (
      <div className='param-footer'>
        <Button
          type='link'
          size='small'
          onClick={() => handleNormalParamsAction(true, -1)}
          block>
          <PlusOutlined />
        </Button>
      </div>
    )
  }
  return (
    <div className='mock-request'>
      <div className='section-title'>请求参数</div>
      {/* 请求设置导航：Params、Body、Cookie、Header、Auth */}
      <div className='req-nav'>
        {NavItems.map((item) => (
          <div
            className={classNames('nav-item', {
              active: currentNav === item.value,
            })}
            key={item.value}
            onClick={() => setCurrentNav(item.value)}>
            {item.label}
          </div>
        ))}
      </div>
      {/* 请求设置内容 */}
      <div className='content'>{renderContent()}</div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(withMode(MockReqParams))
