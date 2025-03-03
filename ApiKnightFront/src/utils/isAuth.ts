import getSelfInfo from '@/api/getSelfInfo'
export async function isAuth() {

  const { data } = await getSelfInfo()
  data.code === 200
    ? ''
    : (localStorage.setItem('token', ''), localStorage.setItem('user_id', ''))

  return data.code === 200
}
