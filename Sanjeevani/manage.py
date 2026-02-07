#!/usr/bin/env python
import os
import sys

def main():
    """Run administrative tasks."""
    # This must match your inner folder name shown in the screenshot
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AyurRecSys.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()