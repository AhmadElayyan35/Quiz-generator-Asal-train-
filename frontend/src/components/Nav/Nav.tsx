
import { useContext } from 'react';
import { TokenContext } from '../../context/TokenContext';
import NavAuth from './NavAuth';
import NavGuest from './NavGuest';

function Nav() {
  const { token } = useContext(TokenContext);
  return (
    token ? <NavAuth /> : <NavGuest />

  );
}

export default Nav;
