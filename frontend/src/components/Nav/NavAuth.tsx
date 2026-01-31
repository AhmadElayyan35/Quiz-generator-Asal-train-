import { useContext, useEffect, useState } from 'react'
import { Button as FluentButton } from '@fluentui/react-components';
import { Navigation, Logo, LogoImage, Identity, Button, NavigationLinks, StyledNavLink } from './Nav.styles';
import logo from '../../assets/images/logo.png';
import { TokenContext } from '../../context/TokenContext';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
function NavAuth() {
  const { setToken } = useContext(TokenContext);
  const [documents, setDocuments] = useState();
  const [quizzes, setQuizzes] = useState();
  const [attempts, setAttempts] = useState()
  const [categories, setCategories] = useState()
  const navigate = useNavigate()
  const apiFetch = useApi()
  function handleLogout() {
    localStorage.removeItem('token');
    setToken('');
  }
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch(`${process.env.REACT_APP_API_URL}/user/details`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });
      if (response) {
        const data = await response?.json();
        setDocuments(data.documents)
        setQuizzes(data.quizzes)
        setAttempts(data.attempts)
        setCategories(data.categories)
      }
    }
    fetchData()

  }, [])
  return (
    <Navigation>
      <Logo>
        <LogoImage src={logo} alt="logo" onClick={() => navigate('/')} />
      </Logo>
      <NavigationLinks>
        <StyledNavLink to="/categories" state={{ list: categories }}>Categories</StyledNavLink>
        <StyledNavLink to="/documents" state={{ list: documents }}>Documents</StyledNavLink>
        <StyledNavLink to="/quizzes" state={{ list: quizzes }}>Quizzes</StyledNavLink>
        <StyledNavLink to="/attempts" state={{ list: attempts }}>Attempts</StyledNavLink>
      </NavigationLinks>
      <Identity>
        <Button onClick={handleLogout} as={FluentButton} appearance="primary">
          Log out
        </Button>
      </Identity>
    </Navigation>
  )
}

export default NavAuth
