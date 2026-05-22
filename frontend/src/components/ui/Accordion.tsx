import * as RadixAccordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

// Re-export root
export const Accordion = RadixAccordion.Root;

// Item wrapper
interface AccordionItemProps {
	value: string;
	children: ReactNode;
	className?: string;
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
	return (
		<RadixAccordion.Item
			value={value}
			className={cn("border-b border-outline-variant last:border-b-0", className)}
		>
			{children}
		</RadixAccordion.Item>
	);
}

// Trigger (header)
interface AccordionTriggerProps {
	children: ReactNode;
	className?: string;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
	return (
		<RadixAccordion.Header asChild>
			<RadixAccordion.Trigger
				className={cn(
					"group flex w-full items-center justify-between py-5 text-left text-headline-sm font-semibold text-on-surface transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
					className,
				)}
			>
				{children}
				<ChevronDown
					size={20}
					className="shrink-0 text-on-surface-variant transition-transform duration-200 group-data-[state=open]:rotate-180"
					aria-hidden="true"
				/>
			</RadixAccordion.Trigger>
		</RadixAccordion.Header>
	);
}

// Content
interface AccordionContentProps {
	children: ReactNode;
	className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
	return (
		<RadixAccordion.Content
			className={cn(
				"overflow-hidden text-body-md text-on-surface-variant data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
				className,
			)}
		>
			<div className="pb-5 pt-0">{children}</div>
		</RadixAccordion.Content>
	);
}
