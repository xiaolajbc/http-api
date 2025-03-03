import React, { useState, useEffect, useCallback, Children } from 'react'
import './index.less'
import ProjectItem from '@/components/ProjectItem'
import { Layout, Button, Menu, ConfigProvider, theme, Tabs } from 'antd'
import HeaderNav from '@/components/HeaderNav'
import Icon, { SettingOutlined } from '@ant-design/icons'
import CreateProject from '@/components/CreateProject'
import getUserInfo from '@/api/getUserInfo'
import EmptyShow from '@/components/EmptyShow'
import { ProjectListItem } from '@/types/response.type'
import { createAllMonitor } from '@/utils/monitor'
import { PanelLayout } from '@/components/PanelLayout'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'
import { Header } from 'antd/es/layout/layout'

const { Content, Footer } = Layout

const User = () => {
  const user_id = localStorage.getItem('user_id')
  const { token } = theme.useToken()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [user_info, setUserInfo] = useState({})
  const [projectList, setProjectList] = useState<ProjectListItem[]>([])
  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])
  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])
  createAllMonitor().start()

  type ItemType<T> = {
    key: string
    title?: string
    label: React.ReactNode
    type?: 'group'
    children?: ItemType<T>[]
  }

  const updateUserInfo = useCallback(() => {
    getUserInfo(user_id).then((res) => {
      const data = res.data.data
      setUserInfo(data)
      // 项目按照创建时间，后创建的在前面
      const sortedProjectList = data.project_list
      sortedProjectList.sort((a: ProjectListItem, b: ProjectListItem) => {
        const aTime = new Date(a.create_time).getTime()
        const bTime = new Date(b.create_time).getTime()
        return bTime - aTime
      })
      setProjectList(sortedProjectList)
    })
  }, [user_id])
  useEffect(() => {
    updateUserInfo()
  }, [updateUserInfo])

  const items: ItemType<MenuItemType>[] = [
    {
      key: '0',
      title: '个人团队',
      label: (
        <div className='flex items-center gap-2'>
          <SettingOutlined />
          通用设置
        </div>
      ),
      type: 'group' as const,
      children: [{ key: '1', label: '个人团队' }],
    },
    {
      key: '2',
      title: '新建团队',
      label: (
        <Button
          type='link'
          className='text-purple-500 hover:text-purple-600'
          onClick={() => setIsModalOpen(true)}>
          <span className='mr-2'>+</span>新建团队
        </Button>
      ),
    },
  ]

  const right = () => {
    return (
      <Layout>
        {/* 页面头部 */}
        <Header className='bg-white shadow'>
          <div className='flex justify-end items-center w-full max-w-7xl mx-auto px-4'>
            <Button
              type='link'
              className='text-white border-solid bg-purple-600 text-center h-12 items-center mr-4 mt-2 translate-x-4'>
              <Icon type='import' className='mr-2' />
              导入项目
            </Button>
            <Button
              type='link'
              className='text-white border-solid bg-purple-600 text-center h-12 items-center mr-4 mt-2 translate-x-4'
              onClick={() => setIsModalOpen(true)}>
              <Icon type='import' className='mr-2' />
              新建项目
            </Button>
          </div>
        </Header>
        <Content>
          <div className='ml-5 mt-10'>
            {projectList.length ? (
              projectList.map((value, _index) => {
                return (
                  <div className='item' key={value.id}>
                    <ProjectItem
                      name={value.projectname}
                      dec={value.description}
                      project_id={value.id}
                      project_img={value.project_img}
                      updateUserInfo={updateUserInfo}></ProjectItem>
                  </div>
                )
              })
            ) : (
              <div className='item-empty'>
                <EmptyShow />
              </div>
            )}
          </div>
        </Content>
      </Layout>
    )
  }

  return (
    <>
      <CreateProject
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        updateUserInfo={updateUserInfo}
        user_id={user_id}
      />
      <PanelLayout
        layoutName='项目'
        left={
          <div>
            <ConfigProvider
              theme={{
                components: {
                  Menu: {
                    activeBarBorderWidth: 0,
                    itemHeight: 32,
                    itemSelectedBg: token.colorBgTextHover,
                    itemActiveBg: token.colorBgTextHover,
                    itemSelectedColor: token.colorText,
                  },
                },
              }}>
              <Menu items={items} mode='inline' />
            </ConfigProvider>
          </div>
        }
        right={right()}
      />
    </>
  )
}

export default User
