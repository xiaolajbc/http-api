import { useStyles } from '@/hooks/useStyles'
import { css } from '@emotion/css'
import { Space } from 'antd'
import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './index.less'
interface NavItemProps {
  active?: boolean
  name: string
  icon: React.ReactNode
  onClick: () => void
}

const NavItem = (props: NavItemProps) => {
  const { active, name, icon, onClick } = props

  const navigate = useNavigate()
  const location = useLocation()
  const { styles } = useStyles(({ token }) => {
    return {
      item: css({
        color: active ? token.colorPrimary : token.colorTextSecondary,

        '&:hover': {
          backgroundColor: token.colorFillTertiary,
        },
      }),
    }
  })

  return (
    <div
      className={`flex cursor-pointer flex-col items-center gap-1 rounded-md p-2 ${styles.item}`}
      onClick={onClick}>
      {icon}

      <span className='text-xs'>{name}</span>
    </div>
  )
}

const NavMenu = () => {
  // todo: 这里的onclick存在react router的错误
  const navigate = useNavigate()
  const location = useLocation()
  const items: Array<NavItemProps> = [
    {
      name: '接口管理',
      icon: (
        <svg
          aria-hidden='true'
          className='size-6'
          fill='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            clipRule='evenodd'
            d='M20 10H4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8ZM9 13v-1h6v1c0 .6-.4 1-1 1h-4a1 1 0 0 1-1-1Z'
            fillRule='evenodd'
          />
          <path d='M2 6c0-1.1.9-2 2-2h16a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2Z' />
        </svg>
      ),
      active: location.pathname === '/project/apiMgt' ? true : false,
      onClick: () => {
        navigate('/project/apiMgt')
      },
    },
    {
      name: '项目配置',
      icon: (
        <svg
          aria-hidden='true'
          className='size-6'
          fill='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            clipRule='evenodd'
            d='M9.6 2.6A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2l.5.3a2 2 0 0 1 2.9 0l1.4 1.3a2 2 0 0 1 0 2.9l.1.5h.1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2l-.3.5a2 2 0 0 1 0 2.9l-1.3 1.4a2 2 0 0 1-2.9 0l-.5.1v.1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2l-.5-.3a2 2 0 0 1-2.9 0l-1.4-1.3a2 2 0 0 1 0-2.9l-.1-.5H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2l.3-.5a2 2 0 0 1 0-2.9l1.3-1.4a2 2 0 0 1 2.9 0l.5-.1V4c0-.5.2-1 .6-1.4ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z'
            fillRule='evenodd'
          />
        </svg>
      ),
      active: location.pathname === '/project/projectSet' ? true : false,
      onClick: () => {
        navigate('/project/memberMgt')
      },
    },
  ]
  return (
    <Space direction='vertical' size={14}>
      {items.map((item) => {
        return (
          <NavItem
            active={item.active}
            name={item.name}
            icon={item.icon}
            key={item.name}
            onClick={item.onClick}
          />
        )
      })}
    </Space>
  )
}
export default NavMenu
