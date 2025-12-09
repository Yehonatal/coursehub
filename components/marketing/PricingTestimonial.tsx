import React from "react";

export function PricingTestimonial() {
    return (
        <div
            className="bg-[#0A251D] text-white mb-32 md:rounded-3xl p-12 md:p-20 text-center max-w-5xl mx-auto"
            data-aos="fade-up"
        >
            <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className="w-6 h-6 text-yellow-400 fill-current"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-serif font-medium leading-relaxed mb-8">
                &ldquo;The Pro plan is worth every cent. The unlimited AI
                summaries saved me hours of reading time during finals week. My
                GPA has never been higher.&rdquo;
            </blockquote>
            <div className="flex flex-col items-center">
                <div className="font-bold text-lg">Natnael Abebe</div>
                <div className="text-white/70">
                    Software Engineering Student, AAU
                </div>
            </div>
        </div>
    );
}
