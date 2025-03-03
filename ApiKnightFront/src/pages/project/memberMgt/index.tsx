// import React, { useCallback, useEffect, useState } from 'react'
// import getProjectMember from '@/api/getProjectMember'
// import { useLocation } from 'react-router-dom'
// import {
//   Avatar,
//   Button,
//   List,
//   Skeleton,
//   Modal,
//   message,
//   Dropdown,
//   App,
//   Popconfirm,
// } from 'antd'
// import './index.less'
// import getApplyList from '@/api/getApplyList'
// import updateApply from '@/api/updateApply'
// import type { MenuProps } from 'antd'
// import updateAuthority from '@/api/updateAuthority'
// import getCurrentRole from '@/api/getCurrentRole'
// import reqDelMember from '@/api/reqDelMember'
// import chgProjAdmin from '@/api/chgProjAdmin'
// import ShowMember from '@/components/ShowMember'
// import { MemberList } from '@/types/response.type'
// import { createAllMonitor } from '@/utils/monitor'
//
// const MemberMgt: React.FC = () => {
//   const state = useLocation().state
//   createAllMonitor().start()
//   type ValueMemberList = MemberList & { key: string }
//   const { project_id } = state
//
//   const [isModalOpen, setIsModalOpen] = useState(false)
//
//   const [initLoading, setInitLoading] = useState(true)
//
//   const [moreLoading] = useState(false)
//
//   const [member_list, setMemberList] = useState<Array<ValueMemberList>>()
//
//   const [apply_list, setApplyList] = useState([])
//
//   const [dNumber, setDNumber] = useState(0)
//
//   const [number, setNumber] = useState(1)
//
//   useEffect(() => {
//     getApplyList(project_id).then((res) => {
//       if (res.data.code === 200) {
//         setDNumber(res.data.data.length)
//       } else {
//         console.log('审批列表拉取失败')
//       }
//     })
//   }, [project_id])
//
//   const [currentUid, setCurrentUid] = useState<string>('')
//   const [role, setRoleState] = useState<number>(0)
//   const showModal = () => {
//     updateApplyList()
//     setIsModalOpen(true)
//   }
//
//   const updateApplyList = () => {
//     getApplyList(project_id).then((res) => {
//       if (res.data.code === 200) {
//         setApplyList(res.data.data.reverse())
//       } else {
//         console.log('审批列表拉取失败')
//       }
//     })
//   }
//
//   const updateMemberList = useCallback(
//     () =>
//       getProjectMember(project_id).then((res) => {
//         if (res.data.code === 200) {
//           const data = res.data.data
//           setNumber(data.length)
//           setMemberList(
//             data.map((value: ValueMemberList) => {
//               setInitLoading(false)
//               value.key = value.user_id
//               return value
//             }),
//           )
//         } else {
//           console.log('拉取成员列表失败')
//         }
//       }),
//     [project_id],
//   )
//
//   const getCurRole = useCallback(
//     async (project_id) => {
//       const res = await getCurrentRole(project_id)
//       res.data.code === 200 ? setRoleState(res.data.data.role) : ''
//       updateMemberList()
//     },
//     [updateMemberList],
//   )
//
//   useEffect(() => {
//     getCurRole(project_id)
//   }, [getCurRole, project_id])
//
//   const closeModal = () => {
//     setIsModalOpen(false)
//   }
//
//   const loadMore =
//     !initLoading && !moreLoading ? (
//       <div
//         style={{
//           textAlign: 'center',
//           marginTop: 12,
//           height: 32,
//           lineHeight: '32px',
//         }}></div>
//     ) : null
//
//   const approval = (id) => {
//     return () => {
//       const apply_obj = {
//         projectid: project_id,
//         status: '1',
//         id: id,
//       }
//       updateApply(apply_obj).then((res) => {
//         res.data.code === 200
//           ? (message.success('已同意'), updateApplyList(), updateMemberList())
//           : message.error('操作失败')
//       })
//     }
//   }
//
//   const refuse = (id) => {
//     return () => {
//       const apply_obj = {
//         projectid: project_id,
//         status: '-1',
//         id: id,
//       }
//       updateApply(apply_obj).then((res) => {
//         res.data.code === 200
//           ? (message.success('已拒绝'), updateApplyList())
//           : message.error('操作失败')
//       })
//     }
//   }
//
//   const setAuthority = (authority) => {
//     return () => {
//       if (authority === 'admin') {
//         chgProjAdmin({
//           user_id: currentUid,
//           project_id: project_id,
//         }).then((res) => {
//           res.data.code === 200
//             ? (message.success('修改成功'),
//               getCurRole(project_id),
//               updateMemberList())
//             : message.error('修改失败')
//         })
//       } else {
//         updateAuthority({
//           user_id: currentUid,
//           project_id: project_id,
//           role:
//             authority === 'member'
//               ? 3
//               : authority === 'operator'
//                 ? 2
//                 : authority === 'admin'
//                   ? 1
//                   : 4,
//         }).then((res) => {
//           res.data.code === 200
//             ? (message.success('修改成功'), updateMemberList())
//             : message.error('修改失败')
//         })
//       }
//     }
//   }
//
//   const items: MenuProps['items'] = [
//     {
//       label: <div onClick={setAuthority('tourist')}>设为游客</div>,
//       key: '4',
//     },
//     {
//       label: <div onClick={setAuthority('member')}>设为成员</div>,
//       key: '3',
//     },
//     {
//       label: <div onClick={setAuthority('operator')}>设为管理者</div>,
//       key: '2',
//     },
//     // {
//     //   type: 'divider',
//     // },
//     {
//       label: <div onClick={setAuthority('admin')}>设为所有者</div>,
//       key: '1',
//     },
//   ]
//
//   const qualitySetBtn = (user_id) => {
//     // 如果是自己，不展示按钮
//     if (user_id === localStorage.getItem('user_id')) return ''
//
//     return role === 1 ? (
//       <Dropdown menu={{ items }} trigger={['click']}>
//         <a onClick={() => setCurrentUid(user_id)}>权限设置</a>
//       </Dropdown>
//     ) : (
//       ''
//     )
//   }
//
//   const delMemberHandler = (user_id) => {
//     reqDelMember(project_id, user_id).then((res) => {
//       res.data.code === 200
//         ? (message.success('移除成功'), updateMemberList())
//         : message.error('移除失败')
//     })
//   }
//
//   const delMemberBtn = (userRole, user_id) => {
//     // 如果是自己，不展示按钮
//     if (user_id === localStorage.getItem('user_id')) return ''
//
//     return role < userRole && role !== 0 ? (
//       <Popconfirm
//         title='谨慎操作！'
//         description='确定移除该成员吗?'
//         onConfirm={() => {
//           delMemberHandler(user_id)
//         }}
//         // onCancel={cancel}
//         okText='确定'
//         cancelText='取消'>
//         <Button danger>移除</Button>
//       </Popconfirm>
//     ) : (
//       ''
//     )
//   }
//   const showData = {
//     numberCount: number,
//     dNumberCount: dNumber,
//   }
//   return (
//     <App>
//       <div className='membermgt'>
//         {/* <div className='title'>成员/权限管理</div> */}
//         {/* <Tag color='#2db7f5'>
//           <h2>成员/权限管理</h2>
//         </Tag> */}
//         <ShowMember data={showData} />
//         {role === 1 || role === 2 ? (
//           <div className='apply'>
//             {/* <Tag color='blue'>
//               <h3>成员管理</h3>
//             </Tag> */}
//             <div className='title-wrap'>
//               <h3>成员管理</h3>
//               <Button type='primary' onClick={showModal} className='button'>
//                 审批列表
//               </Button>
//             </div>
//
//             <div>
//               <Modal
//                 title='申请人'
//                 open={isModalOpen}
//                 onCancel={closeModal}
//                 footer={null}>
//                 <List
//                   className='list'
//                   loading={initLoading}
//                   itemLayout='horizontal'
//                   // loadMore={loadMore}
//                   dataSource={apply_list}
//                   renderItem={(item) => (
//                     <List.Item
//                       actions={[
//                         <>
//                           {item.status === 0 ? (
//                             <>
//                               <Button
//                                 type='primary'
//                                 danger
//                                 // style={{ backgroundColor: 'purple' }}
//                                 onClick={refuse(item.id)}
//                                 disabled={role !== 1 && role !== 2}>
//                                 拒绝
//                               </Button>
//                               ,
//                               <Button
//                                 type='primary'
//                                 // style={{ backgroundColor: 'green' }}
//                                 onClick={approval(item.id)}
//                                 disabled={role !== 1 && role !== 2}>
//                                 同意
//                               </Button>
//                             </>
//                           ) : item.status === 1 ? (
//                             <Button
//                               disabled
//                               type='default'
//                               // style={{
//                               //   backgroundColor: 'green',
//                               //   opacity: '50%',
//                               //   color: 'black',
//                               // }}
//                             >
//                               已同意
//                             </Button>
//                           ) : item.status === -1 ? (
//                             <Button
//                               disabled
//                               type='primary'
//                               style={{
//                                 backgroundColor: 'red',
//                                 opacity: '50%',
//                                 color: 'black',
//                               }}>
//                               已拒绝
//                             </Button>
//                           ) : (
//                             ''
//                           )}
//                         </>,
//                       ]}
//                       key={item.id}>
//                       <Skeleton
//                         avatar
//                         title={false}
//                         loading={initLoading}
//                         active>
//                         <List.Item.Meta
//                           // avatar={<Avatar src={item.avatar_url} />}
//                           title={item.name}
//                           // description={`身份${item.role}`}
//                         />
//                       </Skeleton>
//                     </List.Item>
//                   )}
//                 />
//               </Modal>
//             </div>
//           </div>
//         ) : (
//           ''
//         )}
//
//         <div className='apply-modal'>
//           <List
//             className='list'
//             loading={initLoading}
//             itemLayout='horizontal'
//             loadMore={loadMore}
//             dataSource={member_list}
//             renderItem={(item) => (
//               <List.Item
//                 actions={[
//                   qualitySetBtn(item.user_id),
//                   delMemberBtn(item.role, item.user_id),
//                 ]}
//                 key={item.user_id}>
//                 <Skeleton avatar title={false} loading={initLoading} active>
//                   <List.Item.Meta
//                     avatar={<Avatar src={item.avatar_url} alt='头像' />}
//                     title={item.name}
//                     description={`身份：${
//                       item.role === 1
//                         ? '管理者'
//                         : item.role === 2
//                           ? '管理员'
//                           : item.role === 3
//                             ? '成员'
//                             : '游客'
//                     }`}
//                   />
//                 </Skeleton>
//               </List.Item>
//             )}
//           />
//         </div>
//       </div>
//     </App>
//   )
// }
//
// export default MemberMgt
// import React, { useState, useEffect } from 'react'
// import { useLocation } from 'react-router-dom'
// import {
//   Tabs,
//   Card,
//   Button,
//   List,
//   Avatar,
//   Form,
//   Input,
//   Modal,
//   Dropdown,
//   message,
//   Popconfirm,
// } from 'antd'
// import {
//   TeamOutlined,
//   SettingOutlined,
//   UserAddOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from '@ant-design/icons'
// import type { MemberList } from '@/types/response.type'
// import getProjectBase from '@/api/getProjectBase.ts'
// import getProjectMember from '@/api/getProjectMember.ts'
// import getCurrentRole from '@/api/getMockList.ts'
// import updateAuthority from '@/api/updateAuthority.ts'
// import updateProject from '@/api/updateProject.ts'
// import reqDelMember from '@/api/reqDelMember.ts'
// import delProject from '@/api/delProject.ts'
//
// const { TabPane } = Tabs
//
// interface ProjectInfo {
//   projectname: string
//   description: string
// }

