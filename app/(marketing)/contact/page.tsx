import React from "react";
import { PageHeader } from "@/components/marketing/PageHeader";
import { HandDrawnUnderline } from "@/components/ui/decorations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export const dynamic = "force-static";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <PageHeader
                tag="Get in Touch"
                title={
                    <>
                        We&apos;d love to{" "}
                        <HandDrawnUnderline className="text-primary">
                            hear from you
                        </HandDrawnUnderline>
                    </>
                }
                subtitle="Have a question, suggestion, or just want to say hello? We're here to help."
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    <div className="space-y-8" data-aos="fade-right">
                        <div>
                            <h3 className="text-2xl font-serif font-bold mb-4">
                                Contact Information
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                Whether you have a question about features,
                                pricing, or anything else, our team is ready to
                                answer all your questions.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Email</h4>
                                    <p className="text-muted-foreground text-sm">
                                        support@coursehub.et
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        partnerships@coursehub.et
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Phone</h4>
                                    <p className="text-muted-foreground text-sm">
                                        +251 966339226
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Mon-Fri from 8am to 5pm
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Office</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Haramaya University, Harar Campus
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Haramaya, Ethiopia
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div
                        className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm"
                        data-aos="fade-left"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="first-name"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        First name
                                    </label>
                                    <Input
                                        id="first-name"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="last-name"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Last name
                                    </label>
                                    <Input
                                        id="last-name"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="subject"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Subject
                                </label>
                                <Input
                                    id="subject"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    placeholder="Tell us more about your inquiry..."
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
