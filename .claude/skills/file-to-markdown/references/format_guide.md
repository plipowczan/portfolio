# Format-Specific Conversion Guide

This guide provides detailed information about converting specific file formats to markdown using markitdown.

## Table of Contents

- [PDF Documents](#pdf-documents)
- [Microsoft Office Documents](#microsoft-office-documents)
- [Images](#images)
- [Audio Files](#audio-files)
- [Web Content](#web-content)
- [Structured Data](#structured-data)
- [Archives](#archives)

## PDF Documents

### What Converts Well
- Text-based PDFs with standard fonts
- Documents with clear structure (headings, paragraphs)
- Simple tables
- Basic formatting (bold, italic)

### What May Have Issues
- Scanned PDFs (image-only)
- Complex multi-column layouts
- PDFs with heavy graphics
- Forms with fillable fields
- Password-protected PDFs

### Tips
- For scanned PDFs, consider converting to images first, then use OCR
- Multi-column layouts may convert with mixed text order
- Check output for proper heading hierarchy
- Tables may need manual adjustment

### Example
```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("report.pdf")

# Save with proper encoding
with open("report.md", "w", encoding="utf-8") as f:
    f.write(result.text_content)
```

## Microsoft Office Documents

### DOCX (Word Documents)

**What Converts Well:**
- Headings (H1-H6)
- Paragraphs and line breaks
- Bold, italic, underline
- Bulleted and numbered lists
- Simple tables
- Hyperlinks

**What May Have Issues:**
- Complex tables with merged cells
- Text boxes and shapes
- Headers and footers
- Page numbers
- Track changes and comments
- Custom styles

**Tips:**
- Use standard heading styles (Heading 1, 2, 3, etc.)
- Simplify tables before conversion
- Remove track changes before converting
- Check list formatting in output

### PPTX (PowerPoint Presentations)

**What Converts Well:**
- Slide titles
- Text content from text boxes
- Bulleted lists
- Basic formatting

**What May Have Issues:**
- Slide layouts and positioning
- Animations and transitions
- Embedded videos
- Complex graphics
- Speaker notes (may or may not be included)

**Tips:**
- Each slide typically becomes a section
- Review slide order in output
- Graphics may be lost or referenced
- Consider exporting notes separately

### XLSX (Excel Spreadsheets)

**What Converts Well:**
- Cell values
- Simple tables
- Sheet names as sections
- Basic formatting

**What May Have Issues:**
- Formulas (converted to values)
- Charts and graphs
- Conditional formatting
- Merged cells
- Multiple sheets (all converted together)

**Tips:**
- Each sheet becomes a separate section
- Formulas show as calculated values
- Charts are lost (only data remains)
- Consider converting sheets individually

## Images

### Supported Formats
- PNG, JPG, JPEG, GIF
- Requires vision/OCR capabilities

### Use Cases

**Text Extraction (OCR):**
- Screenshots with text
- Scanned documents
- Photos of documents
- Signs and labels

**Image Description:**
- Photos
- Diagrams
- Charts and graphs
- Illustrations

### Tips for Best Results

**For OCR:**
- High resolution images (300 DPI or higher)
- Clear, legible text
- Good contrast
- Minimal skew or rotation
- Standard fonts

**For Descriptions:**
- Clear, well-lit images
- Relevant subject matter
- Minimal clutter

### Example
```python
# OCR from screenshot
result = md.convert("screenshot.png")

# Image with description
result = md.convert("photo.jpg")
```

## Audio Files

### Supported Formats
- MP3, WAV, M4A
- Requires audio transcription capabilities

### What Works Well
- Clear speech
- Standard accents
- Minimal background noise
- Single speaker

### What May Have Issues
- Multiple speakers
- Heavy accents
- Background noise
- Music or sound effects
- Poor audio quality

### Tips
- Use high-quality recordings
- Minimize background noise
- Consider speaker identification needs
- Review transcription for accuracy
- Edit technical terms manually

### Example
```python
result = md.convert("meeting.mp3")
transcript = result.text_content
```

## Web Content

### HTML Files

**What Converts Well:**
- Headings (h1-h6)
- Paragraphs
- Lists (ul, ol)
- Links
- Simple tables
- Basic formatting (strong, em)

**What May Have Issues:**
- CSS styling
- JavaScript content
- Embedded media
- Complex layouts
- Forms

### MHTML Files

- Similar to HTML
- Includes embedded resources
- Better for archived web pages

### Tips
- Scripts and styles are stripped
- Dynamic content may be missing
- Check link validity
- Images may be lost or referenced

## Structured Data

### CSV Files

**Conversion:**
- Converts to markdown tables
- First row typically becomes header
- All rows become table rows

**Tips:**
- Ensure proper delimiter detection
- Check for escaped characters
- Verify column alignment
- Large tables may need formatting

**Example:**
```python
result = md.convert("data.csv")
# Output: markdown table
```

### JSON Files

**Conversion:**
- Structured as readable markdown
- Nested objects formatted hierarchically
- Arrays shown as lists

**Tips:**
- Complex nested structures may be verbose
- Consider pretty-printing first
- Large files may produce long output

### XML Files

**Conversion:**
- Tags converted to structure
- Attributes preserved
- Hierarchy maintained

**Tips:**
- Complex XML may be verbose
- Check namespace handling
- Validate structure in output

## Archives

### ZIP Files

**Behavior:**
- May extract and convert contents
- Each file converted separately
- Structure preserved in output

**Tips:**
- Be cautious with large archives
- May process many files
- Check individual file conversions
- Consider extracting manually first

## General Best Practices

### Before Conversion
1. Check file integrity
2. Remove passwords/protection
3. Simplify complex formatting
4. Back up original files

### During Conversion
1. Handle errors gracefully
2. Monitor resource usage
3. Test with sample files first
4. Use appropriate encoding (UTF-8)

### After Conversion
1. Review output for accuracy
2. Check formatting preservation
3. Verify links and references
4. Edit as needed for clarity

### Quality Checks
- Headings properly hierarchical
- Lists formatted correctly
- Tables aligned and readable
- Links functional
- Special characters preserved
- No missing content

## Troubleshooting Common Issues

### Garbled Text
- Check file encoding
- Verify font support
- Try different conversion settings

### Missing Content
- Check if content is embedded
- Verify file isn't corrupted
- Try converting sections separately

### Poor Formatting
- Simplify source formatting
- Use standard styles
- Post-process output

### Large File Issues
- Split into smaller files
- Increase memory allocation
- Process in batches



