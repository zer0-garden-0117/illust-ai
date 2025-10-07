import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useMyUserUpdate } from "@/apis/openapi/users/useMyUserUpdate";
import { useUserCheckAvailability } from "@/apis/openapi/users/useUserCheckAvailability";
import { useUsersGet } from "@/apis/openapi/users/useUsersGet";

type UseUserInfoProps = {
  userId: string;
};

export type UserInfoFormValues = {
  customUserId: string;
  profileImageUrl: string;
  coverImageUrl: string;
  userName: string;
  userProfile: string;
};

export const useUserInfo = (
  { userId }: UseUserInfoProps
) => {
  const router = useRouter();
  const { user, getFreshIdToken, getIdTokenLatest } = useFirebaseAuthContext();
  const { trigger: checkAvailability, isMutating: isChecking } = useUserCheckAvailability();
  const { trigger: updateMyUser } = useMyUserUpdate();
  const [coverImageFile, setCoverImageFile] = useState<File>(new File([], ""));
  const [profileImageFile, setProfileImageFile] = useState<File>(new File([], ""));
  const [isSaving, setIsSaving] = useState(false);
  const [isUserIdAvailable, setIsUserIdAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginUser, setIsLoginUser] = useState(false);
  const [opened, setOpened] = useState(false);

  const { data: userData, mutate: updateUser } = useUsersGet({
    customUserId: userId,
    getIdTokenLatest,
  }, { revalidateOnFocus: true });

  useEffect(() => {
    setIsLoginUser(!!(user && userData?.customUserId === user.customUserId));
  }, [user, userData]);

  const form = useForm<UserInfoFormValues>({
    initialValues: {
      customUserId: userData?.customUserId || '',
      profileImageUrl: userData?.profileImageUrl || '',
      coverImageUrl: userData?.coverImageUrl || '',
      userName: userData?.userName || '',
      userProfile: userData?.userProfile || '',
    },
  });

  const initForm = () => {
    form.setValues({
      customUserId: userData?.customUserId || '',
      profileImageUrl: userData?.profileImageUrl || '',
      coverImageUrl: userData?.coverImageUrl || '',
      userName: userData?.userName || '',
      userProfile: userData?.userProfile || '',
    });
    setCoverImageFile(new File([], ""));
    setProfileImageFile(new File([], ""));
  };

  const validateCustomUserId = async (value: string) => {
    setIsLoading(true)
    // 3文字以上かつ12文字以下の英数字とアンダースコアのみ許可
    const regex = /^[a-zA-Z0-9_]{3,12}$/;
    if (!regex.test(value)) {
      setIsUserIdAvailable(false);
      setIsLoading(false);
      return 'ユーザーIDは3〜12文字の英数字と_のみ使用可能です';
    }

    // 空文字または元のユーザーIDと同じ場合はチェックしない
    if (!value || value === userData?.customUserId) {
      setIsUserIdAvailable(true);
      setIsLoading(false);
      return null;
    }

    // ここで0.5秒遅延
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const isAvailable = await checkAvailability({ 
        customUserId: value,
        headers: { Authorization: `Bearer ${await getIdTokenLatest()}` }
      });
      setIsUserIdAvailable(isAvailable);
      setIsLoading(false);
      return isAvailable ? null : 'このユーザーIDは既に使用されています';
    } catch (error) {
      console.error('ユーザーIDチェックエラー:', error);
      setIsUserIdAvailable(false);
      setIsLoading(false);
      return 'ユーザーIDの確認中にエラーが発生しました';
    }
  }

  const handleSave = async (values: UserInfoFormValues) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await updateMyUser({
        headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
        body: {
          coverImage: coverImageFile,
          profileImage: profileImageFile,
          customUserId: values.customUserId,
          userName: values.userName,
          userProfile: values.userProfile
        }
      });
      // 更新処理後、モーダルを閉じる
      setOpened(false);

      // トークンと認証情報を更新
      await getFreshIdToken();
      updateUser();

      // 画面遷移
      window.location.href = `/user/${values.customUserId}`;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverImageDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      setCoverImageFile(files[0]);
      const previewUrl = URL.createObjectURL(files[0]);
      form.setFieldValue('coverImageUrl', previewUrl);
    }
  }, []);

  const handleProfileImageDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      setProfileImageFile(files[0]);
      const previewUrl = URL.createObjectURL(files[0]);
      form.setFieldValue('profileImageUrl', previewUrl);
    }
  }, []);

  const handleEditButton = () => {
    initForm();
    setOpened(true);
  }

  const handleFollowListClick = () => {
    router.push(`/user/${userData?.customUserId}/follow?page=1`);
  };
  
  const handleFollowerListClick = () => {
    router.push(`/user/${userData?.customUserId}/follower?page=1`);
  };

  const handlePlanChangeClick = () => {
    router.push('/plan');
  }

  const handleBoostChangeClick = () => {
    router.push('/boost');
  }

  return {
    form,
    userData,
    isLoginUser,
    isChecking,
    isSaving,
    isUserIdAvailable,
    isLoading,
    opened,
    updateUser,
    validateCustomUserId,
    setOpened,
    handleSave,
    handleCoverImageDrop,
    handleProfileImageDrop,
    handleEditButton,
    handleFollowListClick,
    handleFollowerListClick,
    handlePlanChangeClick,
    handleBoostChangeClick
  };
};