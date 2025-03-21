import request from './request'
/**
 * 提供HTTP 接口描述(URL、Method、参数、返回结构等)后，服务器根据接口描述代理转发请求，返回结果
 * @param {Object} requestObj 请求所需参数
 * @returns
 */
type requestType = {
  cookie: string
  url: string
  method: string
  params: string
  data: string
  header: string
}

const testApi = (requestObj: requestType) => {
  return request.post(
    'v1/mock/real',
    {
      url: requestObj.url,
      method: requestObj.method,
      params: requestObj.params,
      data: eval('(' + requestObj.data + ')'),
    },
    {},
  )
}
export default testApi
