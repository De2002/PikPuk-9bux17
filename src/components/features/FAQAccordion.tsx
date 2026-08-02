import { FAQ } from "@/types";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  faqs: FAQ[];
}

const FAQAccordion = ({ faqs }: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={cn(
              "border rounded-xl overflow-hidden transition-all duration-200",
              isOpen ? "border-foreground/25 shadow-sm" : "border-border"
            )}
          >
            <button
              className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-secondary/50 transition-colors"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="font-sans font-medium text-sm text-foreground leading-relaxed">
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4">
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
