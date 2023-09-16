import { COMPLEXITY } from "@/types/enums";
import { Chip } from "@nextui-org/react";

const variant = "solid";

function renderChip(complexity: string) {
  switch (complexity.toUpperCase()) {
    case COMPLEXITY.EASY:
      return (
        <Chip color="success" variant={variant}>
          Easy
        </Chip>
      );
    case COMPLEXITY.MEDIUM:
      return (
        <Chip color="warning" variant={variant}>
          Medium
        </Chip>
      );
    case COMPLEXITY.HARD:
      return (
        <Chip color="danger" variant={variant}>
          Hard
        </Chip>
      );
    default:
      return <Chip>{complexity}</Chip>;
  }
}

export default function ComplexityChip({ complexity }: { complexity: string }) {
  return renderChip(complexity);
}
