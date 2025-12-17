# MarkItDown API Reference

## Installation

```bash
# Basic installation
pip install markitdown

# Full installation with all features (OCR, audio transcription, etc.)
pip install markitdown[all]
```

## Core API

### MarkItDown Class

The main class for converting files to markdown.

```python
from markitdown import MarkItDown

# Initialize converter
md = MarkItDown()
```

### convert() Method

Convert a file to markdown format.

```python
result = md.convert(file_path)
```

**Parameters:**
- `file_path` (str): Path to the file to convert

**Returns:**
- `ConversionResult` object with the following attributes:
  - `text_content` (str): The markdown text content
  - `title` (str, optional): Extracted document title
  - `metadata` (dict, optional): Additional metadata from the file

**Supported File Types:**
- Documents: `.pdf`, `.docx`, `.pptx`, `.xlsx`
- Web: `.html`, `.mhtml`
- Images: `.png`, `.jpg`, `.jpeg`, `.gif`
- Audio: `.mp3`, `.wav`, `.m4a`
- Data: `.csv`, `.json`, `.xml`
- Archives: `.zip`
- Text: `.txt`, `.md`

## Format-Specific Behavior

### PDF Files

- Extracts text content preserving structure
- Handles multi-page documents
- Preserves headings and formatting where possible
- May include embedded images as references

```python
result = md.convert("document.pdf")
markdown = result.text_content
```

### Office Documents (DOCX, PPTX, XLSX)

**DOCX:**
- Preserves headings, paragraphs, lists
- Converts tables to markdown tables
- Maintains text formatting (bold, italic)
- Extracts images

**PPTX:**
- Each slide becomes a section
- Preserves slide titles
- Extracts text from text boxes
- Notes and comments may be included

**XLSX:**
- Each sheet becomes a section
- Tables converted to markdown tables
- Preserves cell values
- Formulas shown as values

### Images

Requires vision/OCR capabilities:

```python
# Image with text (OCR)
result = md.convert("screenshot.png")

# Image description
result = md.convert("photo.jpg")
```

Features:
- OCR for text extraction
- Image description generation
- Alt text creation

### Audio Files

Requires audio transcription capabilities:

```python
result = md.convert("recording.mp3")
```

Features:
- Speech-to-text transcription
- Timestamp preservation
- Speaker identification (if available)

### Structured Data (CSV, JSON, XML)

**CSV:**
```python
result = md.convert("data.csv")
# Converts to markdown table
```

**JSON:**
```python
result = md.convert("data.json")
# Formats as structured markdown
```

**XML:**
```python
result = md.convert("data.xml")
# Converts to readable markdown structure
```

### HTML/MHTML

```python
result = md.convert("page.html")
```

Features:
- Converts HTML tags to markdown
- Preserves links and images
- Handles tables and lists
- Strips scripts and styles

## Advanced Usage

### Error Handling

```python
from markitdown import MarkItDown

md = MarkItDown()

try:
    result = md.convert("file.pdf")
    if result and result.text_content:
        print(result.text_content)
    else:
        print("No content extracted")
except FileNotFoundError:
    print("File not found")
except Exception as e:
    print(f"Conversion error: {e}")
```

### Batch Processing

```python
from pathlib import Path
from markitdown import MarkItDown

md = MarkItDown()

for file in Path("documents").glob("*.pdf"):
    try:
        result = md.convert(str(file))
        output = file.with_suffix('.md')
        output.write_text(result.text_content, encoding='utf-8')
    except Exception as e:
        print(f"Error converting {file}: {e}")
```

### Working with Result Metadata

```python
result = md.convert("document.docx")

# Access content
content = result.text_content

# Access metadata (if available)
if hasattr(result, 'title'):
    print(f"Title: {result.title}")

if hasattr(result, 'metadata'):
    print(f"Metadata: {result.metadata}")
```

## Configuration Options

The MarkItDown library may support configuration options depending on the version:

```python
# Example configuration (check library documentation for current options)
md = MarkItDown(
    # Configuration options here
)
```

## Performance Considerations

- **Large files**: May take longer to process
- **Images**: OCR processing is computationally intensive
- **Audio**: Transcription requires significant resources
- **PDFs**: Complex PDFs with many images may be slow

## Limitations

- Complex formatting may not be perfectly preserved
- Tables with merged cells may not convert accurately
- Some embedded objects may be lost
- Image quality affects OCR accuracy
- Audio quality affects transcription accuracy
- Very large files may cause memory issues

## Best Practices

1. **Test first**: Try conversion on sample files before batch processing
2. **Handle errors**: Always wrap conversion in try-except blocks
3. **Check output**: Verify converted content for accuracy
4. **Use appropriate formats**: Some formats preserve structure better than others
5. **Consider file size**: Break up very large files if possible
6. **Validate encoding**: Use UTF-8 encoding for output files

## Troubleshooting

### No content extracted
- File may be corrupted
- File format may not be supported
- File may be password-protected

### Poor OCR results
- Image quality too low
- Text too small or blurry
- Non-standard fonts

### Transcription errors
- Audio quality too low
- Background noise
- Accents or dialects

### Memory errors
- File too large
- Process batch files in smaller groups
- Increase available memory



