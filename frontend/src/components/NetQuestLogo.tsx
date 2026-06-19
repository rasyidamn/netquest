import Logo from "@/public/4.svg?react";
import ModuleDetailSVG from "@/public/programming-animate.svg?react";

export function NetQuestLogo({ className }: { className: string }) {
	return <Logo className={className} />;
}

export function ModuleDetailIllustration({ className }: { className: string }) {
	return <ModuleDetailSVG className={className} />;
}
