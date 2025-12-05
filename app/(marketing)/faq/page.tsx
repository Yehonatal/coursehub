import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function FAQPage() {
    const faqCategories = [
        {
            category: "General",
            items: [
                {
                    question: "What is CourseHub?",
                    answer: "CourseHub is a centralized adaptive learning platform designed specifically for Ethiopian university students and educators. It allows users to share, access, and rate educational resources aligned with their curriculum.",
                },
                {
                    question: "Is CourseHub free to use?",
                    answer: "Yes, the core features of CourseHub, including accessing public resources, uploading content, and community interactions, are free for all students. We also offer a premium subscription for advanced AI features.",
                },
                {
                    question: "Which universities are supported?",
                    answer: "Currently, we support major Ethiopian universities including Addis Ababa University, AASTU, ASTU, Jimma University, and Haramaya University. We are constantly expanding to include more institutions.",
                },
            ],
        },
        {
            category: "Account & Verification",
            items: [
                {
                    question: "How do I verify as an educator?",
                    answer: "During registration, you can select the 'Educator' account type. You will be asked to provide proof of your academic status (such as an ID card or official email), which our team will review. Once verified, you'll gain access to special tagging and moderation tools.",
                },
                {
                    question: "Can I change my university after registration?",
                    answer: "Yes, you can update your university in your profile settings. However, this may affect the relevance of your personalized feed and recommendations.",
                },
                {
                    question: "I forgot my password, what should I do?",
                    answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. We will send a reset link to your registered email address.",
                },
            ],
        },
        {
            category: "Content & AI Features",
            items: [
                {
                    question: "What are AI study aids?",
                    answer: "Our AI study aids use the Gemini Studio API to automatically generate study notes, flashcards, and knowledge trees from the documents you upload, helping you study more efficiently.",
                },
                {
                    question: "Can I upload my own notes?",
                    answer: "Absolutely! We encourage students to share their own high-quality lecture notes and summaries. Just make sure to tag them correctly with the course code and university so others can find them.",
                },
                {
                    question: "How does the rating system work?",
                    answer: "Users can rate any resource on a 5-star scale. These ratings help the community identify the most helpful materials. Highly-rated content is prioritized in search results.",
                },
                {
                    question: "Is there a limit to how much I can upload?",
                    answer: "Free accounts have a generous storage limit, but there are daily upload caps to prevent spam. Premium users enjoy increased storage and higher upload limits.",
                },
            ],
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <div className="container py-20 md:py-32 mx-auto px-4 md:px-6">
                <div
                    className="flex flex-col items-center justify-center space-y-4 text-center mb-20"
                    data-aos="fade-up"
                >
                    <div className="inline-block rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-2">
                        Support
                    </div>
                    <h1 className="text-4xl font-serif font-medium tracking-tight sm:text-5xl md:text-6xl">
                        Frequently Asked Questions
                    </h1>
                    <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                        Everything you need to know about the platform.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-16">
                    {faqCategories.map((category, catIndex) => (
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
                                collapsible
                                className="w-full"
                            >
                                {category.items.map((faq, index) => (
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

                <div
                    className="mt-32 bg-[#F5F2EB] rounded-3xl p-12 text-center max-w-4xl mx-auto"
                    data-aos="fade-up"
                >
                    <h2 className="text-3xl font-serif font-medium mb-4 text-[#0A251D]">
                        Still have questions?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Can't find the answer you're looking for? Please chat to
                        our friendly team.
                    </p>
                    <Link href="mailto:support@coursehub.et">
                        <Button className="rounded-full px-8 h-12 text-base">
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
