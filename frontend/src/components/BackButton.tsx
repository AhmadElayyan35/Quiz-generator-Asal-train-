import { Button } from '@fluentui/react-components'
import { ArrowLeft20Regular } from '@fluentui/react-icons'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function BackButton({ label = 'Back'}:{ label?: string}) {
    const navigate = useNavigate()
    function handleClick() {
        navigate(-1)
    }
  return (
     <Button
      icon={<ArrowLeft20Regular />}
      onClick={handleClick}
      appearance="secondary"
    />
  )
}

export default BackButton
