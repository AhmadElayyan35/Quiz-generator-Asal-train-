import * as React from 'react';
import { Button, Text } from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Text size={800} weight="bold">404 - Page Not Found</Text>
      <p>The page you're looking for doesn't exist.</p>
      <Button appearance="primary" onClick={() => navigate('/')}>
        Go Home
      </Button>
    </div>
  );
};

export default NotFound;
