"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "@/app/types/user";

interface UserContextType {
    user: User | null;
}

const UserContext = createContext<UserContextType>({ user: null });

export function UserProvider({
    children,
    user,
}: {
    children: ReactNode;
    user: User | null;
}) {
    return (
        <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
