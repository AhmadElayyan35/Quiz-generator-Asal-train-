import { StyledLoadingDialog } from './Category.styles'
import { Dialog, DialogSurface } from '@fluentui/react-components'
import { Spinner, SpinnerSize } from '@fluentui/react'

function LoadingDialog({ loadingDialog }: { loadingDialog: boolean }) {
  return (
    <Dialog open={loadingDialog} >
      <DialogSurface>
        <StyledLoadingDialog>
          <Spinner label="Loading..." size={SpinnerSize.large} />
        </StyledLoadingDialog>
      </DialogSurface>
    </Dialog>
  )
}

export default LoadingDialog
