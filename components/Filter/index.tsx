import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FilterItem<Value extends string = string> = {
  value: Value;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: (value: Value) => void;
};

type FilterProps<Value extends string = string> = {
  items: readonly FilterItem<Value>[];
  value: Value;
  onChange?: (value: Value) => void;
  label?: string;
  className?: string;
};

export function Filter<Value extends string = string>({
  items,
  value,
  onChange,
  label = "Filter",
  className,
}: FilterProps<Value>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      {items.map((item) => {
        const selected = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.onClick?.(item.value);
              onChange?.(item.value);
            }}
            className={cn(
              "group relative isolate flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm leading-tight font-ui-label-medium transition-colors duration-150 ease-out-expo",
              "disabled:pointer-events-none disabled:opacity-40",
              selected ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            <span
              className={cn(
                "absolute inset-0 z-0 rounded-full transition-all duration-150 ease-out-expo",
                selected
                  ? "bg-surface-raised dark:bg-surface"
                  : "bg-surface-raised/35 group-hover:bg-surface-raised/60 dark:bg-surface/35 dark:group-hover:bg-surface/75",
              )}
            />
            {item.icon && (
              <span className="relative z-10 -ml-0.5 inline-flex">
                {item.icon}
              </span>
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
