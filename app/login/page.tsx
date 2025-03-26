import LoginPage from "@/app/components/login";
import { Metadata } from "next";
import { Suspense } from "react";
import styles from '@/app/ui/login.module.css'

export const metadata: Metadata = {
    title: 'Login | Intermed Systems',
    description: 'Login page for Intermed System'
};

export default function Login() {
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
    )
}