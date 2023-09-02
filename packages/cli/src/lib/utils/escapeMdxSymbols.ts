/**
 * Escape MDX symbols in text to prevent errors when compiling or rendering MDX
 * @param text 
 * @returns 
 */
export function escapeMdxSymbols(text: string) {
    const specialChars: Record<string, string> = {
        '\\': '\\\\',
        '`': '\\`',
        '*': '\\*',
        '_': '\\_',
        '{': '\\{',
        '}': '\\}',
        '[': '\\[',
        ']': '\\]',
        '(': '\\(',
        ')': '\\)',
        // '#': '\\#',
        // '+': '\\+',
        // '-': '\\-',
        // '.': '\\.',
        '!': '\\!',
    };

    const escapedText = [...text].map(c => specialChars[c] || c).join('');
    return escapedText;
}