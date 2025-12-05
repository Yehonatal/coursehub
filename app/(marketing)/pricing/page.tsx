import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function PricingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <div className="container py-20 md:py-32 mx-auto px-4 md:px-6">
                <div
                    className="flex flex-col items-center justify-center space-y-4 text-center mb-20"
                    data-aos="fade-up"
                >
                    <div className="inline-block rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-2">
                        Membership Plans
                    </div>
                    <h1 className="text-4xl font-serif font-medium tracking-tight sm:text-5xl md:text-6xl">
                        Invest in your future
                    </h1>
                    <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                        Choose the plan that fits your learning needs. Upgrade
                        anytime as your academic demands grow.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:max-w-5xl lg:mx-auto mb-32">
                    <div
                        className="flex flex-col p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                        data-aos="fade-right"
                    >
                        <div className="space-y-2 mb-6">
                            <h3 className="text-2xl font-serif font-bold">
                                Student Basic
                            </h3>
                            <p className="text-muted-foreground">
                                Essential tools for every student.
                            </p>
                        </div>
                        <div className="flex items-baseline text-4xl font-serif font-bold mb-8">
                            Free
                            <span className="ml-2 text-lg font-sans font-normal text-muted-foreground">
                                / forever
                            </span>
                        </div>
                        <ul className="space-y-4 flex-1 mb-8">
                            <li className="flex items-center text-sm">
                                <Check className="mr-3 h-5 w-5 text-primary" />
                                Access to all public resources
                            </li>
                            <li className="flex items-center text-sm">
                                <Check className="mr-3 h-5 w-5 text-primary" />
                                Upload and share content
                            </li>
                            <li className="flex items-center text-sm">
                                <Check className="mr-3 h-5 w-5 text-primary" />
                                Community rating and comments
                            </li>
                            <li className="flex items-center text-sm">
                                <Check className="mr-3 h-5 w-5 text-primary" />
                                Limited AI study aid generation (5/month)
                            </li>
                        </ul>
                        <Link href="/register">
                            <Button
                                className="w-full h-12 rounded-full text-base"
                                variant="outline"
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    <div
                        className="flex flex-col p-8 bg-[#F5F2EB] border-2 border-primary rounded-2xl shadow-xl relative"
                        data-aos="fade-left"
                    >
                        <div className="absolute top-0 right-0 -mt-4 mr-6 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                            Most Popular
                        </div>
                        <div className="space-y-2 mb-6">
                            <h3 className="text-2xl font-serif font-bold text-primary">
                                Student Pro
                            </h3>
                            <p className="text-muted-foreground">
                                Unlock your full potential.
                            </p>
                        </div>
                        <div className="flex items-baseline text-4xl font-serif font-bold mb-8 text-primary">
                            ETB 150
                            <span className="ml-2 text-lg font-sans font-normal text-muted-foreground">
                                / month
                            </span>
                        </div>
                        <ul className="space-y-4 flex-1 mb-8">
                            <li className="flex items-center text-sm font-medium">
                                <Check className="mr-3 h-5 w-5 text-primary" />
                                Everything in Basic
                            </li>
                            <li className="flex items-center text-sm font-medium">
                                <Check className="mr-3 h-5 w-5 text-primary" />
                                Unlimited AI Flashcards & Notes
                            </li>
                            <li className="flex items-center text-sm font-medium">
                                <Check className="mr-3 h-5 w-5 text-primary" />
                                Advanced Analytics Dashboard
                            </li>
                            <li className="flex items-center text-sm font-medium">
                                <Check className="mr-3 h-5 w-5 text-primary" />
                                Priority Support
                            </li>
                            <li className="flex items-center text-sm font-medium">
                                <Check className="mr-3 h-5 w-5 text-primary" />
                                Ad-free Experience
                            </li>
                        </ul>
                        <Link href="/register?plan=pro">
                            <Button className="w-full h-12 rounded-full text-base">
                                Upgrade Now
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto mb-32" data-aos="fade-up">
                    <h2 className="text-3xl font-serif font-medium text-center mb-12">
                        Compare Plans
                    </h2>
                    <div className="border rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-[300px] pl-6">
                                        Feature
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Student Basic
                                    </TableHead>
                                    <TableHead className="text-center font-bold text-primary">
                                        Student Pro
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium pl-6">
                                        Public Resources
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Check className="h-5 w-5 text-primary mx-auto" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Check className="h-5 w-5 text-primary mx-auto" />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium pl-6">
                                        Community Access
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Check className="h-5 w-5 text-primary mx-auto" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Check className="h-5 w-5 text-primary mx-auto" />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium pl-6">
                                        AI Flashcards
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        5 / month
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-primary">
                                        Unlimited
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium pl-6">
                                        AI Summaries
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        5 / month
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-primary">
                                        Unlimited
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium pl-6">
                                        Analytics
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        Basic
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-primary">
                                        Advanced
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium pl-6">
                                        Ad-free
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Check className="h-5 w-5 text-primary mx-auto" />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div
                    className="bg-[#0A251D] text-white rounded-3xl p-12 md:p-20 text-center max-w-5xl mx-auto"
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
                        "The Pro plan is worth every cent. The unlimited AI
                        summaries saved me hours of reading time during finals
                        week. My GPA has never been higher."
                    </blockquote>
                    <div className="flex flex-col items-center">
                        <div className="font-bold text-lg">Natnael Abebe</div>
                        <div className="text-white/70">
                            Software Engineering Student, AAU
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
