export interface Step {
  number: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
  image: string;
  iconColor: string;
  icon: React.ReactNode;
}

export interface IncentiveTier {
  label: string;
  creditAmount: number;
  spots: number;
  startAt: number;
  endAt: number;
  color: string;
}

export interface IncentiveBannerProps {
  count: number;
  loading: boolean;
}

export interface WaitlistFormProps {
  count: number;
}

export interface TurnstileWidgetHandle {
  getResponse: () => string | null;
  reset: () => void;
}

export interface TurnstileWidgetProps {
  siteKey: string | undefined;
}

export interface NavbarProps {
  showHUD?: boolean;
  balance?: number;
  inventoryCount?: number;
  xp?: number;
  level?: number;
  prestigeLevel?: number;
}
