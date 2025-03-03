/*
 * @Author: xiaolajiaobc 13456820+xiaolajiaobc@user.noreply.gitee.com
 * @Date: 2024-12-04 11:05:54
 * @LastEditors: xiaolajiaobc 13456820+xiaolajiaobc@user.noreply.gitee.com
 * @LastEditTime: 2024-12-15 15:44:11
 * @FilePath: \ApiKnight\ApiKnightFront\src\hooks\useStyles.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 这个hook很重要

import { theme } from 'antd'
import { css } from '@emotion/css'
type Theme = ReturnType<typeof theme.useToken>
type StyleFunction<T> = (theme: Theme, cssFn: typeof css) => T
export function useStyles<T>(fn: StyleFunction<T>): {
  styles: ReturnType<StyleFunction<T>>
} {
  return { styles: fn(theme.useToken(), css) }
}
