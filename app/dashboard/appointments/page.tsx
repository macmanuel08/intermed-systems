import Appointment from "@/app/components/appointment"
import { Suspense } from "react"

export default function Page() {
    return (
        <Suspense>
            <Appointment />
        </Suspense>
    )
}