import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';

export default function PreDefinedItem({ question }: { question: string }) {
  return (
    <Button className="h-fit rounded-2xl border bg-white px-2 py-1 text-xs text-gray-900 hover:bg-gray-100">
      <span>{question}</span>
      <ArrowTopRightIcon />
    </Button>
  );
}
