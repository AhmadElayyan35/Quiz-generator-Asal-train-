import { Button, Dialog, DialogBody, DialogSurface, DialogTitle, Input, Text } from '@fluentui/react-components';
import React from 'react'
import { ButtonsContainer, RegenerationReasonLabel } from './Quiz.styles';

function RegenerateQuestionDialog({ openRegenerateDialog, setOpenRegenerateDialog, questionNumber, regenerateReason, setRegenerateReason, onRegenerate }: {
  openRegenerateDialog: boolean;
  setOpenRegenerateDialog: React.Dispatch<React.SetStateAction<boolean>>;
  questionNumber: number;
  regenerateReason: string;
  setRegenerateReason: React.Dispatch<React.SetStateAction<string>>;
  onRegenerate: () => void;
}) {
  return (
    <Dialog open={openRegenerateDialog}>
      <DialogSurface>
        <DialogBody style={{ display: 'flex', flexDirection: 'column' }}>
          <DialogTitle>Regenerate Question</DialogTitle>
          <Text >Question {questionNumber} has been regenerated.</Text>
          <RegenerationReasonLabel>Regeneration Reason:</RegenerationReasonLabel>
          <Input value={regenerateReason} onChange={(e) => setRegenerateReason(e.target.value)} placeholder='Type the reason for regeneration' />
          <ButtonsContainer>
            <Button
              appearance='primary'
              onClick={onRegenerate}
              disabled={!regenerateReason.trim()}
            >Confirm</Button>
            <Button onClick={() => setOpenRegenerateDialog(false)}>Close</Button>
          </ButtonsContainer>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default RegenerateQuestionDialog
