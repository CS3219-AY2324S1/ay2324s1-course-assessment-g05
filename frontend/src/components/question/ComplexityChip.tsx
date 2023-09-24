import { COMPLEXITY } from "@/types/enums";
import { Chip } from "@nextui-org/react";

const variant = "solid";

function renderChip(complexity: string, size: "sm" | "md" | "lg") {
  switch (complexity.toUpperCase()) {
    case COMPLEXITY.EASY:
      return (
        <Chip color="success" variant={variant} size={size}>
          Easy
        </Chip>
      );
    case COMPLEXITY.MEDIUM:
      return (
        <Chip color="warning" variant={variant} size={size}>
          Medium
        </Chip>
      );
    case COMPLEXITY.HARD:
      return (
        <Chip color="danger" variant={variant} size={size}>
          Hard
        </Chip>
      );
    default:
      return <Chip>{complexity}</Chip>;
  }
}

export default function ComplexityChip({ 
  complexity, 
  size 
}: { 
  complexity: string, 
  size: "sm" | "md" | "lg" }) {
  return renderChip(complexity, size);
}
