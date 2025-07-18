// utils/navigate.ts
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export const useNavigate = () => {
  const router = useRouter();
  const locale = useLocale();
  const navigate = (path: string) => {
    if (path === '/') {
      sessionStorage.removeItem(`scrollPosition-/${locale}`);
    } else {
      sessionStorage.removeItem(`scrollPosition-/${locale}${path}`);
    }
    router.push(path);
  };

  return navigate;
};