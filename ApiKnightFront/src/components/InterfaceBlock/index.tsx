import React, { useState } from 'react'
import './index.less'
import AddBtn from './addBtn.tsx'
import DelBtn from './delBtn.tsx'
import type { AddData } from '@/types/treeComponents'
import MethodList from '@/components/MethodList'
import Menu from '@/components/InterfaceBlock/menu.tsx'
import { addData } from '@/store/modules/tabSlice.ts'
import { useDispatch } from 'react-redux'
import { setValue } from '@/store/modules/rightSlice'
import { ArrayItem, delProps } from '@/types/arrayToTree'
import { changeCurrentKeyAction } from '@/store/modules/tabSlice'

const InterfaceBlock: React.FunctionComponent<{ data: ArrayItem }> = (
  props,
) => {
  const [show, setShowState] = useState(false)
  const data = props.data.title as ArrayItem // 明确类型
  const dispatch = useDispatch()
  const menuData: AddData = { key: data.key, pid: data.pid, type: data.type }

  // 使用防抖避免快速鼠标事件
  let hoverTimer: NodeJS.Timeout
  const handleHover = (state: boolean) => {
    clearTimeout(hoverTimer)
    hoverTimer = setTimeout(() => {
      setShowState(state)
    }, 100)
  }

  const openTab = () => {
    if (data.type !== 'FILE') {
      const d = {
        key: data.key,
        title: data.title,
        type: data.type,
      }
      dispatch(addData(d))
      dispatch(setValue(data.key))
      dispatch(changeCurrentKeyAction(data.key))
    }
  }

  return (
    <div
      className='InterfaceBlock ant-card' // 引入 Ant Design 的卡片样式类
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onDoubleClick={openTab}>
      <div className='interface-type ant-card-head'>
        <MethodList value={data.type} />
      </div>

      <div className='InterfaceBlock-title ant-card-body'>
        {String(data.title)}
      </div>

      <div className='btn ant-card-extra'>
        <div
          style={{
            display: 'flex',
            opacity: show ? 1 : 0,
            transition: 'opacity 0.2s',
            pointerEvents: show ? 'auto' : 'none',
          }}>
          {data.pid !== null && <DelBtn data={data as delProps} />}
          {data.type === 'FILE' && <AddBtn data={data as AddData} />}
        </div>
        <Menu data={menuData} />
      </div>
    </div>
  )
}

export default React.memo(InterfaceBlock)
