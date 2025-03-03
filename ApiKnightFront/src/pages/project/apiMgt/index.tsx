import { PanelLayout } from '@/components/PanelLayout'
import { ConfigProvider, Flex, theme, Tooltip, Button, Dropdown } from 'antd'
import InputSearch from '@/components/InputSearch'

import React from 'react'
import { MenuItemType } from '@/enums.ts'
import { FileIcon, FilterIcon, PlusIcon } from 'lucide-react'
import { IconText } from '@/components/IconText'
import { API_MENU_CONFIG } from '@/config/static.ts'
import { getCatalogType } from '@/helpers.ts'
import { useHelpers } from '@/hooks/useHelpers.ts'
// import './index.less'
import { ApiMenu } from '@/components/ApiMenu'
import RightPage from '@/components/RightPage'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/store'
import { createAllMonitor } from '@/utils/monitor'
import { useLocation } from 'react-router-dom'
import {
  addDataItemAction,
  changeCurrentKeyAction,
} from '@/store/modules/tabSlice.ts'
import { setValue } from '@/store/modules/rightSlice.ts'
const ApiMgt: React.FunctionComponent = () => {
  const { token } = theme.useToken()
  const { createTabItem } = useHelpers()
  const dispatch = useDispatch()
  createAllMonitor().start()
  const { currentKey } = useAppSelector((state) => ({
    currentKey: state.tabSlice.currentKey,
  }))
  const state = useLocation().state
  const project_id = state.project_id
  function handleOverviewClick() {
    const overviewData = {
      key: 'project-summary',
      title: '项目概览',
      type: 'gl',
    }

    dispatch(addDataItemAction({ item: overviewData, index: 0 }))
    dispatch(changeCurrentKeyAction('project-summary'))
    dispatch(setValue('gl'))
  }
  return (
    <PanelLayout
      layoutName='接口管理'
      left={
        <>
          <Flex
            gap={token.paddingXXS}
            style={{ padding: token.paddingXS }}
            children={''}>
            <InputSearch />
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    paddingInline: token.paddingXS,
                    defaultBorderColor: token.colorBorderSecondary,
                  },
                },
              }}>
              <Tooltip title='显示筛选条件'>
                <Button>
                  <IconText icon={<FilterIcon size={16} />} />
                </Button>
              </Tooltip>

              <Dropdown
                menu={{
                  items: [
                    ...[MenuItemType.ApiDetail].map((t) => {
                      // const { newLabel } = API_MENU_CONFIG[getCatalogType(t)]
                      return {
                        key: t,
                        label: '新建 接口',
                        icon: (
                          <FileIcon
                            size={16}
                            style={{ color: token.colorPrimary }}
                            type={t}
                          />
                        ),
                        onClick: () => {
                          createTabItem(t)
                        },
                      }
                    }),
                  ],
                }}>
                <Button type='primary'>
                  <IconText icon={<PlusIcon size={18} />} />
                </Button>
              </Dropdown>
            </ConfigProvider>
          </Flex>
          <div className='flex-1 overflow-y-auto'>
            <ApiMenu />
          </div>
        </>
      }
      right={
        <>
          <RightPage project_id={project_id} />
        </>
      }
    />
  )
}
export default ApiMgt
