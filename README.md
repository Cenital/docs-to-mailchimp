# Google Docs to Mailchimp Formatter

This tool enables pasting content from Google Docs and cleaning formatting issues before using it in Mailchimp (Legacy Builder).

## Use Case

When creating email campaigns in Mailchimp, content creators often write their copy in Google Docs for collaboration and review. However, when copying content from Google Docs and pasting it into Mailchimp Legacy Builder, formatting often breaks - for example, everything turns bold or unwanted styling appears. This happens because Google Docs adds numerous inline styles, wrapper elements, and proprietary markup that conflicts with Mailchimp's formatting.

This tool solves this problem by stripping away all the problematic Google Docs formatting while carefully preserving the intended formatting like bold text, italics, lists, and links. It acts as a "formatting sanitizer" between Google Docs and Mailchimp, ensuring clean, predictable HTML that works correctly in email campaigns.

## Problem Solved

- **Rogue formatting**: Google Docs adds inline styles and wrapper elements that cause visual inconsistencies in Mailchimp
- **Unwanted bold/italic**: Styling applied by Google Docs spans that should be plain text
- **Broken layouts**: Nested elements and proprietary IDs that interfere with Mailchimp's rendering
- **Extra spacing**: Empty line breaks and paragraphs that create unwanted whitespace in emails

## Features

- ✨ Clean rogue formatting from Google Docs
- 📋 Preserve intended formatting (bold, italic, underline, lists, links)
- 🧹 Optional removal of empty lines between paragraphs
- 📑 No database or persistence required
- 🚀 Simple one-page application
- 📱 Responsive design
- ⌨️ Keyboard shortcut support (Ctrl+Enter to clean)
- 📋 One-click copy to clipboard
- 🌐 Spanish (Argentina) interface

## How to Use

1. Open `index.html` in your web browser
2. Copy content from your Google Docs document (Ctrl+C or Cmd+C)
3. Paste it into the "Pegá desde Google Docs" input area
4. (Optional) Toggle the "Eliminar líneas vacías entre párrafos" checkbox if you want to remove extra line breaks
5. Click "Limpiar Formato →" button (or press Ctrl+Enter)
6. Review the cleaned content in the "Resultado Limpio" output area
7. Click "Copiar al Portapapeles" to copy the cleaned content
8. Paste into Mailchimp Legacy Builder and enjoy clean, predictable formatting!

## Technical Details

The tool removes:
- Google Docs-specific markup and IDs
- Inline styles that cause formatting issues
- Unnecessary span tags and wrappers
- Empty elements
- Optional: `<br>` tags between `<p>` elements (when toggle is enabled)

The tool preserves:
- Bold text (`<strong>`)
- Italic text (`<em>`)
- Underlined text (`<u>`)
- Links (`<a>`)
- Bulleted lists (`<ul>`, `<li>`)
- Numbered lists (`<ol>`, `<li>`)
- Paragraphs (`<p>`)
- Headlines (`<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`)
- Line breaks (`<br>`) within paragraphs

## No Installation Required

Simply open the `index.html` file in any modern web browser. No server, database, or backend required.

## Browser Compatibility

Works with modern browsers that support:
- Clipboard API (for copying formatted content)
- ContentEditable
- ES6 JavaScript

## License

MIT License - See LICENSE file for details
