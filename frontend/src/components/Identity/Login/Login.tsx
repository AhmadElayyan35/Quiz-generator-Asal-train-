import { useState, ChangeEvent, FormEvent, useContext } from 'react';
import {
  Field,
  Input,
  Link,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Title1,
} from '@fluentui/react-components';
import logo from '../../../assets/images/logo.png';
import {
  Container,
  LogoSection,
  FormContainer,
  Title,
  StyledLabel,
  StyledButton,
  ToggleIcon,
  PasswordWrapper,
} from './Login.styles';
import { LoginAPI } from '../../../APIs/Identity/LoginAPI';
import { ErrorMessage, Hint } from '../SignUp/SignUp.styles';
import { Eye16Regular, EyeOff16Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import LoadingDialog from '../../Category/LoadingDialog';
import { TokenContext } from '../../../context/TokenContext';
import Footer from '../../Footer/Footer';

type LoginFormData = {
  email: string;
  password: string;
};


function Login(): JSX.Element {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingDialog, setLoadingDialog] = useState(false);

  const { setToken } = useContext(TokenContext);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingDialog(true);
    await LoginAPI(formData, setToken, setError, setSuccess, navigate)
      .finally(() => {
        setLoadingDialog(false);
      });
  };


  return (
    <>
      <Container>
        <LogoSection>
          <img src={logo} alt="Logo" height={60} />
          <Title1>Quiz Generator</Title1>
        </LogoSection>

        <FormContainer>
          <Title>Login</Title>
          <form onSubmit={handleSubmit}>
            <Field label={<StyledLabel>Email</StyledLabel>}>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </Field>

            <Field label={<StyledLabel>Password</StyledLabel>}>
              <PasswordWrapper>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={{ width: '100%' }}
                />
                <ToggleIcon onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <EyeOff16Regular /> : <Eye16Regular />}
                </ToggleIcon>
              </PasswordWrapper>
            </Field>
            <Hint>Doesn't have an account?
              <Link href='/signup'>Signup</Link>
            </Hint>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <StyledButton disabled={!formData.email || !formData.password} appearance="primary" type="submit">
              Login
            </StyledButton>
            {success && <MessageBar style={{ marginTop: '10px' }} intent="success">
              <MessageBarBody >
                <MessageBarTitle>Login Successfully!</MessageBarTitle>
              </MessageBarBody>
            </MessageBar>}

          </form>
        </FormContainer>

        {loadingDialog && <LoadingDialog loadingDialog={loadingDialog} />}

      </Container>
      <Footer />
    </>

  );
}

export default Login;
