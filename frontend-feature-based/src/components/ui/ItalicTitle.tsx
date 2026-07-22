/**
 * ItalicTitle — Komponen untuk merender judul yang mengandung penanda miring.
 *
 * Cara pakai: Tambahkan tanda bintang (*) di sekitar kata bahasa Inggris
 * saat mengedit judul di panel admin.
 *
 * Contoh input : "Pengantar *Network* dan *Router*"
 * Contoh output: Pengantar <em>Network</em> dan <em>Router</em>
 */

import type { ElementType } from "react";

interface ItalicTitleProps {
	text: string;
	className?: string;
	as?: ElementType;
}

export function ItalicTitle({ text, className, as: Tag = "span" }: ItalicTitleProps) {
	// Regex: pecah teks berdasarkan pola *kata*
	const parts = text.split(/(\*[^*]+\*)/g);

	const content = parts.map((part, i) => {
		if (part.startsWith("*") && part.endsWith("*")) {
			// Hilangkan tanda bintang, render sebagai italic
			return <em key={i}>{part.slice(1, -1)}</em>;
		}
		return <span key={i}>{part}</span>;
	});

	return <Tag className={className}>{content}</Tag>;
}
