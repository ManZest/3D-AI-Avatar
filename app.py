from flask import Flask, jsonify, request
from fastapi import FastAPI
from pydantic import BaseModel
from flask_cors import CORS
from transformers import pipeline
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmotionState:
    def __init__(self):
        self.valence = 0.0
        self.arousal = 0.5
        self.dominance = 0.5

    def update(self, stimulus):
        stimulus = stimulus.lower()
        if "excited" in stimulus or "energy" in stimulus:
            self.valence += 0.5
            self.arousal += 0.4
        elif "calm" in stimulus or "relax" in stimulus:
            self.valence += 0.1
            self.arousal -= 0.3

        elif "happy" in stimulus or "good" in stimulus:
            self.valence += 0.3

        elif "angry" in stimulus or "frustrated" in stimulus:
            self.valence -= 0.4
            self.arousal += 0.3
        
         # Clamp values
        self.valence = max(-1, min(1, self.valence))
        self.arousal = max(0, min(1, self.arousal))

    def to_emotion_label(self):
        if self.valence > 0.4 and self.arousal > 0.6:
            return "excited"
        elif self.valence > 0:
            return "happy"
        elif self.valence < -0.3:
            return "sad"
        return "neutral"

def call_llm(user_input: str, emotion_label: str):
    user_input = user_input.lower()

    # Emotion-driven decisions
    if emotion_label == "excited":
        return {
            "actions": [
                {"type": "animation", "value": "Run"},
                {"type": "color", "value": 16711680},
                {
                    "type": "speech",
                    "value": "Let's go! I'm full of energy!",
                    "emotion": "excited"
                }
            ]
        }

    elif emotion_label == "happy":
        return {
            "actions": [
                {"type": "animation", "value": "Walk"},
                {"type": "color", "value": 65280},
                {
                    "type": "speech",
                    "value": "That's awesome! I'm glad you're happy!",
                    "emotion": "happy"
                }
            ]
        }

    elif emotion_label == "sad":
        return {
            "actions": [
                {"type": "animation", "value": "Survey"},
                {"type": "color", "value": 255},
                {
                    "type": "speech",
                    "value": "Okay... let's slow things down.",
                    "emotion": "sad"
                }
            ]
        }

    # Default fallback
    return {
        "actions": [
            {"type": "animation", "value": "Survey"},
            {
                "type": "speech",
                "value": "I'm here.",
                "emotion": "neutral"
            }
        ]
    }
        
#Create one persistent emotion instance
emotion = EmotionState()
#Request schema
class Prompt(BaseModel):
    input: str

@app.post("/emotion")
async def process_emotion(prompt: Prompt):
    #1. Update emotion state
    emotion.update(prompt.input)
    #2. Convert to Label
    label = emotion.to_emotion_label()
    #3. Generate actions
    actions = call_llm(prompt.input, label)

    #Debug logs (Very Useful)
    print("Input:", prompt.input)
    print("Emotion:", label)
    print("Actions:", actions)
    return actions





