/* eslint-disable */
import axios from 'axios'
type ReportType = Record<string, any>
export function reportError(adress: string) {
  function _reportError(error: ReportType, url: string, type: string) {
    if (url === '' || url === undefined) {
      url = window.location.pathname
    }
    error.userId = localStorage.getItem('user_id')
      ? localStorage.getItem('user_id')
      : 'New User'
    error.curTime = String(+new Date())
    const sendData = {
      url: url,
      type: type,
      message: JSON.stringify(error),
    }
    // navigator.sendBeacon(adress, JSON.stringify(sendData))
    axios.post(adress, sendData)
  }
  return _reportError
}
// /* eslint-disable */
// import axios from 'axios';
//
// type ReportType = Record<string, any>;
//
// export function reportError(adress: string) {
//     function _reportError(error: ReportType, url: string, type: string) {
//         if (url === '' || url === undefined) {
//             url = window.location.pathname;
//         }
//         error.userId = localStorage.getItem('user_id')
//           ? localStorage.getItem('user_id')
//             : 'New User';
//         error.curTime = String(+new Date());
//         const sendData = {
//             url: url,
//             type: type,
//             message: JSON.stringify(error),
//         };
//
//         const jsonData = JSON.stringify(sendData);
//
//         // 尝试使用 navigator.sendBeacon
//         if ('sendBeacon' in navigator) {
//             const success = navigator.sendBeacon(adress, jsonData);
//             if (success) {
//                 return;
//             }
//         }
//
//         // 若 navigator.sendBeacon 失败，尝试使用 img 标签
//         const img = new Image();
//         const queryString = Object.entries(sendData).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
//         const requestUrl = `${adress}?${queryString}`;
//         img.src = requestUrl;
//
//         // 检查 img 加载是否成功，如果加载失败则使用 axios
//         img.onerror = () => {
//             axios.post(adress, sendData)
//               .catch((axiosError) => {
//                     console.error('Axios 请求失败:', axiosError);
//                 });
//         };
//     }
//     return _reportError;
// }