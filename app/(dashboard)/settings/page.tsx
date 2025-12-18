import React from "react";
import SettingsLayout from "@/components/settings/SettingsLayout";
import AccountSection from "@/components/settings/AccountSection";
import SecuritySection from "@/components/settings/SecuritySection";
import PrivacySection from "@/components/settings/PrivacySection";
import NotificationsSection from "@/components/settings/NotificationsSection";
import ApiSection from "@/components/settings/ApiSection";
import BillingSection from "@/components/settings/BillingSection";

export default function SettingsPage() {
    return (
        <SettingsLayout active="general">
            <div className="space-y-8">
                <section id="general">
                    <h1 className="text-3xl font-bold">Settings & Privacy</h1>
                    <p className="text-muted-foreground">
                        Manage your account, privacy, and AI settings.
                    </p>
                </section>

                <AccountSection />
                <SecuritySection />
                <PrivacySection />
                <NotificationsSection />
                <ApiSection />
                <BillingSection />
            </div>
        </SettingsLayout>
    );
}
