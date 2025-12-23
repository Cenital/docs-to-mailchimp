# Google Docs to Mailchimp Formatter

This tool enables pasting content from Google Docs and cleaning formatting issues before using it in Mailchimp (Legacy Builder).

## Problem Solved

When copying content from Google Docs and pasting it into Mailchimp Legacy Builder, formatting often breaks - for example, everything turns bold or unwanted styling appears. This tool cleans the rogue formatting while preserving your intended formatting like bold text, italics, lists, and links.

## Features

- ✨ Clean rogue formatting from Google Docs
- 📋 Preserve intended formatting (bold, italic, underline, lists, links)
- 📑 No database or persistence required
- 🚀 Simple one-page application
- 📱 Responsive design
- ⌨️ Keyboard shortcut support (Ctrl+Enter to clean)
- 📋 One-click copy to clipboard

## How to Use

1. Open `index.html` in your web browser
2. Copy content from your Google Docs document
3. Paste it into the "Paste from Google Docs" area
4. Click "Clean Formatting →" button
5. Review the cleaned content in the "Cleaned Result" area
6. Click "Copy to Clipboard" to copy the cleaned content
7. Paste into Mailchimp Legacy Builder

## Technical Details

The tool removes:
- Google Docs-specific markup and IDs
- Inline styles that cause formatting issues
- Unnecessary span tags and wrappers
- Empty elements

The tool preserves:
- Bold text (`<strong>`)
- Italic text (`<em>`)
- Underlined text (`<u>`)
- Links (`<a>`)
- Bulleted lists (`<ul>`, `<li>`)
- Numbered lists (`<ol>`, `<li>`)
- Paragraphs (`<p>`)
- Line breaks (`<br>`)

## No Installation Required

Simply open the `index.html` file in any modern web browser. No server, database, or backend required.

## Browser Compatibility

Works with modern browsers that support:
- Clipboard API (for copying formatted content)
- ContentEditable
- ES6 JavaScript

## License

MIT License - See LICENSE file for details
