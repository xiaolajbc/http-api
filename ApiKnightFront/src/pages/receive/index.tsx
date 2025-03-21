import React, { useCallback, useEffect, useState } from 'react'
import { Button, notification } from 'antd'
import './index.less'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { NotificationPlacement } from 'antd/es/notification/interface'
import { AxiosResponse } from 'axios'
import { Result } from '@/api/request.type'
import { MemberList } from '@/types/response.type'
import getProjectMember from '@/api/getProjectMember'
import { getProjectInfoById } from '@/api/project'
import { apiReceive } from '@/api/invite'
import { createAllMonitor } from '@/utils/monitor'

const Receive: React.FunctionComponent = () => {
  const navigate = useNavigate()
  createAllMonitor().start()
  const [searchParams] = useSearchParams()
  const [api, contextHolder] = notification.useNotification()
  const [isJoin, setIsJoin] = useState(false)

  const sendJoin = useCallback(async () => {
    const resp = await apiReceive(Number(searchParams.get('projectid')))
    const logInfo = isJoin === false ? resp.message : '您已加入该项目组'
    const openNotification = (placement: NotificationPlacement) => {
      api.info({
        message: <p>{logInfo}</p>,
        description: <p>3s后返回主界面</p>,
        placement,
      })
    }
    openNotification('topLeft')
    setTimeout(() => {
      navigate('/')
    }, 3000)
  }, [searchParams, isJoin, api, navigate])

  const [projectName, setProjectName] = useState('')

  useEffect(() => {
    const func = async () => {
      const resp = await getProjectInfoById(
        Number(searchParams.get('projectid')),
      )
      setProjectName(resp.data.projectname as string)

      getProjectMember(Number(searchParams.get('projectid'))).then(
        (resp: AxiosResponse<Result<MemberList[]>>) => {
          const user_id = localStorage.getItem('user_id')
          const dataList = resp.data.data
          dataList.map((item) => {
            if (item.user_id === user_id) {
              setIsJoin(true)
            }
          })
        },
      )
    }
    func()
  }, [searchParams])

  return (
    <div className='receive'>
      {contextHolder}
      <h1>ApiKnight</h1>
      <p>
        我们 在 ApiKnight 中邀请您加入 <strong>{projectName}</strong> 项目
      </p>
      <div className='receive-btn'>
        <Button type='primary' size='large' onClick={sendJoin}>
          立即加入
        </Button>
      </div>
      <p style={{ fontSize: '16px' }}>
        Apifox = Postman + Swagger + Mock + Jmeter
      </p>
      <p style={{ fontSize: '16px' }}>
        API 文档、API 调试、API Mock、API 自动导入
      </p>
      <p style={{ marginTop: '9.6%' }}>ApiKnight - 节约团队每一分钟</p>
      <p>ApiKnight.com</p>
    </div>
  )
}

export default Receive
