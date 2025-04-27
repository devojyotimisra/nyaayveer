from groq import Groq
from .prompts import SYSTEM_PROMPT_FOR_MASKING
from app import app


def sem_sum(incident):
    client = Groq(api_key=app.config["GROQ_API_KEY"])
    completion = client.chat.completions.create(model="llama-3.3-70b-versatile",
                                                messages=[{"role": "system", "content": SYSTEM_PROMPT_FOR_MASKING},
                                                          {"role": "user", "content": incident}])
    return (completion.choices[0].message.content)
