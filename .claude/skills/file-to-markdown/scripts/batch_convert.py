#!/usr/bin/env python3
"""
Batch convert multiple files to markdown using markitdown library

Usage:
    python batch_convert.py <input_directory> [output_directory] [--pattern PATTERN]

Examples:
    python batch_convert.py ./documents
    python batch_convert.py ./documents ./output
    python batch_convert.py ./documents ./output --pattern "*.pdf"
    python batch_convert.py ./documents ./output --pattern "*.{pdf,docx}"
"""

import sys
from pathlib import Path
from typing import List
import argparse

try:
    from markitdown import MarkItDown
except ImportError:
    print("Error: markitdown library not installed")
    print("Install with: pip install markitdown")
    print("For full features: pip install markitdown[all]")
    sys.exit(1)


def find_files(directory: Path, pattern: str = "*.*") -> List[Path]:
    """
    Find all files matching the pattern in the directory.
    
    Args:
        directory: Directory to search
        pattern: Glob pattern for file matching
        
    Returns:
        List of matching file paths
    """
    files = []
    
    # Handle multiple patterns like "*.{pdf,docx}"
    if "{" in pattern and "}" in pattern:
        # Extract extensions from pattern like "*.{pdf,docx}"
        # Split carefully to preserve the base pattern including the dot
        before_brace = pattern.split("{")[0]  # e.g., "*."
        extensions_part = pattern.split("{")[1].split("}")[0]  # e.g., "pdf,docx"
        extensions = extensions_part.split(",")
        
        # Check if base already ends with wildcard pattern separator
        for ext in extensions:
            files.extend(directory.glob(f"{before_brace}{ext}"))
    else:
        files.extend(directory.glob(pattern))
    
    # Filter out markdown files to avoid converting them
    files = [f for f in files if f.suffix.lower() != '.md']
    
    return sorted(files)


def batch_convert(input_dir: str, output_dir: str = None, pattern: str = "*.*") -> None:
    """
    Convert all matching files in a directory to markdown.
    
    Args:
        input_dir: Input directory path
        output_dir: Output directory path (defaults to input_dir)
        pattern: Glob pattern for file matching
    """
    input_path = Path(input_dir)
    
    if not input_path.exists():
        raise FileNotFoundError(f"Input directory not found: {input_dir}")
    
    if not input_path.is_dir():
        raise ValueError(f"Input path is not a directory: {input_dir}")
    
    # Determine output directory
    if output_dir is None:
        output_path = input_path
    else:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
    
    # Find files to convert
    files = find_files(input_path, pattern)
    
    if not files:
        print(f"No files found matching pattern '{pattern}' in {input_dir}")
        return
    
    print(f"Found {len(files)} file(s) to convert")
    print(f"Output directory: {output_path}")
    print()
    
    # Initialize converter
    md = MarkItDown()
    
    # Convert each file
    success_count = 0
    error_count = 0
    
    for i, file_path in enumerate(files, 1):
        try:
            print(f"[{i}/{len(files)}] Converting {file_path.name}...", end=" ")
            
            result = md.convert(str(file_path))
            
            if not result or not result.text_content:
                print("[X] No content extracted")
                error_count += 1
                continue

            # Create output file path
            output_file = output_path / f"{file_path.stem}.md"

            # Save markdown content
            output_file.write_text(result.text_content, encoding='utf-8')

            print("[OK] Success")
            success_count += 1

        except Exception as e:
            print(f"[X] Error: {e}")
            error_count += 1
    
    # Print summary
    print()
    print("=" * 50)
    print(f"Conversion complete!")
    print(f"  Successful: {success_count}")
    print(f"  Failed: {error_count}")
    print(f"  Total: {len(files)}")
    print("=" * 50)


def main():
    parser = argparse.ArgumentParser(
        description="Batch convert files to markdown using markitdown",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python batch_convert.py ./documents
  python batch_convert.py ./documents ./output
  python batch_convert.py ./documents ./output --pattern "*.pdf"
  python batch_convert.py ./documents ./output --pattern "*.{pdf,docx}"
        """
    )
    
    parser.add_argument("input_dir", help="Input directory containing files to convert")
    parser.add_argument("output_dir", nargs="?", default=None, 
                       help="Output directory for markdown files (default: same as input)")
    parser.add_argument("--pattern", default="*.*", 
                       help="Glob pattern for file matching (default: *.*)")
    
    args = parser.parse_args()
    
    try:
        batch_convert(args.input_dir, args.output_dir, args.pattern)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()



