import { Button, Dialog, DialogBody, DialogSurface, DialogTitle, Text } from '@fluentui/react-components'
import React from 'react'
import { ButtonsContainer } from './Category.styles'

function ConfirmDeleteDialog({ documentId, confirmDelete, setConfirmDelete, onDeleteDocument }: { documentId: number, confirmDelete: boolean, setConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>, onDeleteDocument: (documentId: number) => void }) {
  return (
    <Dialog open={confirmDelete} onOpenChange={() => setConfirmDelete(false)} >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Confirm Delete</DialogTitle>
          <Text>Are you sure you want to delete this document?</Text>
          <ButtonsContainer>
            <Button appearance="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={() => onDeleteDocument(documentId)} >
              Confirm
            </Button>
          </ButtonsContainer>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default ConfirmDeleteDialog
