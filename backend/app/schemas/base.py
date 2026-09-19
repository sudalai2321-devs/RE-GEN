from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BaseResponse(BaseModel):
    model_config = {'from_attributes': True}
