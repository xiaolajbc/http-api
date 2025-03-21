import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { App as AntdApp } from 'antd'
import './assets/css/index.less'
import 'nprogress/nprogress.css'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/index.ts'
import { Provider } from 'react-redux'
import { ConfigProvider, ThemeConfig } from 'antd'
import NiceModal from '@ebay/nice-modal-react'

// 定制主题
const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider theme={theme}>
    <NiceModal.Provider>
      <AntdApp style={{ height: '100%' }}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </AntdApp>
    </NiceModal.Provider>
  </ConfigProvider>,
)
