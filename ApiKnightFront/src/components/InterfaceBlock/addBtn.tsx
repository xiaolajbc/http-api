import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { increment } from '@/store/modules/watchDir'
import type { AddData } from '@/types/treeComponents'
import { PlusOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { Input, Modal, notification } from 'antd'
import { createApi } from '@/api'
import { getUserId } from '@/utils/storage/storage'

const AddBtn: React.FunctionComponent<{ data: AddData }> = (props) => {
  const dispatch = useDispatch()
  const { data } = props
  const state = useLocation().state
  const projectId = state?.project_id

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [api, contextHolder] = notification.useNotification()
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // 打开模态框（使用事件阻止冒泡）
  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡

    if (!projectId) {
      api.error({
        message: '操作失败',
        description: '未找到当前项目信息，请刷新页面重试',
      })
      return
    }
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      api.error({ message: '输入不完整', description: '请填写接口名称' })
      return
    }

    setLoading(true)
    try {
      await createApi(
        projectId,
        data.key,
        getUserId(),
        formData.name,
        formData.description,
      )
      dispatch(increment())
      setModalVisible(false)
      setFormData({ name: '', description: '' })
      api.success({ message: '新增成功', description: '接口信息已成功添加' })
    } catch (error) {
      console.error('新增失败:', error)
      api.error({
        message: '新增失败',
        description:
          error.response?.data?.message || '请检查输入信息或网络连接',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* 单独图标元素，无需包裹容器 */}
      <PlusOutlined
        style={{
          cursor: 'pointer',
          color: '#1890ff',
          fontSize: 16,
          marginLeft: 8,
        }}
        onClick={handleOpenModal}
      />

      {/* 始终渲染Modal，通过open属性控制显示 */}
      <Modal
        title='新增接口'
        open={modalVisible}
        onOk={handleSubmit}
        confirmLoading={loading}
        onCancel={() => setModalVisible(false)}
        okText='确认'
        cancelText='取消'
        maskClosable={false}
        keyboard={false}
        destroyOnClose>
        <div style={{ padding: '24px 0' }}>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder='接口名称（必填）'
            allowClear
            style={{ marginBottom: 16 }}
          />
          <Input.TextArea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder='接口描述'
            allowClear
            autoSize={{ minRows: 3 }}
          />
        </div>
      </Modal>

      {contextHolder}
    </>
  )
}

export default AddBtn
