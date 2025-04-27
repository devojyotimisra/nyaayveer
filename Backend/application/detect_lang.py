def detect_language(text):
    if not text:
        return "Empty Input"

    english_count = 0
    hindi_count = 0
    total_chars = 0

    for char in text:
        if char.isspace():
            continue

        total_chars += 1
        if ('a' <= char <= 'z') or ('A' <= char <= 'Z'):
            english_count += 1
        elif '\u0900' <= char <= '\u097F':
            hindi_count += 1

        if total_chars >= 100:
            break

    if total_chars == 0:
        return "No valid characters found"

    english_percent = (english_count / total_chars) * 100
    hindi_percent = (hindi_count / total_chars) * 100

    if english_percent > hindi_percent:
        return "English"
    elif hindi_percent > english_percent:
        return "Hindi"
    else:
        return "Equal percentage - Unknown"
