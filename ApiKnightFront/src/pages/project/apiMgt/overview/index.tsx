import React, { useEffect, useState } from 'react'
import './index.less'
import { useLocation } from 'react-router-dom'
import { Badge, Descriptions, Button, Modal, Input, App } from 'antd'
import type { DescriptionsProps } from 'antd'
import getProjectBase from '@/api/getProjectBase'
import { requestByServerProxy } from '@/api/service'
import { parseSwaggerDoc } from '@/utils/api/api'
import { getUserId } from '@/utils/storage/storage'
import { IAPIInfo } from '@/types/api'
import { useAppDispatch, useAppSelector } from '@/store'
import { createFolder, getFolderName } from '@/api/folder'
import { createFullApi, shareApi } from '@/api'
import { getProjectInfoById } from '@/api/project'
import { fetchProjectInfoAction } from '@/store/modules/project'

const Overview: React.FunctionComponent = () => {
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  // 导入相关
  const [importUrl, setImportUrl] = useState<string>('')
  const [onImportVisible, setOnImportVisible] = useState<boolean>(false)
  const [onImporting, setOnImporting] = useState<boolean>(false)
  // 分享（导出相关）
  const [shareUrl, setShareUrl] = useState<string>('')
  const [onShareVisible, setOnShareVisible] = useState<boolean>(false)
  // const [onShareing, setOnShareing] = useState<boolean>(false)
  const onShareing = false
  const state = useLocation().state
  interface ProjectBaseInfo {
    projectname?: string
    description?: string
    create_time?: string
    apis_count?: number
    members_count?: number
  }
  const [projectBase, setProjectBase] = useState<ProjectBaseInfo>({})
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '项目名称',
      children:
        projectBase.projectname !== undefined ? projectBase.projectname : '',
      span: 1,
    },
    {
      key: '2',
      label: '项目描述',
      children:
        projectBase.description !== undefined ? projectBase.description : '',
      span: 1,
    },
    {
      key: '3',
      label: '创建时间',
      children:
        projectBase.create_time !== undefined ? projectBase.create_time : '',
      span: 1,
    },
    {
      key: '4',
      label: 'Api数量',
      children:
        projectBase.apis_count !== undefined ? projectBase.apis_count : '',
      span: 1,
    },
    {
      key: '5',
      label: '成员数量',
      children: projectBase.members_count ? projectBase.members_count : '',
      span: 1,
    },
    {
      key: '6',
      label: '项目状态',
      children: <Badge status='processing' text='Running' />,
      span: 1,
    },
  ]

  const { apiList } = useAppSelector((state) => ({
    apiList: state.project.projectInfo.api_list,
  }))
  useEffect(() => {
    getProjectBase(state.project_id).then((res) => {
      res.data.code === 200 ? setProjectBase(res.data.data) : ''
    })
  }, [state.project_id])

  const { folderList, projectId } = useAppSelector((state) => ({
    folderList: state.project.projectInfo.folder_list,
    projectId: state.project.projectInfo.id,
  }))

  async function handleConfirmImport() {
    setOnImporting(true)
    try {
      const { data } = await requestByServerProxy({
        url: importUrl,
        method: 'GET',
        headers: '',
        data: '',
      })
      if (data?.type === 'api') {
        await startImportApiKnightDoc(data.data, getUserId())
      } else {
        const apiInfoMap = parseSwaggerDoc(data, getUserId())
        await startImport(apiInfoMap)
      }

      message.success('导入成功')
    } catch (err) {
      message.error('导入失败，请检查URL是否正确\n' + err)
      console.log(err)

      console.trace(err)
    } finally {
      setOnImporting(false)
      setOnImportVisible(false)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }
  async function startImportApiKnightDoc(
    apiInfoListStr: string,
    userId: string,
  ) {
    const createdFolderList: string[] = []
    const apiInfoList: IAPIInfo[] = JSON.parse(apiInfoListStr)
    const rootFolderId = folderList.find((item) => item.name === '根目录')?.id
    for (let i = 0; i < apiInfoList.length; i++) {
      const apiInfoItem = apiInfoList[i]
      apiInfoItem.meta_info.owner_id = userId
      apiInfoItem.meta_info.notes = '来自分享的ApiKnight接口'
      if (!apiInfoItem?.apiInfo?.response?.body) {
        apiInfoItem.apiInfo.response.body = '{}'
      }
      if (!apiInfoItem?.meta_info?.name) {
        apiInfoItem.meta_info.name = '未命名接口'
      }
      let folderName = '根目录'
      if (apiInfoItem?.meta_info?.folder_id) {
        folderName = await getFolderName(apiInfoItem.meta_info.folder_id)
        apiInfoList[i].meta_info.folder_id = folderName
      } else {
        apiInfoList[i].meta_info.folder_id = '根目录'
      }
      const folderIndexInProj = folderList.findIndex(
        (item) => item.name === folderName,
      )
      if (folderIndexInProj === -1) {
        if (createdFolderList.indexOf(folderName) === -1) {
          await createFolder(projectId, rootFolderId, folderName)
          createdFolderList.push(folderName)
        }
      }
    }
    const resp = await getProjectInfoById(projectId)
    const { folder_list: newestFolderList } = resp.data
    for (const apiInfoItem of apiInfoList) {
      const folderIndexInProj = newestFolderList.findIndex(
        (item) => item.name === apiInfoItem.meta_info.folder_id,
      )
      if (folderIndexInProj !== -1) {
        const folderId = newestFolderList[folderIndexInProj].id
        await createFullApi({
          projectId,
          folderId,
          name: apiInfoItem.meta_info.name,
          description: apiInfoItem.meta_info.description || '无描述',
          requestData: apiInfoItem,
          responseDataStr: apiInfoItem.apiInfo.response.body,
        })
      }
    }
    dispatch(fetchProjectInfoAction(projectId))
  }

  async function startImport(apiInfoMap: Map<string, IAPIInfo[]>) {
    const createdFolderList: string[] = []
    const rootFolderId = folderList.find((item) => item.name === '根目录')?.id
    for (const [folderName] of apiInfoMap) {
      const folderIndexInProj = folderList.findIndex(
        (item) => item.name === folderName,
      )
      if (folderIndexInProj === -1) {
        if (createdFolderList.indexOf(folderName) === -1) {
          await createFolder(projectId, rootFolderId, folderName)
          createdFolderList.push(folderName)
        }
      }
    }
    const res = await getProjectInfoById(projectId)
    const { folder_list: newestFolderList } = res.data

    for (const [folderName, apiList] of apiInfoMap) {
      const folderIndexInProj = newestFolderList.findIndex(
        (item) => item.name === folderName,
      )
      if (folderIndexInProj !== -1) {
        for (const apiItem of apiList) {
          const folderId = newestFolderList[folderIndexInProj].id
          await createFullApi({
            projectId,
            folderId,
            name: apiItem.meta_info.name,
            description: apiItem.meta_info.description || '无描述',
            requestData: apiItem,
            responseDataStr: apiItem.apiInfo.response.body,
          })
        }
      }
    }
    dispatch(fetchProjectInfoAction(projectId))
  }

  async function startShare() {
    setShareUrl('正在生成分享链接...')
    setOnShareVisible(true)
    const shareURL = await shareApi(apiList, projectId)
    setShareUrl(shareURL)
  }

  async function handleConfirmShare() {
    navigator.clipboard.writeText(shareUrl)
    message.success('复制成功')
    setOnShareVisible(false)
  }

  return (
    <>
      <div className='project-overview'>
        <div className='content-item'>
          <div className='title'>基本信息</div>
          <Descriptions bordered items={items} />
        </div>
        <div className='content-item'>
          <div className='title'>分享接口</div>
          <div className='content-detail'>
            <div className='desc'>
              获取项目内接口链接，方便发送给外部团队，外部团队可以使用链接导入接口信息
            </div>
            <div className='opts'>
              <Button type='dashed' onClick={startShare}>
                创建分享
              </Button>
            </div>
          </div>
        </div>

        <div className='content-item'>
          <div className='title'>自动导入</div>
          <div className='content-detail'>
            <div className='desc'>
              自动将OpenAPI（Swagger）格式的在线URL接口或者通过本平台分享的URL接口输入，并导入这个项目
            </div>
            <div className='opts'>
              <Button type='dashed' onClick={(_e) => setOnImportVisible(true)}>
                开始导入
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title='开始导入'
        open={onImportVisible}
        confirmLoading={onImporting}
        onOk={handleConfirmImport}
        onCancel={() => setOnImportVisible(false)}>
        <Input
          style={{ marginTop: '15px' }}
          placeholder='OpenAPI（Swagger2.0）在线URL获取本平台的分享链接'
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
        />
      </Modal>

      <Modal
        title='分享接口'
        open={onShareVisible}
        confirmLoading={onShareing}
        onOk={handleConfirmShare}
        onCancel={() => setOnShareVisible(false)}
        okText='复制接口链接'>
        <Input
          style={{ marginTop: '15px' }}
          placeholder='分享链接'
          value={shareUrl}
        />
      </Modal>
    </>
  )
}

export default Overview
