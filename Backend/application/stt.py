from groq import Groq
from app import app


def transcribe(b64):
    client = Groq(api_key=app.config["GROQ_API_KEY"])

    transcription = client.audio.transcriptions.create(
        url=b64,
        model="whisper-large-v3",
        response_format="verbose_json",
        timestamp_granularities=["word", "segment"],
        temperature=0.0
    )
    return transcription.text
