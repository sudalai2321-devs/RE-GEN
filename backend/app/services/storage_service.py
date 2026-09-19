import os
import uuid
import hashlib
from pathlib import Path

class LocalStorageService:
    def __init__(self, base_path: str = "./uploads"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
    
    def save(self, content: bytes, original_filename: str) -> tuple[str, str]:
        ext = Path(original_filename).suffix
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = self.base_path / filename
        filepath.write_bytes(content)
        checksum = hashlib.md5(content).hexdigest()
        return str(filepath), checksum
    
    def get(self, path: str) -> bytes:
        return Path(path).read_bytes()
    
    def delete(self, path: str) -> None:
        p = Path(path)
        if p.exists():
            p.unlink()
