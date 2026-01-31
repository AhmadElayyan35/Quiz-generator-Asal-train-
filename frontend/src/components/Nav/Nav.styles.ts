import styled, { css } from 'styled-components';
import { NavLink as RouterLink } from 'react-router-dom';

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1e2a38;
  padding: 10px 40px;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
    padding: 10px 20px;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoImage = styled.img`
  height: 50px;
  width: 50px;
  cursor: pointer;

    @media (max-width: 768px) {
    height: 40px;
    width: 40px;
  }
`;

export const NavigationLinks = styled.div`
  display: flex;
  gap: 40px;
    @media (max-width: 768px) {
    display: none; 
  }
`;

const linkStyles = css`
  font-weight: 500;
  font-size: 16px;
  color: white;
  text-decoration: none;
  transition: transform 0.3s, color 0.3s;

  &:hover {
    transform: scale(1.1);
    color: #4fc3f7;
    cursor: pointer;
  }
`;

export const Link = styled.a`
  ${linkStyles}
`;

export const StyledNavLink = styled(RouterLink)`
  ${linkStyles}
   &.active {
    color: #0078d4;
  }
`;

export const Identity = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.button`
  background-color: #4fc3f7;
  color: #1e2a38;
  padding: 8px 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #29b6f6;
    transform: scale(1.05);
    cursor: pointer;
  }
`;

