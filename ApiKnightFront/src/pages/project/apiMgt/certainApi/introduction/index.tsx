import React, { memo, useEffect } from 'react'
import { IntroductionProps } from './type'
import IntroInfo from './c-pages/intro-info'
import IntroRequest from './c-pages/intro-request'
import IntroResponse from './c-pages/intro-response'
import './index.less'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchDocumentApiAction } from '@/store/modules/document/document'

// eslint-disable-next-line react-refresh/only-export-components
const Introduction: React.FunctionComponent<IntroductionProps> = (props) => {
  const dispatch = useAppDispatch()
  const { apiId } = useAppSelector((state) => ({
    apiId: state.rightSlice.value,
  }))

  useEffect(() => {
    if (apiId !== 'gl') {
      dispatch(fetchDocumentApiAction(apiId))
    }
  }, [dispatch, apiId])

  return (
    <div className='introduction-page'>
      <IntroInfo />
      <IntroRequest />
      <IntroResponse />
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(Introduction)
