import { useEffect, useState } from 'react';
import { Modal, Button, Text, Space, Tabs } from '@mantine/core';
import { FcGoogle } from "react-icons/fc";
import { FaLine } from "react-icons/fa";
import { useAccessTokenContext } from '@/providers/auth/accessTokenProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLogin?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = (
  { isOpen, onClose, isLogin = true }
) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(isLogin ? 'login' : 'signup');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(isLogin ? 'login' : 'signup');
      (document.activeElement as HTMLElement)?.blur();
    }
  }, [isOpen, isLogin]);

  return (
    <Modal opened={isOpen} onClose={onClose} withCloseButton={false}>
      <Tabs value={activeTab} onChange={(tab) => setActiveTab(tab as 'login' | 'signup')} autoFocus={false}>
        <Tabs.List>
          <Tabs.Tab value="login" style={{ fontSize: '12px', outline: 'none'}} tabIndex={-1}>ログイン</Tabs.Tab>
          <Tabs.Tab value="signup" style={{ fontSize: '12px',  outline: 'none'}} tabIndex={-1}>新規登録</Tabs.Tab>
        </Tabs.List>
        <Space h="md" />

        <Tabs.Panel value="login">
          <LoginContent onClose={onClose} />
        </Tabs.Panel>

        <Tabs.Panel value="signup">
          <SignupContent onClose={onClose} />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

const LoginContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { loginWithGoogle, loginWithLine } = useAccessTokenContext();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [step, setStep] = useState<'login' | 'reset' | 'confirmReset'>('login');

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      setLoginError('Googleログインに失敗しました。');
      console.error('Google login failed:', error);
    }
  };

  const handleLineLogin = async () => {
    try {
      await loginWithLine();
      onClose();
    } catch (error) {
      setLoginError('Lineログインに失敗しました。');
      console.error('Line login failed:', error);
    }
  };

  useEffect(() => {
    if (step === 'login') {
      setStep('login');
    }
  }, [step]);

  return (
    <>
      {step === 'login' && (
        <>
          <Text size='xs'>他アカウントでログイン</Text>
          <Button
            color="gray"
            variant="outline"
            radius="xl"
            leftSection={<FcGoogle size={14} />}
            size="xs"
            onClick={handleGoogleLogin}
            style={{ marginTop: '10px', width: '80%', display: 'flex', marginLeft: 'auto', marginRight: 'auto',
              justifyContent: 'flex-start',
              paddingLeft: '12px',
            }}
          >
            Googleで続ける
          </Button>
          {/* <Button
            color="gray"
            variant="outline"
            radius="xl"
            size="xs"
            leftSection={<FaLine size={14} color='lightgreen' />}
            onClick={handleLineLogin}
            style={{ marginTop: '10px', width: '80%', display: 'flex', marginLeft: 'auto', marginRight: 'auto',
              justifyContent: 'flex-start',
              paddingLeft: '12px',
            }}
          >
            Lineで続ける
          </Button> */}
          <Space h="md" />
        </>
      )}
          {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
    </>
  );
};

const SignupContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { loginWithGoogle, loginWithLine } = useAccessTokenContext();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [step, setStep] = useState<'signup' | 'confirmation'>('signup');

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      setRegisterError('Googleログインに失敗しました。');
      console.error('Google login failed:', error);
    }
  };

  const handleLineLogin = async () => {
    try {
      await loginWithLine();
      onClose();
    } catch (error) {
      setRegisterError('Lineログインに失敗しました。');
      console.error('Line login failed:', error);
    }
  };

  useEffect(() => {
    if (step === 'signup') {
      setStep('signup');
    }
  }, [step]);

  return (
    <>
      {step === 'signup' && (
        <>
          <Text size='xs'>他アカウントで登録</Text>
          <Button
            color="gray"
            variant="outline"
            radius="xl"
            size='xs'
            leftSection={<FcGoogle size={14} />}
            onClick={handleGoogleLogin}
            style={{ marginTop: '10px', width: '80%', display: 'flex', marginLeft: 'auto', marginRight: 'auto',
              justifyContent: 'flex-start',
              paddingLeft: '12px',
            }}
          >
            Googleで続ける
          </Button>
          {/* <Button
            color="gray"
            variant="outline"
            radius="xl"
            size='xs'
            leftSection={<FaLine size={14} color='lightgreen' />}
            onClick={handleLineLogin}
            style={{ marginTop: '10px', width: '80%', display: 'flex', marginLeft: 'auto', marginRight: 'auto',
              justifyContent: 'flex-start',
              paddingLeft: '12px',
            }}
          >
            Lineで続ける
          </Button> */}
          <Space h="md" />
        </>
      )}
      {registerError && <div style={{ color: 'red' }}>{registerError}</div>}
    </>
  );
};

export default AuthModal;