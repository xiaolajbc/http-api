import React, { memo } from 'react'
import { Table, Input, Button, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { ParamsProps } from './type'
import type { NormalParamsType } from '@/types/api'
import './index.less'

const NormalParamTable: React.FunctionComponent<ParamsProps> = memo((props) => {
  const { dataSource, onParamDelClick, onParamAddClick, onParamInfoChange } =
    props

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
            onParamInfoChange(e.target.value, 'paramName', index)
          }
        />
      ),
    },
    {
      title: '类型',
      width: 150,
      render: (_text: string, _, index: number) => (
        <Select
          placeholder='类型'
          className='text-blue-600 text-center font-bold w-full'
          onChange={(e) => onParamInfoChange(e, 'type', index)}
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
          onChange={(e) => onParamInfoChange(e.target.value, 'value', index)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 50,
      align: 'center',
      className: 'action',
      render: (_, record, index) => (
        <Button
          type='text'
          size='small'
          onClick={() => onParamDelClick(index, record)}
          block>
          <MinusCircleOutlined />
        </Button>
      ),
    },
  ]

  // 表格footer渲染
  const getTableFooter = (): JSX.Element => {
    return (
      <div className='param-footer'>
        <Button
          type='link'
          size='small'
          onClick={() => onParamAddClick()}
          block>
          <PlusOutlined />
        </Button>
      </div>
    )
  }

  return (
    <div className='param-table-cpn'>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey='id'
        pagination={false}
        footer={() => getTableFooter()}
        bordered
        size='small'
      />
    </div>
  )
})

export default NormalParamTable
