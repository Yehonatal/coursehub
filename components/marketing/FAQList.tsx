import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type FAQ = { question: string; answer: string };
type FAQCategory = { category: string; items: FAQ[] };

export function FAQList({ categories }: { categories: FAQCategory[] }) {
    return (
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 md:space-y-16 px-4 sm:px-6 lg:px-8">
            {categories.map((category, catIndex) => (
                <div
                    key={catIndex}
                    data-aos="fade-up"
                    data-aos-delay={catIndex * 100}
                >
                    <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold mb-4 sm:mb-6 text-foreground border-b border-border/60 pb-3">
                        {category.category}
                    </h2>
                    <Accordion
                        type="single"
                        collapsible={true}
                        defaultValue={
                            catIndex === 0 ? `item-${catIndex}-0` : undefined
                        }
                        className="w-full space-y-2 sm:space-y-3"
                    >
                        {category.items.map((faq, index: number) => (
                            <AccordionItem
                                key={index}
                                value={`item-${catIndex}-${index}`}
                                className="border border-border/40 rounded-lg px-4 py-2"
                            >
                                <AccordionTrigger className="text-left text-sm sm:text-base md:text-lg font-bold text-primary hover:no-underline py-2 sm:py-3">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed pt-2 pb-3">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ))}
        </div>
    );
}
