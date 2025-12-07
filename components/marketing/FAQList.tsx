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
        <div className="max-w-5xl mx-auto space-y-16">
            {categories.map((category, catIndex) => (
                <div
                    key={catIndex}
                    data-aos="fade-up"
                    data-aos-delay={catIndex * 100}
                >
                    <h2 className="text-2xl font-serif font-bold mb-8 text-[#0A251D] border-b border-border/60 pb-2">
                        {category.category}
                    </h2>
                    <Accordion
                        type="single"
                        collapsible={true}
                        defaultValue={
                            catIndex === 0 ? `item-${catIndex}-0` : undefined
                        }
                        className="w-full"
                    >
                        {category.items.map((faq, index: number) => (
                            <AccordionItem
                                key={index}
                                value={`item-${catIndex}-${index}`}
                            >
                                <AccordionTrigger className="text-left text-lg font-bold text-primary hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
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
