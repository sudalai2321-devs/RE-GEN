from app.ai.provider import LLMProvider
from typing import Type
from pydantic import BaseModel
import hashlib

class MockProvider(LLMProvider):
    async def generate(self, prompt: str, system: str, schema: Type[BaseModel]) -> BaseModel:
        # Generate rich realistic mock data based on the requested schema fields
        mock_data = {}
        for field_name, field_info in schema.model_fields.items():
            if field_info.annotation == str:
                mock_data[field_name] = f"Mock {field_name} text."
            elif field_info.annotation == int:
                mock_data[field_name] = 42
            elif field_info.annotation == float:
                mock_data[field_name] = 0.95
            elif field_info.annotation == list:
                mock_data[field_name] = []
            elif field_info.annotation == dict:
                mock_data[field_name] = {}
            else:
                mock_data[field_name] = None
        return schema(**mock_data)
        
    async def embed(self, text: str) -> list[float]:
        # Generate pseudo-random consistent embedding based on hash
        h = hashlib.md5(text.encode()).hexdigest()
        return [float(int(c, 16)) / 16.0 for c in h][:10] # Mock 10-dim embedding
