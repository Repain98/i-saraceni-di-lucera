export function isPlaceholder(value?: string) {
	return (
		!value ||
		value.includes("[DA COMPILARE]") ||
		value.includes("[DA CONFERMARE]")
	);
}

export function isWebUrl(value?: string) {
	return Boolean(value && !isPlaceholder(value) && /^https?:\/\//i.test(value));
}

export function whatsappUrl(value?: string) {
	if (isPlaceholder(value)) return undefined;
	const numero = value.replace(/\D/g, "");
	return numero ? `https://wa.me/${numero}` : undefined;
}

export function phoneUrl(value?: string) {
	if (isPlaceholder(value)) return undefined;
	const prefisso = value.trim().startsWith("+") ? "+" : "";
	const numero = value.replace(/\D/g, "");
	return numero ? `tel:${prefisso}${numero}` : undefined;
}

export function trainingDetails(orario?: string, luogo?: string) {
	return [orario, luogo]
		.filter((valore): valore is string => Boolean(valore?.trim()))
		.join(" · ");
}
