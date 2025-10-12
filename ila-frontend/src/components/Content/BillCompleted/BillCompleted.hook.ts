import { useRouter } from "next/navigation";
import { ImageDataOfImageCardsForHistory } from "../DrawHistory/ImageCardsForHistory/ImageCardsForHistory";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";

type UseBillCompletedrops = {
  priceId: string;
};

export const useBillCompleted = (
  { priceId }: UseBillCompletedrops
) => {

  const router = useRouter();
  const productName = "Sample Product";

  const handleDrawClick = () => {
    router.push('/draw');
  }

  return {
    priceId,
    productName,
    handleDrawClick,
  };
};