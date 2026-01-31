import { Button, Text, Title1, tokens } from "@fluentui/react-components";
import styled from "styled-components";


export const Choice = styled.li`
list-style-type:none;
padding:5px;

&:hover{
background-color:rgba(0,0,0,0.05)
}
`
export const Question = styled.p`
font-weight:bold;
font-size:1rem
`

export const Container = styled.div`
border: 1px solid lightgray;
border-radius:10px;
padding:10px;
margin:10px;
background-color:white
`
export const QuizContainer = styled.div`
background-color: ${tokens.colorNeutralBackground1Hover}
`
export const Title = styled(Title1)`
text-align:center;
display:block;
padding:10px;
`

export const ButtonsContainer = styled.div`
display:flex;
justify-content:flex-end;
gap:10px
`

export const Btn = styled(Button)`
margin:10px
`
export const CorrectAnswer = styled(Text)`
color: green;
font-weight: bold;
margin-top: 10px;
`
export const WrongAnswer = styled(Text)`
color: red;
font-weight: bold;
margin-top: 10px;
`
export const Explanation = styled(Text)`
display: block;
color: gray;
font-style: italic;
margin-top: 10px;
`
export const Answer = styled(Text)`
  background-color: #e6f1fb;  
  color: #0b6bcb;             
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-block;
  font-weight: 500;
  font-size: 14px;
`;

export const RegenerationReasonLabel = styled(Text)`
  color: #444;
  font-weight: 600;
  font-size: 14px;
  margin-top: 10px;
  display: inline-block;
`;
