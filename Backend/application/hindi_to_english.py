from groq import Groq
from .prompts import SYSTEM_PROMPT_FOR_TRANSLATION
from app import app


def hin2eng(hindi_text):
    client = Groq(api_key=app.config["GROQ_API_KEY"])
    completion = client.chat.completions.create(model="llama-3.3-70b-versatile",
                                                messages=[{"role": "system", "content": SYSTEM_PROMPT_FOR_TRANSLATION},
                                                          {"role": "user", "content": hindi_text}])
    return (completion.choices[0].message.content)
