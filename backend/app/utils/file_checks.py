import os

MAX_FILE_SIZE = 100 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt"}


def check_file_size(file):
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    return size <= MAX_FILE_SIZE


def check_file_extension(filename: str):
    _, ext = os.path.splitext(filename.lower())
    return ext in ALLOWED_EXTENSIONS


def check_quiz_extension(filename: str):
    _, ext = os.path.splitext(filename.lower())
    return ext == ".json"
