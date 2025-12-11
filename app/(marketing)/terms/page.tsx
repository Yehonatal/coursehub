export const dynamic = "force-static";

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl font-sans text-foreground">
            <h1 className="text-4xl font-serif font-bold mb-8 text-[#0A251D]">
                Terms and Conditions
            </h1>
            <p className="text-muted-foreground mb-8">
                Last updated: December 5, 2025
            </p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        1. Agreement to Terms
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        These Terms and Conditions constitute a legally binding
                        agreement made between you, whether personally or on
                        behalf of an entity ("you") and CourseHub ("we," "us" or
                        "our"), concerning your access to and use of the
                        CourseHub website as well as any other media form, media
                        channel, mobile website or mobile application related,
                        linked, or otherwise connected thereto (collectively,
                        the "Site").
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        2. Intellectual Property Rights
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Unless otherwise indicated, the Site is our proprietary
                        property and all source code, databases, functionality,
                        software, website designs, audio, video, text,
                        photographs, and graphics on the Site (collectively, the
                        "Content") and the trademarks, service marks, and logos
                        contained therein (the "Marks") are owned or controlled
                        by us or licensed to us, and are protected by copyright
                        and trademark laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        3. User Representations
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        By using the Site, you represent and warrant that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                            All registration information you submit will be
                            true, accurate, current, and complete.
                        </li>
                        <li>
                            You will maintain the accuracy of such information
                            and promptly update such registration information as
                            necessary.
                        </li>
                        <li>
                            You have the legal capacity and you agree to comply
                            with these Terms and Conditions.
                        </li>
                        <li>
                            You will not use the Site for any illegal or
                            unauthorized purpose.
                        </li>
                        <li>
                            Your use of the Site will not violate any applicable
                            law or regulation.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        4. User Generated Content
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        The Site may invite you to chat, contribute to, or
                        participate in blogs, message boards, online forums, and
                        other functionality, and may provide you with the
                        opportunity to create, submit, post, display, transmit,
                        perform, publish, distribute, or broadcast content and
                        materials to us or on the Site, including but not
                        limited to text, writings, video, audio, photographs,
                        graphics, comments, suggestions, or personal information
                        or other material (collectively, "Contributions").
                        Contributions may be viewable by other users of the Site
                        and through third-party websites.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        5. Educational Resources
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        CourseHub provides a platform for sharing educational
                        resources. We do not guarantee the accuracy,
                        completeness, or usefulness of any resource available on
                        the Site. Users are responsible for verifying the
                        information before relying on it. Uploading copyrighted
                        material without authorization is strictly prohibited.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        6. Limitation of Liability
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        In no event will we or our directors, employees, or
                        agents be liable to you or any third party for any
                        direct, indirect, consequential, exemplary, incidental,
                        special, or punitive damages, including lost profit,
                        lost revenue, loss of data, or other damages arising
                        from your use of the site, even if we have been advised
                        of the possibility of such damages.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A251D]">
                        7. Contact Us
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        In order to resolve a complaint regarding the Site or to
                        receive further information regarding use of the Site,
                        please contact us at:{" "}
                        <a
                            href="mailto:legal@coursehub.et"
                            className="text-primary hover:underline"
                        >
                            legal@coursehub.et
                        </a>
                        .
                    </p>
                </section>
            </div>
        </div>
    );
}
