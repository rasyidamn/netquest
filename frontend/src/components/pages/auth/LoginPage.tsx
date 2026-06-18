import LoginForm from "../../form/LoginForm";
import FocusIllustration from "@/public/undraw_focused_m9bj.svg?react";

export default function LoginPage() {
	return (
		<div className="card card-side min-w-4xl bg-base-100 shadow-sm rounded-l-full">
			<figure className="card-body  flex-1 flex justify-center">
				<FocusIllustration className="w-60 h-fit my-10" />
			</figure>
			<div className="card-body w-xl flex-1 flex justify-center">
				<div>
					<h2 className="text-3xl font-bold">Selamat Datang!</h2>
					<p className="text-base-content/60 mt-1">
						Silakan masuk untuk melanjutkan
					</p>
				</div>

				<LoginForm />
			</div>
		</div>
	);
}
