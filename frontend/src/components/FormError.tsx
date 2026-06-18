export default function FormError({ formError }: { formError: string | undefined}) {
   return (
	<span className="absolute bottom-0 left-1 text-[10px] text-error">
		{formError || "\u00A0"}
	</span>
   )
}
