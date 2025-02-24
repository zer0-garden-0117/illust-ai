import { useEffect, useState } from 'react';
import { Modal, Button, TextInput, PasswordInput, Text, Divider, Space, Grid, Alert, Tabs, Group } from '@mantine/core';
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

// ログインの内容を別コンポーネントに分離
const LoginContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { login, loginWithGoogle, loginWithLine, resetPass, confirmResetPass } = useAccessTokenContext();
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
      setLoginError('Lineログインに失敗しました。');
      console.error('Line login failed:', error);
    }
  };

  useEffect(() => {
    if (step === 'login') {
      setStep('login');
    }
  }, [step]);

  const handlePasswordReset = () => {
    setStep('reset');
  };

  const handlePasswordResetRequest = async (email: string) => {
    try {
      await resetPass(email);
      console.log('Password reset email sent to:', email);
      setStep('confirmReset');
    } catch (error) {
      setLoginError('パスワード再設定に失敗しました。');
      console.error('Password reset failed:', error);
    }
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
    <>
      {step === 'login' && (
        <>
          <Text size='xs'>メールアドレスでログイン</Text>
          <Space h="md" />
          <div style={{ width: '80%', margin: '0 auto' }}>
            <TextInput
              radius="xl"
              variant="filled"
              size='xs'
              value={username}
              placeholder="メールアドレス"
              onChange={(event) => setUsername(event.currentTarget.value)}
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <Space h="xs" />
            <PasswordInput
              radius="xl"
              variant="filled"
              size='xs'
              value={password}
              placeholder="パスワード"
              onChange={(event) => {
                setPassword(event.currentTarget.value)
                setLoginError(null);
              }}
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            />
            {loginError && <div style={{ color: 'red' }}>{loginError}</div>}

            <Grid>
              <Grid.Col span={6}>
                <Space h="xs" />
                <Button
                  variant="transparent"
                  onClick={handlePasswordReset}
                  color="gray"
                  size="compact-xs"
                >
                  <Text size='xs'>パスワードリセット</Text>
                </Button>
              </Grid.Col>
              <Grid.Col span={6}>
                <Button
                  color="gray"
                  onClick={handleLogin}
                  size="compact-xs"
                  radius='xl'
                  style={{ display: 'block', marginLeft: 'auto', marginTop: '13px' }}
                >
                  <Text size='xs'>ログイン</Text>
                </Button>
              </Grid.Col>
            </Grid>
          </div>
          <Divider my="xs" variant="dashed" label="or" labelPosition="center" />
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
          <Button
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
          </Button>
          <Space h="md" />
        </>
      )}
      {step === 'reset' && (
        <>
          <Text size='xs'>パスワードのリセット</Text>
          <Space h="md" />
          <div style={{ width: '80%', margin: '0 auto' }}>
          <TextInput
            radius="xl"
            size='xs'
            variant="filled"
            value={username}
            placeholder="メールアドレス"
            onChange={(event) => setUsername(event.currentTarget.value)}
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          />
          <Group justify="space-between" mt={13}>
            <Button
              color="gray"
              onClick={() => setStep("login")}
              size='compact-xs'
              radius='xl'
            >
              戻る
            </Button>
            <Button
              color="gray"
              onClick={() => handlePasswordResetRequest(username)}
              size='compact-xs'
              radius='xl'
            >
              パスワードをリセットする
            </Button>
          </Group>
          </div>
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
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
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
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          />
          {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
          <Button
            color="gray"
            onClick={handleConfirmReset}
            style={{ display: 'block', marginLeft: 'auto', marginTop: '10px' }}
          >
            パスワードを再設定する
          </Button>
          <Space h="md" />
        </>
      )}
    </>
  );
};

// 新規登録の内容を別コンポーネントに分離
const SignupContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { login, loginWithGoogle, loginWithLine, register, confirmSignup } = useAccessTokenContext();
  const [username, setUsername] = useState('');
  const [userNameError, setUserNameError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [step, setStep] = useState<'signup' | 'confirmation'>('signup');

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
      const { success, message } = await register(username, password);
      if (success) {
        setStep('confirmation');
      } else {
        setUserNameError("入力されたメールアドレスは既に登録されています。")
      }
    } catch (error) {
      setRegisterError('登録に失敗しました。');
      console.error('Registration failed:', error);
    }
  };

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

  const handleConfirmation = async (email: string, code: string) => {
    try {
      const result = await confirmSignup(email, code);
      if (result.success) {
        try {
          const result = await login(username, password);
          if (result?.message == "CONFIRM_SIGN_UP") {
            setRegisterError('メールアドレスに本人確認コードを送信しました。本人確認コードを入力してください');
          } else if (result?.success == false) {
            setRegisterError('ログインに失敗しました。');
          } else {
            onClose();
          }
        } catch (error) {
          setRegisterError('ログインに失敗しました。');
          console.error('Login failed:', error);
        }
      } else {
        setRegisterError('確認に失敗しました。');
      }
    } catch (error) {
      setRegisterError('確認中にエラーが発生しました。');
      console.error('Confirmation failed:', error);
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
          <Text size='xs'>メールアドレスで登録</Text>
          <Space h="md" />
          <div style={{ width: '80%', margin: '0 auto' }}>
            <TextInput
              radius="xl"
              variant="filled"
              size='xs'
              value={username}
              placeholder="メールアドレス"
              onChange={(event) => {
                setUsername(event.currentTarget.value);
                setUserNameError(null);
              }}
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
              error={userNameError}
            />
            <Space h="xs" />
            <PasswordInput
              radius="xl"
              variant="filled"
              size='xs'
              value={password}
              placeholder="パスワード"
              onChange={(event) => {
                setPassword(event.currentTarget.value);
                setPasswordError(null);
              }}
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
              error={passwordError}
            />
            {registerError && <div style={{ color: 'red' }}>{registerError}</div>}
            <Button
              color="gray"
              onClick={handleSignup}
              radius='xl'
              size='compact-xs'
              style={{ display: 'block', marginLeft: 'auto', marginTop: '13px' }}
            >
              新規登録
            </Button>
          </div>
          <Divider my="xs" variant="dashed" label="or" labelPosition="center" />
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
          <Button
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
          </Button>
          <Space h="md" />
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
            onChange={(event) => setConfirmationCode(event.currentTarget.value)}
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
    </>
  );
};

export default AuthModal;