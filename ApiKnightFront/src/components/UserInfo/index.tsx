import React, {
  MouseEventHandler,
  useState,
  useEffect,
  useCallback,
} from 'react'
import './index.less'
import { CloseOutlined } from '@ant-design/icons'
import { SendProps, UserShowType } from '@/types/userInfo'
import { Button, Table } from 'antd'
import ReactDOM from 'react-dom'
import { ColumnsType } from 'antd/es/table'
import Overlay from '../overlay'
import { useDispatch, useSelector } from 'react-redux'
import { setValue } from '@/store/modules/userInfoSlice'
import UpdateUserInfo from '@/components/UpdateUserInfo'
import { setIValue } from '@/store/modules/updateUserInfoSlice'
import { RootState } from '@/store'
import { useNavigate } from 'react-router-dom'
import { apiQuerySelf } from '@/api'

const UserInfo: React.FunctionComponent = () => {
  const dispatch = useDispatch()
  const [data, setData] = useState<SendProps>({
    sendType: 'email',
  })
  const showUpdate = useCallback(
    (type: 'email' | 'phone' | 'username'): MouseEventHandler<HTMLElement> => {
      return () => {
        dispatch(setIValue(true))
        setData({
          sendType: type,
        })
      }
    },
    [dispatch],
  )
  const columns: ColumnsType<UserShowType> = [
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'use',
      dataIndex: 'use',
      key: 'use',
    },
  ]
  const [tableData, setTableData] = useState<UserShowType[]>([
    {
      id: 'username',
      key: '1',
      type: '名称',
      value: '',
      use: (
        <Button onClick={showUpdate('username')} danger>
          修改
        </Button>
      ),
    },
    {
      id: 'email',
      key: '2',
      type: '邮箱',
      value: '',
      use: (
        <Button onClick={showUpdate('email')} danger>
          修改
        </Button>
      ),
    },
    {
      id: 'phone',
      key: '3',
      type: '电话',
      value: '',
      use: (
        <Button onClick={showUpdate('phone')} danger>
          修改
        </Button>
      ),
    },
  ])
  const closeThisPage = useCallback(() => {
    dispatch(setValue(false))
  }, [dispatch])
  const updateUserInfoSlice = useSelector(
    (state: RootState) => state.updateUserInfoSlice.value,
  )
  const isUpdateSlice = useSelector(
    (state: RootState) => state.isUpdateSlice.value,
  )
  useEffect(() => {
    const func = async () => {
      const resp = await apiQuerySelf()
      setTableData([
        {
          id: 'username',
          key: '1',
          type: '名称',
          value: resp.data.username,
          use: (
            <Button onClick={showUpdate('username')} danger>
              修改
            </Button>
          ),
        },
        {
          id: 'email',
          key: '2',
          type: '邮箱',
          value: resp.data.email,
          use: (
            <Button onClick={showUpdate('email')} danger>
              修改
            </Button>
          ),
        },
        {
          id: 'phone',
          key: '3',
          type: '电话',
          value: resp.data.phone,
          use: (
            <Button onClick={showUpdate('phone')} danger>
              修改
            </Button>
          ),
        },
      ])
    }
    func()
  }, [isUpdateSlice, showUpdate])
  const navigate = useNavigate()
  const quit = useCallback((): void => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('token')
    closeThisPage()
    navigate('/user/login')
  }, [closeThisPage, navigate])
  return ReactDOM.createPortal(
    <div className='userInfo'>
      {updateUserInfoSlice && <UpdateUserInfo data={data} />}
      <div className='userInfo-title'>
        <h1>基本设置</h1>
        <div className='userInfo-title__closed' onClick={closeThisPage}>
          <CloseOutlined />
        </div>
      </div>
      <div className='userInfo-content'>
        <Table showHeader={false} columns={columns} dataSource={tableData} />;
        <Button danger block onClick={quit}>
          退出登录
        </Button>
      </div>
      <Overlay data={10000} />
    </div>,
    document.body,
  )
}

export default UserInfo
