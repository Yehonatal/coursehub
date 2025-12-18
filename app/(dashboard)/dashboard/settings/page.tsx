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
        <SettingsLayout>
            <AccountSection />
            <SecuritySection />
            <PrivacySection />
            <NotificationsSection />
            <ApiSection />
            <BillingSection />
        </SettingsLayout>
    );
}
