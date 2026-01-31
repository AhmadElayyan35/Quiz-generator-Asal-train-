import { Table } from "@fluentui/react-components";
import styled from "styled-components";

export const Container = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: #f9fafb; 
  min-height: 100vh; 

  @media (max-width: 768px) {
    padding: 16px;
    gap: 24px;
  }
`;
export const StyledTable = styled(Table)`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  thead {
    background-color: #f3f4f6;
  }

  th, td {
    padding: 16px 20px;
    text-align: left;
  }

  th {
    font-weight: 600;
    font-size: 15px;
    color: #374151; 
  }

  td {
    font-size: 14px;
    color: #4b5563; 
    border-bottom: 1px solid #e5e7eb; 
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background-color: #f9fafb;
  }
`;