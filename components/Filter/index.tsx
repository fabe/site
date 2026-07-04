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
  itemClassName?: string;
};

export function Filter<Value extends string = string>({
  items,
  value,
  onChange,
  label = "Filter",
  className,
  itemClassName,
}: FilterProps<Value>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-line bg-surface/80 p-0.5 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur dark:bg-surface/60 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      )}
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
              "relative inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-ui-label leading-none transition-all duration-150 ease-out-expo",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
              selected
                ? "bg-canvas text-fg shadow-[0_1px_1px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.06)] dark:bg-surface-raised dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_6px_rgba(0,0,0,0.25)]"
                : "text-muted hover:bg-canvas/70 hover:text-fg dark:hover:bg-surface-raised/60",
              "disabled:pointer-events-none disabled:opacity-50",
              itemClassName,
            )}
          >
            {item.icon && <span className="-ml-0.5 inline-flex text-current">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
