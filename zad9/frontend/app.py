import gradio as gr
import requests

API_URL = "http://localhost:8000/chat"

def ask_gpt(user_input):
    try:
        response = requests.post(API_URL, json={"user_input": user_input})
        return response.json().get("response", "Internal server error")
    except Exception as e:
        return f"Error: {str(e)}"

iface = gr.Interface(
    fn=ask_gpt,
    inputs="text",
    outputs="text",
    title="ChatGPT Bot",
    description="Talk to bot using OpenAI GPT.",
)

iface.launch()
