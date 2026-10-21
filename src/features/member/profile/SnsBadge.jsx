import { SNS_BADGE, SNS_NAME } from '../shared/snsCodes';

export default function SnsBadge({ snsTyCd }) {
  return (
    <span
      className={`mr-1.5 inline-flex h-5 items-center rounded-xs px-1.5 text-xs font-bold ${SNS_BADGE[snsTyCd]}`}
    >
      {SNS_NAME[snsTyCd]}
    </span>
  );
}
