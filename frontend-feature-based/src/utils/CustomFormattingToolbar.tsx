import {
	BasicTextStyleButton,
	BlockTypeSelect,
	ColorStyleButton,
	CreateLinkButton,
	FileCaptionButton,
	FileReplaceButton,
	FormattingToolbar,
	NestBlockButton,
	TextAlignButton,
	UnnestBlockButton,
} from "@blocknote/react";

export const CustomFormattingToolbar = () => (
	<FormattingToolbar>
		<BlockTypeSelect key={"blockTypeSelect"} />

		<FileCaptionButton key={"fileCaptionButton"} />
		<FileReplaceButton key={"replaceFileButton"} />

		<BasicTextStyleButton basicTextStyle={"bold"} key={"boldStyleButton"} />
		<BasicTextStyleButton
			basicTextStyle={"italic"}
			key={"italicStyleButton"}
		/>
		<BasicTextStyleButton
			basicTextStyle={"underline"}
			key={"underlineStyleButton"}
		/>
		<BasicTextStyleButton
			basicTextStyle={"strike"}
			key={"strikeStyleButton"}
		/>
		<BasicTextStyleButton basicTextStyle={"code"} key={"codeStyleButton"} />

		{/* Tombol alignment lengkap, termasuk justify */}
		<TextAlignButton textAlignment={"left"} key={"textAlignLeftButton"} />
		<TextAlignButton
			textAlignment={"center"}
			key={"textAlignCenterButton"}
		/>
		<TextAlignButton textAlignment={"right"} key={"textAlignRightButton"} />
		<TextAlignButton
			textAlignment={"justify"}
			key={"textAlignJustifyButton"}
		/>

		<ColorStyleButton key={"colorStyleButton"} />
		<NestBlockButton key={"nestBlockButton"} />
		<UnnestBlockButton key={"unnestBlockButton"} />
		<CreateLinkButton key={"createLinkButton"} />
	</FormattingToolbar>
);
