import LoginPage from "@/app/components/login";
import { Metadata } from "next";
import styles from '@/app/ui/login.module.css';
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Login | Intermed Systems',
    description: 'Login page for Intermed System',
};

export default function Page() {
    return (
        <main className="flex min-h-full bg-primary">
            <div>
                <h1 className="text-secondary text-center">Please Login</h1>
                <div className={styles.loginForm}>
                    <Suspense>
                        <LoginPage />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
