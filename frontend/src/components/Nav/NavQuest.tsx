import React from 'react'
import { Button as FluentButton } from '@fluentui/react-components';
import { Navigation, Logo, LogoImage, NavigationLinks, Link, Identity, Button } from './Nav.styles';
import logo from '../../assets/images/logo.png';
function NavQuest() {
  return (
   <Navigation>
      <Logo>
        <LogoImage src={logo} alt="logo" />
      </Logo>

      <NavigationLinks>
        <Link href='/'>Home</Link>
        <Link href='/about'>About Us</Link>
        <Link href='/contact'>Contact</Link>
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

export default NavQuest
