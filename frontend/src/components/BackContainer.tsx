import { Button } from '@fluentui/react-components'
import { ArrowLeft20Regular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'

function BackContainer({ to = '/' }: { to?: string }) {
  const navigate = useNavigate()
  function handleClick() {
    if (to !== '/') {
      navigate(to)
    } else {
      navigate(-1)
    }
  }
  return (

    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '12px 0px 0px 12px' }}>
      <Button
        icon={<ArrowLeft20Regular />}
        onClick={handleClick}
        appearance="secondary"
      />
      <Button onClick={() => navigate('/')}>
        Home
      </Button>

    </div>
  )
}

export default BackContainer
