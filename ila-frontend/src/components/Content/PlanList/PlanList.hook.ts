import { useRouter } from "next/navigation";

export type PlanData = {
  id: string;
  name: string;
  price: number;
  illustNum: number;
  illustHistoryDays: number;
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
      name: 'Free Plan',
      price: 0,
      illustNum: 3,
      illustHistoryDays: 3,
      features: [
      ]
    },
    {
      id: 'Light',
      name: 'Light Plan',
      price: 980,
      illustNum: 10,
      illustHistoryDays: 5,
      features: [
      ]
    },
    {
      id: 'Basic',
      name: 'Basic Plan',
      price: 1980,
      illustNum: 20,
      illustHistoryDays: 7,
      features: [
      ]
    },
    {
      id: 'Pro',
      name: 'Pro Plan',
      price: 2980,
      illustNum: 30,
      illustHistoryDays: 14,
      features: [
      ]
    },
    {
      id: 'Unlimited',
      name: 'Unlimited Plan',
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