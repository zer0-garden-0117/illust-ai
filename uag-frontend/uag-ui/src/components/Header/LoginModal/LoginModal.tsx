import { useEffect, useState } from 'react';
import { Modal, Button, TextInput, PasswordInput, Text, Divider, Space, Grid, Alert } from '@mantine/core';
import { useAccessToken } from '../../../apis/auth/useAccessToken';
import { FcGoogle } from "react-icons/fc";
import { FaLine } from "react-icons/fa";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, loginWithGoogle, loginWithLine, resetPass, confirmResetPass } = useAccessToken();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [step, setStep] = useState<'login' | 'reset' | 'confirmReset'>('login');

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

  const handleLogin = async () => {
    try {
      const result = await login(username, password);
      if (result?.message == "CONFIRM_SIGN_UP") {
        setLoginError('メールアドレスに本人確認コードを送信しました。本人確認コードを入力してください');
      } else if (result?.success == false) {
        setLoginError('ログインに失敗しました。');
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      setLoginError('ログインに失敗しました。');
      console.error('Login failed:', error);
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('login');
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePasswordReset = () => {
    setStep('reset');
  };

  // パスワードリセット用関数
  const handlePasswordResetRequest = async (email: string) => {
    try {
      resetPass(email)
      console.log('Password reset email sent to:', username);
      setStep('confirmReset'); // 成功したらconfirmResetステップに遷移
    } catch (error) {
      setLoginError('パスワード再設定に失敗しました。');
      console.error('Password reset failed:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleConfirmReset = async () => {
    const error = validatePassword(newPassword);
    if (error) {
      setLoginError(error);
      return;
    }

    try {
      await confirmResetPass(username, confirmationCode, newPassword);
      console.log('Password reset confirmed');
      setStep('login');
    } catch (error) {
      setLoginError('確認に失敗しました。');
      console.error('Confirm reset failed:', error);
    }
  };

  return (
    <Modal opened={isOpen} onClose={handleClose}>
      {step === 'login' && (
        <>
          <Text>他アカウントでログイン</Text>
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
          <Text>メールアドレスでログイン</Text>
          <Space h="md" />
          <div style={{ width: '80%', margin: '0 auto' }}>
            <TextInput
              radius="xl"
              variant="filled"
              value={username}
              placeholder="メールアドレス"
              onChange={(event) => setUsername(event.currentTarget.value)}
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' ,fontSize: '16px' }}
            />
            <Space h="xs" />
            <PasswordInput
              radius="xl"
              variant="filled"
              value={password}
              placeholder="パスワード"
              onChange={(event) => {
                setPassword(event.currentTarget.value)
                setLoginError(null);
              }}
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' ,fontSize: '16px' }}
            />
            {loginError && <div style={{ color: 'red' }}>{loginError}</div>}

            <Grid>
              <Grid.Col span={6}>
                <Space h="xs" />
                <Button
                  variant="transparent"
                  onClick={handlePasswordReset}
                  color="gray"
                >
                  パスワードがわからない
                </Button>
              </Grid.Col>
              <Grid.Col span={6}>
                <Button
                  color="gray"
                  onClick={handleLogin}
                  style={{ display: 'block', marginLeft: 'auto', marginTop: '10px' }}
                >
                  ログイン
                </Button>
              </Grid.Col>
            </Grid>
          </div>
        </>
      )}
      {step === 'reset' && (
        <>
          <Text>パスワードのリセット</Text>
          <Space h="md" />
          <TextInput
            radius="xl"
            variant="filled"
            value={username}
            placeholder="メールアドレス"
            onChange={(event) => setUsername(event.currentTarget.value)}
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' ,fontSize: '16px' }}
          />
          <Button
            color="gray"
            onClick={() => handlePasswordResetRequest(username)}
            style={{ display: 'block', marginLeft: 'auto', marginTop: '10px' }}
          >
            パスワードをリセットする
          </Button>
        </>
      )}

      {step === 'confirmReset' && (
        <>
          <Text>新しいパスワードの設定</Text>
          <Space h="md" />
          <Text>
            {username} 宛にメールを送信しました。メールに記載されている確認コードと新しいパスワードを入力してください。
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
            placeholder="確認コード"
            onChange={(event) => setConfirmationCode(event.currentTarget.value)}
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', fontSize: '16px' }}
          />
          <Space h="md" />
          <PasswordInput
            radius="xl"
            variant="filled"
            value={newPassword}
            placeholder="新しいパスワード"
            onChange={(event) => {
              setNewPassword(event.currentTarget.value)
              setLoginError(null);
            }}
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' ,fontSize: '16px' }}
          />
          {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
          <Button
            color="gray"
            onClick={handleConfirmReset}
            style={{ display: 'block', marginLeft: 'auto', marginTop: '10px' }}
          >
            パスワードを再設定する
          </Button>
        </>
      )}


    </Modal>
  );
};

export default LoginModal;