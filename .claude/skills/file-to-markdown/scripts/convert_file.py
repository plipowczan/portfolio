#!/usr/bin/env python3
"""
Convert any file to markdown using markitdown library

Usage:
    python convert_file.py <input_file> [output_file]

Examples:
    python convert_file.py document.pdf
    python convert_file.py document.pdf output.md
    python convert_file.py presentation.pptx slides.md
    python convert_file.py image.jpg image_text.md
"""

import sys
from pathlib import Path

try:
    from markitdown import MarkItDown
except ImportError:
    print("Error: markitdown library not installed")
    print("Install with: pip install markitdown")
    print("For full features: pip install markitdown[all]")
    sys.exit(1)


def convert_file_to_markdown(input_file: str, output_file: str = None) -> str:
    """
    Convert a file to markdown format.
    
    Args:
        input_file: Path to the input file
        output_file: Optional path to save the markdown output
        
    Returns:
        The markdown content as a string
    """
    input_path = Path(input_file)
    
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_file}")
    
    # Initialize converter
    md = MarkItDown()
    
    # Convert the file
    print(f"Converting {input_path.name}...")
    result = md.convert(str(input_path))
    
    if not result or not result.text_content:
        raise ValueError(f"No content could be extracted from {input_file}")
    
    markdown_content = result.text_content
    
    # Determine output file
    if output_file is None:
        output_file = input_path.with_suffix('.md')
    
    output_path = Path(output_file)
    
    # Create parent directories if they don't exist
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Save to file
    output_path.write_text(markdown_content, encoding='utf-8')
    print(f"[OK] Converted successfully to: {output_path}")

    return markdown_content


def main():
    if len(sys.argv) < 2:
        print("Usage: python convert_file.py <input_file> [output_file]")
        print("\nExamples:")
        print("  python convert_file.py document.pdf")
        print("  python convert_file.py document.pdf output.md")
        print("  python convert_file.py presentation.pptx slides.md")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        convert_file_to_markdown(input_file, output_file)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()



