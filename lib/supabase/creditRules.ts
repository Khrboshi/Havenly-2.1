export const CreditRules = {
  free: { reflectionsPerDay: 3, aiCallsPerDay: 5 },
  premium: { reflectionsPerDay: Infinity, aiCallsPerDay: Infinity },
} as const;

export const getRule = (plan: keyof typeof CreditRules) => CreditRules[plan];
