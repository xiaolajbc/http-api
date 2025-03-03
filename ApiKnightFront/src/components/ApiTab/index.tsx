import { Button, Dropdown, Space } from 'antd'
import { InfoIcon, SettingsIcon } from 'lucide-react'
import React from 'react'
import { IconLogo } from '../IconLogo'
import { show } from '@ebay/nice-modal-react'
import ModalSettings, { SettingsMenuKey } from '../ModalSettings/ModalSetting'

const ApiTab = () => {
  return (
    <div className='flex items-center'>
      <div className='ml-auto'>
        <Space size={4}>
          <Button
            icon={<SettingsIcon size={14} />}
            size='small'
            type='text'
            onClick={() => {
              void show(ModalSettings)
            }}
          />

          <Dropdown
            menu={{
              items: [
                {
                  key: '0',
                  label: '关于项目',
                  icon: <InfoIcon size={16} />,
                },
              ],
              onClick: () => {
                void show(ModalSettings, { selectedKey: SettingsMenuKey.About })
              },
            }}>
            <Button
              icon={
                <div className='inline-flex size-4 items-center justify-center'>
                  <IconLogo />
                </div>
              }
              size='small'
              type='text'
            />
          </Dropdown>
        </Space>
      </div>
    </div>
  )
}
export default ApiTab
