from app.ai.provider import LLMProvider
from typing import Type
from pydantic import BaseModel
import openai
from app.config import settings

class OpenAIProvider(LLMProvider):
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
    async def generate(self, prompt: str, system: str, schema: Type[BaseModel]) -> BaseModel:
        # Full integration to structured outputs
        response = await self.client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
            response_format=schema
        )
        return response.choices[0].message.parsed
        
    async def embed(self, text: str) -> list[float]:
        response = await self.client.embeddings.create(input=[text], model="text-embedding-3-small")
        return response.data[0].embedding