const MemberMgt = () => {
  // const { state } = useLocation()
  // // 检查 state 是否存在，如果不存在则给出默认值
  // const project_id = state?.project_id
  //
  // if (!project_id) {
  //   // 如果 project_id 不存在，显示错误信息
  //   return (
  //     <div className='min-h-screen bg-gray-50 p-8 flex justify-center items-center'>
  //       <p className='text-red-500 text-lg'>
  //         未获取到项目 ID，请检查路由配置。
  //       </p>
  //     </div>
  //   )
  // }
  //
  // // 状态管理
  // const [activeKey, setActiveKey] = useState('members')
  // const [members, setMembers] = useState<MemberList[]>([])
  // const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
  //   projectname: '',
  //   description: '',
  // })
  // const [role, setRole] = useState<number>(0)
  // const [showInvite, setShowInvite] = useState(false)
  // const [form] = Form.useForm()
  //
  // // 初始化数据
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const [membersRes, projectRes, roleRes] = await Promise.all([
  //         getProjectMember(project_id),
  //         getProjectBase(project_id),
  //         getCurrentRole(project_id),
  //       ])
  //
  //       setMembers(membersRes.data)
  //       setProjectInfo(projectRes.data)
  //       setRole(roleRes.data.role)
  //     } catch (error) {
  //       message.error('数据加载失败')
  //     }
  //   }
  //   loadData()
  // }, [project_id])
  //
  // // 处理权限变更
  // const handleAuthorityChange = async (userId: string, newRole: number) => {
  //   try {
  //     await updateAuthority({ user_id: userId, project_id, role: newRole })
  //     setMembers(
  //       members.map((m) =>
  //         m.user_id === userId ? { ...m, role: newRole } : m,
  //       ),
  //     )
  //     message.success('权限更新成功')
  //   } catch {
  //     message.error('操作失败')
  //   }
  // }
  //
  // // 处理项目信息更新
  // const handleProjectUpdate = async (values: ProjectInfo) => {
  //   try {
  //     await updateProject({ ...values, project_id })
  //     setProjectInfo(values)
  //     message.success('项目信息已更新')
  //   } catch {
  //     message.error('更新失败')
  //   }
  // }

  return (
    // <div className='min-h-screen bg-gray-50 p-8'>
    //   <Card className='max-w-4xl mx-auto shadow-lg rounded-xl'>
    //     {/* 头部标题 */}
    //     <div className='flex items-center justify-between mb-6'>
    //       <h1 className='text-2xl font-bold text-gray-800'>
    //         {projectInfo.projectname} 管理
    //       </h1>
    //       <Button
    //         type='primary'
    //         icon={<UserAddOutlined />}
    //         onClick={() => setShowInvite(true)}>
    //         邀请成员
    //       </Button>
    //     </div>
    //
    //     {/* 标签导航 */}
    //     <Tabs activeKey={activeKey} onChange={setActiveKey} className='mb-6'>
    //       <TabPane
    //         tab={
    //           <span className='flex items-center'>
    //             <TeamOutlined className='mr-2' />
    //             成员管理
    //           </span>
    //         }
    //         key='members'
    //       />
    //       <TabPane
    //         tab={
    //           <span className='flex items-center'>
    //             <SettingOutlined className='mr-2' />
    //             项目设置
    //           </span>
    //         }
    //         key='settings'
    //       />
    //     </Tabs>
    //
    //     {/* 成员管理内容 */}
    //     {activeKey === 'members' && (
    //       <List
    //         dataSource={members}
    //         renderItem={(member) => (
    //           <List.Item className='hover:bg-gray-50 rounded-lg p-4'>
    //             <div className='flex items-center justify-between w-full'>
    //               <div className='flex items-center space-x-4'>
    //                 <Avatar src={member.avatar_url} size='large' />
    //                 <div>
    //                   <h3 className='font-medium text-gray-800'>
    //                     {member.name}
    //                   </h3>
    //                   <p className='text-gray-500 text-sm'>
    //                     {['所有者', '管理员', '成员', '游客'][member.role - 1]}
    //                   </p>
    //                 </div>
    //               </div>
    //               {role === 1 && member.role !== 1 && (
    //                 <div className='flex space-x-2'>
    //                   <Dropdown
    //                     menu={{
    //                       items: [
    //                         {
    //                           key: '2',
    //                           label: '设为管理员',
    //                           disabled: member.role === 2,
    //                           onClick: () =>
    //                             handleAuthorityChange(member.user_id, 2),
    //                         },
    //                         {
    //                           key: '3',
    //                           label: '设为普通成员',
    //                           disabled: member.role === 3,
    //                           onClick: () =>
    //                             handleAuthorityChange(member.user_id, 3),
    //                         },
    //                         {
    //                           key: '4',
    //                           label: '设为游客',
    //                           disabled: member.role === 4,
    //                           onClick: () =>
    //                             handleAuthorityChange(member.user_id, 4),
    //                         },
    //                         {
    //                           key: 'remove',
    //                           label: '移除成员',
    //                           danger: true,
    //                           onClick: () =>
    //                             reqDelMember(project_id, member.user_id),
    //                         },
    //                       ],
    //                     }}>
    //                     <Button className='text-gray-600'>权限管理</Button>
    //                   </Dropdown>
    //                 </div>
    //               )}
    //             </div>
    //           </List.Item>
    //         )}
    //       />
    //     )}
    //
    //     {/* 项目设置内容 */}
    //     {activeKey === 'settings' && (
    //       <Form
    //         form={form}
    //         initialValues={projectInfo}
    //         onFinish={handleProjectUpdate}
    //         layout='vertical'
    //         className='max-w-md'>
    //         <Form.Item
    //           label='项目名称'
    //           name='projectname'
    //           rules={[{ required: true, message: '请输入项目名称' }]}>
    //           <Input
    //             prefix={<EditOutlined />}
    //             disabled={role !== 1}
    //             className='rounded-lg'
    //           />
    //         </Form.Item>
    //         <Form.Item
    //           label='项目描述'
    //           name='description'
    //           rules={[{ required: true, message: '请输入项目描述' }]}>
    //           <Input.TextArea
    //             rows={4}
    //             disabled={role !== 1}
    //             className='rounded-lg'
    //           />
    //         </Form.Item>
    //         {role === 1 && (
    //           <div className='flex space-x-4'>
    //             <Button type='primary' htmlType='submit' className='rounded-lg'>
    //               保存更改
    //             </Button>
    //             <Popconfirm
    //               title='确定要删除项目吗？'
    //               onConfirm={() => delProject(project_id)}
    //               okText='确定'
    //               cancelText='取消'>
    //               <Button
    //                 danger
    //                 icon={<DeleteOutlined />}
    //                 className='rounded-lg'>
    //                 删除项目
    //               </Button>
    //             </Popconfirm>
    //           </div>
    //         )}
    //       </Form>
    //     )}
    //
    //     {/* 邀请成员模态框 */}
    //     <Modal
    //       title='邀请新成员'
    //       open={showInvite}
    //       onCancel={() => setShowInvite(false)}
    //       footer={null}
    //       className='rounded-xl'>
    //       <Form className='space-y-4'>
    //         <Form.Item
    //           name='email'
    //           rules={[
    //             { required: true, message: '请输入邮箱地址' },
    //             { type: 'email', message: '请输入有效的邮箱格式' },
    //           ]}>
    //           <Input placeholder='输入被邀请人邮箱' className='rounded-lg' />
    //         </Form.Item>
    //         <Button
    //           type='primary'
    //           htmlType='submit'
    //           block
    //           className='rounded-lg'>
    //           发送邀请
    //         </Button>
    //       </Form>
    //     </Modal>
    //   </Card>
    // </div>
    <div>hello world</div>
  )
}

export default MemberMgt
