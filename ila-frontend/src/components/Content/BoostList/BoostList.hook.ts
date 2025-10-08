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
      id: 'boosts',
      name: 'Boost S',
      price: 220,
      increaseNum: 10,
      termDays: 7,
    },
    {
      id: 'boostm',
      name: 'Boost M',
      price: 880,
      increaseNum: 10,
      termDays: 30,
    },
      {
      id: 'boostl',
      name: 'Boost L',
      price: 1680,
      increaseNum: 20,
      termDays: 30,
    },
  ]

  return {
    boostDatas,
    handleAddClick,
  };
};