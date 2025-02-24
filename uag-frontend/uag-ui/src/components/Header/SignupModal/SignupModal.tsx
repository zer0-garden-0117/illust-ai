import { useEffect, useState } from 'react';
import { Modal, Button, TextInput, PasswordInput, Text, Divider, Space, Alert } from '@mantine/core';
import { FcGoogle } from "react-icons/fc";
import { FaLine } from "react-icons/fa";
import { useAccessTokenContext } from '@/providers/auth/accessTokenProvider';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const { login, loginWithGoogle, loginWithLine, register, confirmSignup } = useAccessTokenContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState(''); // 新しく追加
  const [loginError, setLoginError] = useState<string | null>(null);
  const [step, setStep] = useState<'signup' | 'confirmation'>('signup'); // 現在のステップを管理

  const validatePassword = (password: string): string | null => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `パスワードは${minLength}文字以上でなければなりません。`;
    }
    if (!hasUpperCase) {
      return "パスワードには大文字を含める必要があります。";
    }
    if (!hasLowerCase) {
      return "パスワードには小文字を含める必要があります。";
    }
    if (!hasNumbers) {
      return "パスワードには数字を含める必要があります。";
    }
    if (!hasSymbols) {
      return "パスワードには記号を含める必要があります。";
    }

    return null;
  };

  const handleSignup = async () => {
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }

    try {
      await register(username, password);
      setStep('confirmation'); // 本人確認コード入力画面に遷移
    } catch (error) {
      setLoginError('登録に失敗しました。');
      console.error('Registration failed:', error);
    }
  };

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
      setLoginError('Googleログインに失敗しました。');
      console.error('Google login failed:', error);
    }
  };

  const handleConfirmation = async (email: string, code: string) => {
    try {
      const result = await confirmSignup(email, code); // confirmSignupに引数を渡す
      if (result.success) {
        console.log('Confirmation successful');
        try {
          const result = await login(username, password);
          if (result?.message == "CONFIRM_SIGN_UP") {
            setLoginError('メールアドレスに本人確認コードを送信しました。本人確認コードを入力してください');

          } else if (result?.success == false) {
            setLoginError('ログインに失敗しました。');
          } else {
            onClose();
          }
        } catch (error) {
          setLoginError('ログインに失敗しました。');
          console.error('Login failed:', error);
        }
      } else {
        setLoginError('確認に失敗しました。');
      }
    } catch (error) {
      setLoginError('確認中にエラーが発生しました。');
      console.error('Confirmation failed:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep('signup');
    }
  }, [isOpen]);

  return (
    <Modal opened={isOpen} onClose={onClose}>
      {step === 'signup' && (
        <>
          <Text>他アカウントで登録</Text>
          <Space h="md" />
          <Button
            color="gray"
            variant="outline"
            radius="xl"
            leftSection={<FcGoogle size={14} />}
            onClick={handleGoogleLogin}
            style={{ marginTop: '10px', width: '80%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            styles={{
              inner: { justifyContent: 'flex-start' },
              label: { color: 'gray' },
            }}
          >
            Googleで続ける
          </Button>
          <Button
            color="gray"
            variant="outline"
            radius="xl"
            leftSection={<FaLine size={14} color='lightgreen' />}
            onClick={handleLineLogin}
            style={{ marginTop: '10px', width: '80%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            styles={{
              inner: { justifyContent: 'flex-start' },
              label: { color: 'gray' },
            }}
          >
            Lineで続ける
          </Button>
          <Space h="md" />
          <Divider my="md" labelPosition="center" />
          <Space h="md" />
          <Text>メールアドレスで登録</Text>
          <Space h="md" />
          <div style={{ width: '80%', margin: '0 auto' }}>
            <TextInput
              radius="xl"
              variant="filled"
              value={username}
              placeholder="メールアドレス"
              onChange={(event) => setUsername(event.currentTarget.value)}
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <Space h="xs" />
            <PasswordInput
              radius="xl"
              variant="filled"
              value={password}
              placeholder="パスワード"
              onChange={(event) => {
                setPassword(event.currentTarget.value);
                setPasswordError(null);
              }}
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
              error={passwordError}
            />
            {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
            <Button
              color="gray"
              onClick={handleSignup}
              style={{ display: 'block', marginLeft: 'auto', marginTop: '10px' }}
            >
              新規登録
            </Button>
          </div>
        </>
      )}
      {step === 'confirmation' && (
        <>
          <Text>確認コードを入力</Text>
          <Space h="md" />
          <Text>
            {username} 宛にメールを送信しました。メールに記載されている確認コードを入力してください。
          </Text>
          <Space h="md" />
          <Alert>
            メールが届かない場合は、迷惑メールフォルダーなどに振り分けられてしまう場合がありますので、すべてのメールをご確認ください。
          </Alert>
          <Space h="md" />
          <TextInput
            radius="xl"
            variant="filled"
            value={confirmationCode}
            onChange={(event) => setConfirmationCode(event.currentTarget.value)} // 追加
            placeholder="確認コード"
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          />
          <Button
            color="gray"
            onClick={() => handleConfirmation(username, confirmationCode)}
            style={{ display: 'block', marginLeft: 'auto', marginTop: '10px' }}
          >
            確認
          </Button>
        </>
      )}
    </Modal>
  );
};

export default SignupModal;