// types/base/challenge.ts

import { CurrencyType } from "./enums";

export interface ChallengeRewards {
    readonly xp: number;
    readonly currency: {
      readonly type: CurrencyType;
      readonly amount: number;
    };
  }