from groq import Groq
from .prompts import SYSTEM_PROMPT_FOR_OCR
from app import app


def img2txt(b64):
    client = Groq(api_key=app.config["GROQ_API_KEY"])
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_FOR_OCR},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "JUST PERFORM OCR, ****NOTHING MORE THAN OCR, ****STRICT OCR ONLY"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": b64,
                        },
                    },
                ],
            }
        ],
        model="meta-llama/llama-4-scout-17b-16e-instruct",
    )
    return (chat_completion.choices[0].message.content)
