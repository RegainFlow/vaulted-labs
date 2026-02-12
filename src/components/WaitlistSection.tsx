import { IncentiveBanner } from "./IncentiveBanner";
import { WaitlistForm } from "./WaitlistForm";

export function WaitlistSection() {
  return (
    <div id="waitlist">
      <IncentiveBanner />
      <WaitlistForm />
    </div>
  );
}
