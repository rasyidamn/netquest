import { type UseFormRegisterReturn } from "react-hook-form";
import FormError from "../FormError";

interface FormInputProps {
	label: string;
	type?: string;
	placeholder?: string;
	registration: UseFormRegisterReturn;
	error?: string;
}

export default function FormInput({
	label,
	type = "text",
	placeholder,
	registration,
	error,
}: FormInputProps) {
	return (
		<fieldset className="fieldset relative py-4">
			<legend className="fieldset-legend absolute -top-3 left-0">{label}</legend>
			<input
				type={type}
				placeholder={placeholder}
				className="input w-full"
				{...registration}
			/>
			<FormError formError={error} />
		</fieldset>
	);
}