#!/usr/bin/env python3
"""
QUICK START - InnovateX Python Backend

Run this script to see all available API examples and testing commands.
"""

import subprocess
import sys
from api_payloads import TESTING_GUIDE

def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*80)
    print(f" {title}")
    print("="*80)

def main():
    print_header("InnovateX Python Backend - Quick Start Guide")
    
    print(TESTING_GUIDE)
    
    print_header("Running the Server")
    print("""
To start the Python FastAPI server, run:

  cd /home/misty/Desktop/food/bubtHackathon/backend-py
  python main.py

Or if you want to run this exact command, press 'y' below.
""")
    
    try:
        response = input("Start the server now? (y/n): ").lower().strip()
        if response == 'y':
            print("\nStarting server...\n")
            subprocess.run([sys.executable, "main.py"])
    except KeyboardInterrupt:
        print("\nGoodbye!")
        sys.exit(0)

if __name__ == "__main__":
    main()
