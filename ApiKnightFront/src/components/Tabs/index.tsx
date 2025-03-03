import React, { useCallback, useEffect, useState } from 'react'
import Tab from '@/components/Tab'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/store'
import {
  changeCurrentKeyAction,
  removeTabAction,
  reorderTabs,
} from '@/store/modules/tabSlice'
import { setValue } from '@/store/modules/rightSlice'
import classNames from 'classnames'

const Tabs: React.FunctionComponent = () => {
  const dispatch = useDispatch()
  const { tabs, currentKey } = useAppSelector((state) => ({
    tabs: state.tabSlice.data,
    currentKey: state.tabSlice.currentKey,
  }))

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // 同步右侧面板状态
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.key === currentKey)
    dispatch(
      setValue(currentTab?.type === 'gl' ? 'gl' : currentTab?.key || 'blank'),
    )
  }, [currentKey, dispatch, tabs])

  // 处理无标签页状态
  useEffect(() => {
    if (tabs.length === 0) dispatch(setValue('blank'))
  }, [dispatch, tabs])

  // 关闭标签处理
  const handleTabClose = useCallback(
    (index: number) => {
      if (tabs.length <= 1) return

      const newIndex = index >= tabs.length - 1 ? index - 1 : index
      const newKey = tabs[newIndex]?.key || 'project-summary'

      dispatch(changeCurrentKeyAction(newKey))
      dispatch(removeTabAction(index))
    },
    [dispatch, tabs],
  )

  // 优化后的拖拽逻辑
  const handleDragStart = (index: number) => {
    if (index === 0) return
    setDraggingIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (index === 0 || draggingIndex === null || draggingIndex === index) return
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (
      draggingIndex !== null &&
      dragOverIndex !== null &&
      draggingIndex !== dragOverIndex
    ) {
      dispatch(
        reorderTabs({
          sourceIndex: draggingIndex,
          destinationIndex: dragOverIndex,
        }),
      )
    }
    setDraggingIndex(null)
    setDragOverIndex(null)
  }

  // 生成插入位置指示线样式
  const getInsertionStyle = (index: number) => {
    if (dragOverIndex === null || draggingIndex === null) return {}
    if (index === dragOverIndex) {
      return {
        '--insert-position': dragOverIndex > draggingIndex ? '100%' : '0%',
      } as React.CSSProperties
    }
    return {}
  }

  return (
    <div className='flex space-x-2'>
      {tabs.map((item, index) => (
        <div
          key={`tab-${item.key}`}
          className={classNames('px-4 py-2 border-b-2 cursor-pointer', {
            'border-blue-500 text-blue-500': item.key === currentKey,
            'opacity-50': draggingIndex === index,
            'font-bold': index === 0,
          })}
          draggable={index !== 0}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          onDragLeave={() => setDragOverIndex(null)}
          style={getInsertionStyle(index)}>
          <Tab
            data={item}
            active={item.key === currentKey}
            onRemoveTab={() => handleTabClose(index)}
            onSelected={() => dispatch(changeCurrentKeyAction(item.key))}
            index={index}
          />
          <div
            className='absolute bottom-0 left-0 w-full h-1 bg-blue-500'
            style={getInsertionStyle(index)}
          />
        </div>
      ))}
    </div>
  )
}

export default React.memo(Tabs)
