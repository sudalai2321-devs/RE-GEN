from abc import ABC, abstractmethod
from typing import Type
from pydantic import BaseModel

class LLMProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, system: str, schema: Type[BaseModel]) -> BaseModel:
        pass
        
    @abstractmethod
    async def embed(self, text: str) -> list[float]:
        pass
