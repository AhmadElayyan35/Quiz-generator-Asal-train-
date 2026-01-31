from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1] / "azure"


def load_file(directory_name: str, file_name: str):
    path = BASE_DIR / directory_name / file_name
    if not path.is_file():
        raise RuntimeError(f"File not found: {path}")
    return path
