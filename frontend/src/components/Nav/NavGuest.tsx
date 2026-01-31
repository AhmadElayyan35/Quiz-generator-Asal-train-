import { Button as FluentButton } from '@fluentui/react-components';
import { Navigation, Logo, LogoImage, NavigationLinks, Link, Identity, Button } from './Nav.styles';
import logo from '../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
function NavGuest() {
  const navigate = useNavigate()
  return (
    <Navigation>
      <Logo>
        <LogoImage src={logo} alt="logo" onClick={() => navigate('/')} />
      </Logo>

      <NavigationLinks>
        <Link href='/'>Home</Link>
        <Link href='#about'>About Us</Link>
        <Link href='#contact'>Contact</Link>
      </NavigationLinks>

      <Identity>
        <Link href='/signup'>
          <Button as={FluentButton} appearance="primary">
            Sign Up
          </Button>
        </Link>

        <Link href='/login'>
          <Button as={FluentButton} appearance="secondary">
            Login
          </Button>
        </Link>
      </Identity>
    </Navigation>
  )
}

export default NavGuest
