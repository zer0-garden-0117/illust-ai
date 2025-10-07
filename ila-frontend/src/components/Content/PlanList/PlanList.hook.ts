import { useCheckoutSessionCreate } from "@/apis/openapi/billings/useCheckoutSessionCreate";
import { usePortalSessionCreate } from "@/apis/openapi/billings/usePortalSessionCreate";
import { useFirebaseAuthContext } from "@/providers/auth/firebaseAuthProvider";
import { useRouter } from "next/navigation";

export type PlanData = {
  id: string;
  name: string;
  price: number;
  illustNum: number;
  illustHistoryDays: number;
  isRecommended?: boolean;
  features: string[];
};

export const usePlanList = () => {
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

  const planData: PlanData[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      illustNum: 3,
      illustHistoryDays: 3,
      features: [
      ]
    },
    {
      id: 'light',
      name: 'Light',
      price: 980,
      illustNum: 10,
      illustHistoryDays: 5,
      features: [
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 1980,
      illustNum: 20,
      illustHistoryDays: 7,
      isRecommended: true,
      features: [
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 2980,
      illustNum: 30,
      illustHistoryDays: 14,
      features: [
      ]
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: 4980,
      illustNum: 50,
      illustHistoryDays: 60,
      features: [
      ]
    },

  ]

  return {
    planData,
    handleSubscriptionClick,
    handleSubscriptionChangeClick
  };
};