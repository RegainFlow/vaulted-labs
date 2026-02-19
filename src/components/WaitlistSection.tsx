import { IncentiveBanner } from "./IncentiveBanner";
import { WaitlistForm } from "./WaitlistForm";
import { useWaitlistCount } from "../hooks/useWaitlistCount";

export function WaitlistSection() {
  const { count, loading, incrementCount } = useWaitlistCount();

  return (
    <div>
      <IncentiveBanner count={count} loading={loading} />
      <WaitlistForm count={count} onJoinSuccess={incrementCount} />
    </div>
  );
}
