import React from "react";

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl font-sans text-foreground">
            <h1 className="text-4xl font-serif font-bold mb-8 text-[#0A251D]">
                Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-8">
                Last updated: December 5, 2025
            </p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        1. Introduction
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Welcome to CourseHub. We respect your privacy and are
                        committed to protecting your personal data. This privacy
                        policy will inform you as to how we look after your
                        personal data when you visit our website and tell you
                        about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        2. The Data We Collect
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        We may collect, use, store and transfer different kinds
                        of personal data about you which we have grouped
                        together follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                            <strong>Identity Data:</strong> includes first name,
                            last name, username or similar identifier, and
                            university affiliation.
                        </li>
                        <li>
                            <strong>Contact Data:</strong> includes email
                            address and telephone numbers.
                        </li>
                        <li>
                            <strong>Technical Data:</strong> includes internet
                            protocol (IP) address, your login data, browser type
                            and version, time zone setting and location, and
                            operating system and platform.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> includes information
                            about how you use our website, products, and
                            services, including resources viewed and downloaded.
                        </li>
                        <li>
                            <strong>Content Data:</strong> includes educational
                            resources, comments, and ratings you upload or post
                            to the platform.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        3. How We Use Your Data
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        We will only use your personal data when the law allows
                        us to. Most commonly, we will use your personal data in
                        the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>To register you as a new customer.</li>
                        <li>
                            To provide and improve our educational services,
                            including AI-powered study aids.
                        </li>
                        <li>
                            To manage our relationship with you, including
                            notifying you about changes to our terms or privacy
                            policy.
                        </li>
                        <li>
                            To administer and protect our business and this
                            website (including troubleshooting, data analysis,
                            testing, system maintenance, support, reporting and
                            hosting of data).
                        </li>
                        <li>
                            To use data analytics to improve our website,
                            products/services, marketing, customer relationships
                            and experiences.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        4. Data Security
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We have put in place appropriate security measures to
                        prevent your personal data from being accidentally lost,
                        used or accessed in an unauthorized way, altered or
                        disclosed. In addition, we limit access to your personal
                        data to those employees, agents, contractors and other
                        third parties who have a business need to know.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        5. Your Legal Rights
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Under certain circumstances, you have rights under data
                        protection laws in relation to your personal data,
                        including the right to request access, correction,
                        erasure, restriction, transfer, to object to processing,
                        to portability of data and (where the lawful ground of
                        processing is consent) to withdraw consent.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        6. Contact Us
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        If you have any questions about this privacy policy or
                        our privacy practices, please contact us at:{" "}
                        <a
                            href="mailto:privacy@coursehub.et"
                            className="text-primary hover:underline"
                        >
                            privacy@coursehub.et
                        </a>
                        .
                    </p>
                </section>
            </div>
        </div>
    );
}
