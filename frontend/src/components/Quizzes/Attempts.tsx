import React from 'react'
import { Card, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Text } from '@fluentui/react-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { QuizAttempt } from '../QuizGenerator/data/quiz'
import { Container, StyledTable } from '../Documents/Documents.styles'

function Attempts() {
  const location = useLocation()
  const attempts: QuizAttempt[] = location.state?.list ?? [];
  const navigate = useNavigate()
  return (
    <Container>
      <Card style={{ borderRadius: '10px', padding: '24px' }}>
        <Text size={500} weight="semibold">Attempts</Text>
        <StyledTable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>#</TableHeaderCell>
              <TableHeaderCell>Category ID</TableHeaderCell>
              <TableHeaderCell>Submitted At</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Text>No quizzes added yet.</Text>
                </TableCell>
              </TableRow>
            ) : (
              attempts.map((q) => (
                <TableRow key={q.id} onClick={()=>navigate(`/categories/${q.category_id}/attempts/${q.id}`)}>
                  <TableCell>{q.id}</TableCell>
                  <TableCell>{q.category_id}</TableCell>
                  <TableCell>
                    {q.submitted_at.split('T')[0]}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </StyledTable>
      </Card>
    </Container>
  )
}

export default Attempts
