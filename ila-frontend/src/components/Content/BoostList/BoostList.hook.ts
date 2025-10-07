import { useCheckoutSessionCreate } from "@/apis/openapi/billings/useCheckoutSessionCreate";
import { usePortalSessionCreate } from "@/apis/openapi/billings/usePortalSessionCreate";
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
  const { trigger: triggerPortal } = usePortalSessionCreate();

  const handleSubscriptionClick = async (plan: string) => {
    const res = await triggerCheckout({
      headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
      body: { plan: plan },
    });
    if (res.checkoutSessionUrl) {
      window.location.href = res.checkoutSessionUrl;
    } else {
      console.error("checkoutSessionUrl is undefined");
    }
  }

  const handleSubscriptionChangeClick = async () => {
    const res = await triggerPortal({
      headers: { Authorization: `Bearer ${await getIdTokenLatest()}` },
      body: {},
    });
    if (res.portalSessionUrl) {
      window.location.href = res.portalSessionUrl;
    } else {
      console.error("portalSessionUrl is undefined");
    }
  }

  const boostData: BoostData[] = [
    {
      id: 'Boost',
      name: 'Boost',
      price: 290,
      increaseNum: 10,
      termDays: 7,
    },
    {
      id: 'Boost 2X',
      name: 'Boost 2X',
      price: 490,
      increaseNum: 20,
      termDays: 7,
    },
  ]

  return {
    boostData,
    handleSubscriptionClick,
    handleSubscriptionChangeClick
  };
};