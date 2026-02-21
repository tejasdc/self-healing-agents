"""FrustrationDetector scorer — LLMClassifier REFERENCE ONLY.

DO NOT push this file with braintrust push — it is not a valid scorer function.
This scorer must be configured in the Braintrust UI as an LLMClassifier.

Setup: Project > Configuration > Create scoring rule > LLMClassifier
Model: gemini-2.5-flash (via Braintrust AI proxy)
Scope: Turn spans (type: task, has input = user prompt)
"""

PROMPT = """Rate the user's frustration level in this message. Consider:
- Corrections ("no, I said...", "that's wrong", "I already told you")
- Negations ("don't do that", "stop", "never")
- Exasperation ("again?", "why do you keep...", "I've said this before")
- Direct frustration ("this is frustrating", "you're not listening")

Message: {{input}}

Choose the most appropriate frustration level:"""

CHOICES = {
    "A": {"label": "No frustration", "score": 0.0},
    "B": {"label": "Mild correction", "score": 0.3},
    "C": {"label": "Clear frustration", "score": 0.7},
    "D": {"label": "Strong frustration", "score": 1.0},
}
