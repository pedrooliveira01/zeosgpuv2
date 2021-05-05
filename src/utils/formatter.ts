export interface Formatter {
	bold: (text: string) => string;
	escape: (text: string) => string;
	italic: (text: string) => string;
	monospace: (text: string) => string;
	monospaceBlock: (text: string, programmingLanguage?: string) => string;
	strikethrough: (text: string) => string;
	underline: (text: string) => string;
	url: (label: string, url: string) => string;
	userMention: (label: string, userId: number) => string;
}


function escapeInteral(text: string, escapeChars: string): string {
	return text.replace(new RegExp(`[${escapeChars}\\\\]`, 'g'), '\\$&')
}

function escape(text: string): string {
	return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&')
}

function bold(text: string): string {
	return `*${text}*`
}

function italic(text: string): string {
	return `_${text}_`
}

function strikethrough(text: string): string {
	return `~${text}~`
}

function underline(text: string): string {
	return `__${text}__`
}

function monospace(text: string): string {
	return '`' + escapeInteral(text, '`') + '`'
}

function monospaceBlock(text: string, programmingLanguage?: string): string {
	let result = ''
	result += '```'

	if (programmingLanguage) {
		result += programmingLanguage
	}

	result += '\n'
	result += escapeInteral(text, '`')
	result += '\n'
	result += '```'
	return result
}

function url(label: string, url: string): string {
	return `[${label}](${url})`
}

function userMention(label: string, userId: number): string {
	return url(label, `tg://user?id=${userId}`)
}

export const Format: Formatter = {	
	escape,
	bold,
	italic,
	strikethrough,
	underline,
	monospace,
	monospaceBlock,
	url,
	userMention
}