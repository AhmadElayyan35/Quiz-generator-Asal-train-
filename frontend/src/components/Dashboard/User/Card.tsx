import React from 'react'
import { StatCard } from './Dashboard.styles'
import { Text } from '@fluentui/react-components'
import { useNavigate } from 'react-router-dom'
import { Document } from '../../Category/Category'
import { Category } from '../../Categories/Categories'
import { Quiz, QuizAttempt } from '../../QuizGenerator/data/quiz'

function Card({ list, url, title }: { list: Document[] | Category[] | Quiz[] | QuizAttempt[], url: string, title: string }) {
  const navigate = useNavigate()
  return (
    <StatCard onClick={() => navigate(url, {
      state: {
        list: list
      }
    })}>
      <Text weight="semibold">{title}</Text>
      <Text>{list.length}</Text>
    </StatCard>
  )
}

export default Card
