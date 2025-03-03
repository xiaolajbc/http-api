import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'

//一级路由
import Project from './pages/project/index.tsx'
import User from './pages/user/index.tsx'
//二级路由
const ApiMgt = React.lazy(() => import('@/pages/project/apiMgt/index.tsx'))
const MemberMgt = React.lazy(
  () => import('@/pages/project/memberMgt/index.tsx'),
)
const ProjectSet = React.lazy(
  () => import('@/pages/project/projectSet/index.tsx'),
)
//三级路由
import CertainApi from './pages/project/apiMgt/certainApi/index.tsx'
import Overview from './pages/project/apiMgt/overview/index.tsx'
//四级路由
import Document from './pages/project/apiMgt/certainApi/document/index.tsx'
import AuthRoute from './components/AuthRoute.tsx'
import Login from './pages/user/login/index.tsx'
import Index from '@/pages/index'
import Receive from '@/pages/receive'

const Layout: React.FunctionComponent = () => {
  return (
    <>
      <Outlet />
    </>
  )
}
const App: React.FunctionComponent = () => {
  return (
    <>
      {/* 1.直接在App中配置二级路由 2.在对应页面中使用Switch包裹后配置二级路由，本项目采用法1 */}
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route
            path='/receive'
            element={
              <AuthRoute>
                <Receive />
              </AuthRoute>
            }></Route>
          {/* Home */}
          <Route index element={<Index />}></Route>
          {/* Project */}
          // 修正后的路由配置
          <Route path='/project' element={<Project />}>
            {/* 一级子路由 */}
            <Route
              path='apiMgt' // 改为相对路径
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <ApiMgt />
                </React.Suspense>
              }>
              {/* 二级子路由 */}
              <Route
                path='overview' // 相对路径自动继承父路径
                element={<Overview />}
              />
              <Route
                path='certainApi' // 修正路径
                element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <CertainApi />
                  </React.Suspense>
                }>
                {/* 三级子路由 */}
                <Route
                  path='document' // 自动拼接为/project/apiMgt/certainApi/document
                  element={<Document />}
                />
              </Route>
            </Route>

            <Route
              path='memberMgt' // 相对路径
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <MemberMgt />
                </React.Suspense>
              }
            />

            <Route
              path='/project/:projectId'
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <MemberMgt />
                </React.Suspense>
              }></Route>

            <Route
              path='projectSet' // 相对路径
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <ProjectSet />
                </React.Suspense>
              }
            />
          </Route>
          {/* User */}
          <Route
            path='/user'
            element={
              <AuthRoute>
                <User />
              </AuthRoute>
            }></Route>
          <Route path='/user/login' element={<Login />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
