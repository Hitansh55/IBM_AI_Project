import os
import json
import asyncio
from groq import AsyncGroq

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable not set")
    return AsyncGroq(api_key=api_key)

async def generate_action_stream(text: str, action: str, query: str = ""):
    """
    Generator function to stream the AI response based on the chosen action.
    """
    if action == "summarize":
        prompt = f"Summarize the following text concisely. Provide a clear, structured summary using Markdown bullet points and headers:\n\n{text}"
    elif action == "explain":
        prompt = f"Explain the core concepts of the following text as if I am a complete beginner. Use simple analogies, plain language, and clear Markdown formatting:\n\n{text}"
    elif action == "quiz":
        prompt = f"Create a short multiple-choice quiz (3-5 questions) based on this text to test my knowledge. Provide the questions first, and then the answers at the very end in a Markdown section called 'Answers':\n\n{text}"
    elif action == "flashcards":
        prompt = f"Generate 5 flashcards based on the most important concepts in this text. Format them EXACTLY like this (do not add extra text):\n\n**Q:** (Question here)\n**A:** (Answer here)\n\n**Q:** (Question here)\n**A:** (Answer here)\n\nText:\n{text}"
    elif action == "chat":
        prompt = f"Based on the following text, answer the user's message clearly and concisely in Markdown.\n\nUser Message: {query}\n\nDocument Text:\n{text}"
    else:
        prompt = f"Analyze this text:\n{text}"

    client = get_groq_client()
    try:
        stream = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful study assistant. Keep formatting clean and use Markdown."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            stream=True,
        )
        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                text_chunk = json.dumps({"text": content})
                yield f"data: {text_chunk}\n\n"
                await asyncio.sleep(0.01) # Small delay to yield control to event loop
    except Exception as e:
        print(f"AI ERROR: {str(e)}", flush=True)
        error_chunk = json.dumps({"error": str(e)})
        yield f"data: {error_chunk}\n\n"
