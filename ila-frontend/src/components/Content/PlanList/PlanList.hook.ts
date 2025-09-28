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

  const handleSubscriptionClick = () => {
    // プラン変更のAPI呼び出し
  }

  const planData: PlanData[] = [
    {
      id: 'Free',
      name: 'Free',
      price: 0,
      illustNum: 3,
      illustHistoryDays: 3,
      features: [
      ]
    },
    {
      id: 'Light',
      name: 'Light',
      price: 980,
      illustNum: 10,
      illustHistoryDays: 5,
      features: [
      ]
    },
    {
      id: 'Basic',
      name: 'Basic',
      price: 1980,
      illustNum: 20,
      illustHistoryDays: 7,
      isRecommended: true,
      features: [
      ]
    },
    {
      id: 'Pro',
      name: 'Pro',
      price: 2980,
      illustNum: 30,
      illustHistoryDays: 14,
      features: [
      ]
    },
    {
      id: 'Unlimited',
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
    handleSubscriptionClick
  };
};