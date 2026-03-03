export const TIERS = {
  starter: {
    name: "Starter",
    price_id: "price_1T6an7IvlsTrPGD24jJcOZQo",
    product_id: "prod_U4kHrmg5PTYU7m",
    price: 9,
  },
  pro: {
    name: "Pro",
    price_id: "price_1T6anQIvlsTrPGD25jcvVp7J",
    product_id: "prod_U4kHX6NsmvLohV",
    price: 29,
  },
  scale: {
    name: "Scale",
    price_id: "price_1T6ao0IvlsTrPGD2q2p2SfJa",
    product_id: "prod_U4kIfnBXKPFAvg",
    price: 79,
  },
} as const;

export type TierKey = keyof typeof TIERS;
