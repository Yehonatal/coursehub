import { PageHeader } from "@/components/marketing/PageHeader";
import { FAQList } from "@/components/marketing/FAQList";
import { SupportCTA } from "@/components/marketing/SupportCTA";
import { HandDrawnUnderline } from "@/components/ui/decorations";

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
            <PageHeader
                tag="Support"
                title={
                    <>
                        Frequently Asked{" "}
                        <HandDrawnUnderline className="text-[#F5A623]">
                            Questions
                        </HandDrawnUnderline>
                    </>
                }
                subtitle="Everything you need to know about the platform."
            />
            <FAQList categories={faqCategories} />
            <SupportCTA />
        </div>
    );
}
