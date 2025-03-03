import React, { useState } from 'react'
import classNames from 'classnames'
import { CloseOutlined } from '@ant-design/icons'
import MethodList from '@/components/MethodList'
import { Props } from '@/types/tabs'

const Tab: React.FunctionComponent<Props> = ({
  active,
  onRemoveTab,
  onSelected,
  index,
  data,
}) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={classNames('flex items-center space-x-2', {
        'text-blue-500': active,
        'hover:text-blue-500': !active,
      })}
      onClick={() => onSelected(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <span className='flex-shrink-0'>
        <MethodList value={data.type} />
      </span>
      <span>{data.title}</span>

      {index !== 0 && (
        <span
          className={classNames(
            'text-gray-400 hover:text-red-500 cursor-pointer',
            {
              'opacity-0': !hovered,
              'opacity-100': hovered,
            },
          )}
          onClick={(e) => {
            e.stopPropagation()
            onRemoveTab?.(index)
          }}>
          <CloseOutlined />
        </span>
      )}
    </div>
  )
}

export default React.memo(Tab)
