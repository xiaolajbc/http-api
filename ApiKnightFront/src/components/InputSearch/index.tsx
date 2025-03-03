import { useStyles } from '@/hooks/useStyles'
import { css } from '@emotion/css'
import { Input } from 'antd'
import { SearchIcon } from 'lucide-react'
// import React, { useCallback } from 'react'
// import { useMenuHelpersContext } from '@/contexts/menu-helpers'
// import { useCompositionInput } from 'foxact/use-composition-input'

const InputSearch = () => {
  // const { setMenuSearchWord } = useMenuHelpersContext()

  // const inputProps = useCompositionInput(
  //   useCallback(
  //     (value) => {
  //       setMenuSearchWord?.(value)
  //     },
  //     [setMenuSearchWord],
  //   ),
  // )

  const { styles } = useStyles(({ token }) => {
    const inputBox = css({
      borderRadius: token.borderRadius,
      border: `1px solid ${token.colorBorderSecondary}`,

      '&:hover': {
        borderColor: token.colorPrimary,
      },
    })

    return {
      inputBox,
    }
  })

  return (
    <div
      className={`flex-1 overflow-hidden transition-colors ${styles.inputBox}`}>
      <Input
        // {...inputProps}
        allowClear
        prefix={<SearchIcon size={14} />}
        variant='borderless'
      />
    </div>
  )
}
export default InputSearch
