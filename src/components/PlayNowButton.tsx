import { Link } from "react-router-dom";

interface PlayNowButtonProps {
  to?: string;
}

export function PlayNowButton({ to = "/play" }: PlayNowButtonProps) {
  return (
    <Link to={to} className="pushable">
      <span className="pushable-shadow" />
      <span className="pushable-edge" />
      <span className="pushable-front">
        PLAY NOW
      </span>
    </Link>
  );
}
