import { Card } from "@fluentui/react-components";
import { NavDrawer } from "@fluentui/react-nav-preview";
import styled from "styled-components";

export const Root = styled.div`
display: flex;
  `;

export const Nav = styled(NavDrawer)`
 min-width: 200px;
    height: 100vh;
    `;
export const Content = styled.div`
     flex: 1;
    padding: 16px;
    `;

export const ContentContainer = styled.div`
  flex: 1;
  padding: 16px;
`;

export const StatContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

export const StatCard = styled(Card)`
  min-width: 150px;
  padding: 16px;
  text-align: center;
<<<<<<< HEAD
  cursor: pointer;

&:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }  }
=======
>>>>>>> 709ca58952fdb6a7f9d888c627856693f9cb817e
`;