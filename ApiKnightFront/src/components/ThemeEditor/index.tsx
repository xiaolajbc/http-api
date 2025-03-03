import { Form, Radio, theme } from 'antd'
import { ThemeSetting } from './ThmeEditor'
import React, { useEffect } from 'react'
import { defaultThemeSetting } from './theme-data'
import {ThemePicker} from './ThemePicker'
import ThemeColorPicker from './ThemeColorPicker'
import {ThemeRadiusPicker} from './ThemeRadiusPicker'

interface ThemeEditorProps {
  value?: ThemeSetting
  onChange?: (value: ThemeEditorProps['value']) => void
  autoSaveId?: string
}
const ThemeEditor = (props: ThemeEditorProps) => {
  const { token } = theme.useToken()
  const { borderRadius } = token
  const [form] = Form.useForm<ThemeSetting>()
  const { value, onChange, autoSaveId } = props

  const storeThemeSetting = (id: string, value: ThemeSetting) => {
    window.localStorage.setItem(autoSaveId, JSON.stringify(value))
  }
  useEffect(() => {
    const newThemeSetting = { ...defaultThemeSetting, ...value, borderRadius }

    form.setFieldsValue(newThemeSetting)

    if (autoSaveId) {
      storeThemeSetting(autoSaveId, newThemeSetting)
    }
  }, [form, value, borderRadius, autoSaveId])

  return (
    <div>
      <Form
        form={form}
        initialValues={value}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 20, offset: 1 }}
        onValuesChange={(_, newThemeSetting) => {
          onChange?.(newThemeSetting)
        }}>
        <Form.Item label='主题' name='themeNode'>
          <ThemePicker />
        </Form.Item>
        <Form.Item label='主色' name='colorPrimary'>
          <ThemeColorPicker />
        </Form.Item>

        <Form.Item label='圆角' name='borderRadius'>
          <ThemeRadiusPicker />
        </Form.Item>

        <Form.Item label='页面空间' name='spaceType'>
          <Radio.Group>
            <Radio value='default'>适中</Radio>
            <Radio value='compact'>紧凑</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
  )
}
export default ThemeEditor
