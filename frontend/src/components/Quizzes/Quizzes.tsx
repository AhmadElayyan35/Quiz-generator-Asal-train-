import React from 'react'
import { Card, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Text } from '@fluentui/react-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { Quiz } from '../QuizGenerator/data/quiz'
import { Container, StyledTable } from '../Documents/Documents.styles'

function Quizzes() {
  const location = useLocation()
  const quizzes: Quiz[] = location.state?.list ?? [];
  const navigate = useNavigate()
  return (
    <Container>
      <Card style={{ borderRadius: '10px', padding: '24px' }}>
        <Text size={500} weight="semibold">Quizzes</Text>
        <StyledTable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>#</TableHeaderCell>
              <TableHeaderCell>Quiz Name</TableHeaderCell>
              <TableHeaderCell>Level</TableHeaderCell>
              <TableHeaderCell>Category ID</TableHeaderCell>
              <TableHeaderCell>Created At</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Text>No quizzes added yet.</Text>
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((q) => (
                <TableRow key={q.id} onClick={()=>navigate(`/categories/${q.category_id}/quizzes/${q.id}`)}>
                  <TableCell>{q.id}</TableCell>
                  <TableCell>{q.name}</TableCell>
                  <TableCell>
                    {q.level}
                  </TableCell>
                  <TableCell>
                    {q.category_id}
                  </TableCell>
                  <TableCell>
                    {q.created_at.split('T')[0]}
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

export default Quizzes
