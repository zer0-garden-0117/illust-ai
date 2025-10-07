import { useCheckoutSessionCreate } from "@/apis/openapi/billings/useCheckoutSessionCreate";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useRouter } from "next/navigation";

export type BoostData = {
  id: string;
  name: string;
  price: number;
  increaseNum: number;
  termDays: number;
};

export const useBoostList = () => {
  const router = useRouter();
  const { getIdTokenLatest } = useFirebaseAuthContext();
  const { trigger: triggerCheckout } = useCheckoutSessionCreate();

  const handleAddClick = async (product: string) => {
    const res = await triggerCheckout({
      headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
      body: {
        product: product,
        productType: 'one-time'
      },
    });
    if (res.checkoutSessionUrl) {
      window.location.href = res.checkoutSessionUrl;
    } else {
      console.error("checkoutSessionUrl is undefined");
    }
  }

  const boostDatas: BoostData[] = [
    {
      id: 'boost',
      name: 'Boost',
      price: 290,
      increaseNum: 10,
      termDays: 7,
    },
    {
      id: 'boost2x',
      name: 'Boost 2X',
      price: 490,
      increaseNum: 20,
      termDays: 7,
    },
  ]

  return {
    boostDatas,
    handleAddClick,
  };
};