import Appointment from "@/app/components/appointment"
import { Suspense } from "react"

export default function Page() {
    return (
        <>
            <h1>Set An Appointment</h1>
            <p>Please Provide the following information about your appointment.</p>
            <Suspense>
                <Appointment />
            </Suspense>
        </>
    )
}