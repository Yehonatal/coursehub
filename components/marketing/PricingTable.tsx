import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

export function PricingTable() {
    return (
        <div className="max-w-5xl mx-auto mb-32" data-aos="fade-up">
            <h2 className="text-3xl font-serif font-medium text-center mb-12">
                Compare Plans
            </h2>
            <div className="border md:rounded-xl overflow-hidden">
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
    );
}
