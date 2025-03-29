import Image from "next/image";

export default function BusinessLogo() {
    return (
        <Image
            src="/intermed-systems-logo.png"
            width={559}
            height={446}
            alt="Logo of Intermed Systems"
            className="business-logo"
        />
    );
}