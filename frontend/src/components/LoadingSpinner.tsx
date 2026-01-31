import { Spinner, SpinnerSize } from '@fluentui/react'
import React from 'react'

function LoadingSpinner({ label }: { label: string }) {
  return (
    <Spinner label={label} style={{ padding: '10px' }} size={SpinnerSize.medium} />
  )
}

export default LoadingSpinner
