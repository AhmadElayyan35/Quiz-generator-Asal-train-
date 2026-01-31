import {
  Field,
  Input,
  Link,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Title1,
} from '@fluentui/react-components';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import logo from '../../../assets/images/logo.png';
import { Container, LogoSection, FormContainer, Title, StyledLabel, StyledButton, ErrorMessage, Hint } from './SignUp.styles';
import { SignUpAPI } from '../../../APIs/Identity/SignUpAPI';
import LoadingDialog from '../../Category/LoadingDialog';
import Footer from '../../Footer/Footer';
type FormData = {
  name: string;
  email: string;
  password: string;
}
function SignUp(): JSX.Element {

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  const [validationError, setValidationError] = useState({
    name: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loadingDialog, setLoadingDialog] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setValidationError({ ...validationError, password: 'Password must be at least 8 characters long' })
    } else if (!/[A-Z]/.test(password)) {
      setValidationError({ ...validationError, password: 'Password must contain at least one uppercase letter' })
    } else if (!/[a-z]/.test(password)) {
      setValidationError({ ...validationError, password: 'Password must contain at least one lowercase letter' })
    }
    else if (!/[0-9]/.test(password)) {
      setValidationError({ ...validationError, password: 'Password must contain at least one Digit' })
    }
    else if (!/[!@#$%^&*]/.test(password)) {
      setValidationError({ ...validationError, password: 'Password must contain at least one special character' })
    }
    else {
      setValidationError({ ...validationError, password: '' })
    }
  }
  const validateName = (name: string) => {
    if (name.length < 3) {
      setValidationError({ ...validationError, name: 'Name must be at least 3 characters long' })
    } else if (/[!@#$%^&*]/.test(name)) {
      setValidationError({ ...validationError, name: 'Name must contain characters and numbers only' })
    }
    else {
      setValidationError({ ...validationError, name: '' })
    }
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData);
    setLoadingDialog(true);
    await SignUpAPI(formData, setError, setSuccess)
      .finally(() => {
        setLoadingDialog(false);
      });
  }
  useEffect(() => {
    if (formData.password) {
      validatePassword(formData.password)
    }
  }, [formData.password])
  useEffect(() => {
    if (formData.name) {
      validateName(formData.name)
    }
  }, [formData.name])

  return (
    <>
      <Container>
        <LogoSection>
          <img src={logo} alt="Logo" height={60} />
          <Title1>Quiz Generator</Title1>
        </LogoSection>

        <FormContainer>
          <Title>Sign Up</Title>
          <form onSubmit={handleSubmit}>
            <Field label={<StyledLabel>Name</StyledLabel>}>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </Field>
            {validationError.name && <ErrorMessage>{validationError.name}</ErrorMessage>}

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
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </Field>
            <Hint>Aleary have an account?
              <Link href='/login'>Login</Link>
            </Hint>
            {validationError.password && <ErrorMessage>{validationError.password}</ErrorMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <StyledButton appearance="primary" type="submit" disabled={!formData.name || !formData.email || !formData.password || Boolean(validationError.password) || Boolean(validationError.name) || Boolean(error)}>
              Sign Up
            </StyledButton>
            {success && <MessageBar style={{ marginTop: '10px' }} intent="success">
              <MessageBarBody>
                <MessageBarTitle>Sign Up Successfully!</MessageBarTitle>
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

export default SignUp;
