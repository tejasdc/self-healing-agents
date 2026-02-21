"""TokenEfficiency scorer for Braintrust online scoring.

Push with: braintrust push sleep-agent/scorers/token_efficiency.py
"""
from braintrust import Score


def TokenEfficiency(output, metadata=None, metrics=None, **kwargs) -> Score:
    """Score a trace based on total token usage.

    Sessions under 50k tokens score 1.0, decreasing linearly above.
    """
    total_tokens = 0
    if metrics and isinstance(metrics, dict):
        total_tokens = metrics.get("tokens", 0)

    if total_tokens <= 0:
        return Score(name="TokenEfficiency", score=1.0, metadata={"total_tokens": 0, "note": "no token data"})

    score = min(1.0, 50000 / total_tokens)
    return Score(
        name="TokenEfficiency",
        score=round(score, 4),
        metadata={"total_tokens": total_tokens}
    )
