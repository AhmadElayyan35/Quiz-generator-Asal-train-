import { Button, Dialog, DialogBody, DialogSurface, DialogTitle, Dropdown, Input, Option } from '@fluentui/react-components'
import React from 'react'
import { ButtonsContainer } from './Category.styles'

function GenerateQuizDialog({ categoryId, isOpenGenerateDialog, setIsOpenGenerateDialog, onGenerateQuiz, quizName, setQuizName, difficulty, setDifficulty }: { categoryId: string, isOpenGenerateDialog: boolean, setIsOpenGenerateDialog: React.Dispatch<React.SetStateAction<boolean>>, onGenerateQuiz: (categoryId: string) => void, quizName: string, setQuizName: React.Dispatch<React.SetStateAction<string>>, difficulty: string, setDifficulty: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <Dialog open={isOpenGenerateDialog} onOpenChange={() => setIsOpenGenerateDialog(false)} >
      <DialogSurface>
        <DialogBody style={{ display: 'flex', flexDirection: 'column' }}>
          <DialogTitle>Generate Quiz</DialogTitle>
          <Input value={quizName} onChange={(e) => setQuizName(e.target.value)} placeholder='Enter quiz name as you like...' />
          <Dropdown
            defaultSelectedOptions={['easy']}
            placeholder="Select difficulty"
            value={difficulty}
            onOptionSelect={(e, data) => {
              if (data.optionValue) {
                setDifficulty(data.optionValue)
              }
            }
            }
          >
            <Option value="easy">Easy</Option>
            <Option value="medium">Medium</Option>
            <Option value="hard">Hard</Option>
          </Dropdown>
          <ButtonsContainer>
            <Button appearance="secondary" onClick={() => setIsOpenGenerateDialog(false)}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={() => onGenerateQuiz(categoryId)} >
              Generate
            </Button>
          </ButtonsContainer>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default GenerateQuizDialog
