import React, { useState } from 'react';
import { Form, Input, Button, Tabs, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import login from '@/api/login';
import randomNum from '@/utils/randomNum';
import request from '@/api/request';
import { useNavigate } from 'react-router-dom';
 
const { TabPane } = Tabs;

const Login = () => {
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate()

    const onFinishRegister = (values) => {
        const loginData = {
          username: values.confirmPassword,
          password: values.password,
          avatar_url: `${window.location.origin}/images/avatar${randomNum(1, 6)}.jpg`,
          email: values.email,
          phone: values.phone,
        }
        request.post('v1/user/checkExist', loginData, {}).then((res) => {
          if(res.data.code === 200) {
            request.post('v1/user/register', loginData, {}).then((res1) => {
              if(res1.data.code === 200) {
                notification.success({
                  message: '注册成功',
                  description: '欢迎加入, 请重新登录',
                });
              } 
            }).catch((err) => {
              notification.error({
                message: '注册失败',
                description: '请重试',
            })
            })
          } else if( res.data.code === 409) {
            notification.error({
              message: '已经注册过了',
              description: '请重试'
            })
          }
        }).catch((err) => {
          notification.error({
            message: '注册失败',
            description: '请重试',
        })
      });
    };

    const onFinishLogin = (values) => {
        const loginData = {
          usernameOrEmail: values.username,
          password: values.password,
        }
        login(loginData).then(
          (res) => {
            if(res.data.code === 200) {
              localStorage.setItem('token', res.data.data.token),
              localStorage.setItem('user_id', res.data.data.user.id),
              notification.success({
                message: '登录成功',
                description: '欢迎回来',
               });
               setTimeout(() => {
                navigate('/')
               })
            }
          }
        ).catch((err) => {
            notification.error({
              message: '登录失败',
              description: '登录失败，请稍后再试！',
            });
          }
        );
    };

    const onChangeTab = (key) => {
        setActiveTab(key);
    };

    return (
        <div style={{ width: '400px', margin: '0 auto', marginTop: '100px' }}>
            <h1 style={{ textAlign: 'center' }}>登录/注册</h1>
            <Tabs defaultActiveKey="login" onChange={onChangeTab}>
                <TabPane tab="登录" key="login">
                    <Form
                        name="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinishLogin}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '请输入用户名!' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: '请输入密码!' },
                                { min: 6, message: '密码至少6位!' },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                size="large"
                                block
                                htmlType="submit"
                            >
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab="注册" key="register">
                    <Form
                        name="register-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinishRegister}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '请输入用户名!' },
                                { min: 3, message: '用户名至少3位!' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: '请输入密码!' },
                                { min: 6, message: '密码至少6位!' },
                                { max: 12, message: '密码最多12位!' },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            rules={[
                                { required: true, message: '请确认密码!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || value === getFieldValue('password')) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致!'));
                                    },
                                }),
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="确认密码"
                            />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            rules={[
                              { required: true, message: '请输入手机号!' },
                              {
                                  pattern: /^1[3-9]\d{9}$/,
                                  message: '请输入正确的手机号!',
                              },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="phone"
                                placeholder="手机号"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                              { required: true, message: '请输入邮箱!' },
                              {
                                  type: 'email',
                                  message: '请输入正确的邮箱格式!',
                              },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="email"
                                placeholder="邮箱"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                size="large"
                                block
                                htmlType="submit"
                            >
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Login;