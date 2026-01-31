import { Card, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Text } from '@fluentui/react-components'
import { useLocation } from 'react-router-dom'
import { Document } from '../Category/Category'
import { Container, StyledTable } from './Documents.styles';


function Documents() {
  const location = useLocation()
  const documents: Document[] = location.state?.list ?? [];
  return (
    <Container>
      <Card style={{ borderRadius: '10px', padding: '24px' }}>
        <Text size={500} weight="semibold">Documents</Text>
        <StyledTable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>#</TableHeaderCell>
              <TableHeaderCell>Document Name</TableHeaderCell>
              <TableHeaderCell>Category ID</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Text>No documents added yet.</Text>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.id}</TableCell>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>
                    {doc.category_id}
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

export default Documents
