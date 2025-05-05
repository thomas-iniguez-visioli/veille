#!/usr/bin/env python3
"""
Script to detect and replace date patterns in CVE IDs.
Replaces years (e.g., 2018) with [[year]] in CVE ID strings.
"""

import os
import re
import glob

def replace_cve_dates(file_path):
    """Replace date patterns in CVE IDs within a file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Pattern to match "CVE ID : CVE-YYYY-" or similar patterns
    pattern = r'(CVE ID\s*:\s*CVE-)(20\d{2})(-)'
    
    # Replace the year part with [[year]] while capturing the actual year
    modified_content = re.sub(pattern, lambda m: f'{m.group(1)}[[{m.group(2)}]]{m.group(3)}', content)
    
    if content != modified_content:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(modified_content)
        print(f"Updated: {file_path}")
    else:
        print(f"No changes needed: {file_path}")

def main():
    # Get all markdown files in the CVE directory and subdirectories
    cve_files = glob.glob('source/CVE/**/*.md', recursive=True)
    
    for file_path in cve_files:
        replace_cve_dates(file_path)
    
    print(f"Processed {len(cve_files)} files")

if __name__ == "__main__":
    main()