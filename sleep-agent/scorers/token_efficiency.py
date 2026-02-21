"""TokenEfficiency scorer for Braintrust online scoring.

Push with: cd scorers && braintrust push token_efficiency.py
"""
import braintrust
from pydantic import BaseModel
from typing import Optional

project = braintrust.projects.create(name="self-healing-sleep")


class TokenEfficiencyParams(BaseModel):
    metrics: Optional[dict] = None


def token_efficiency_handler(metrics: Optional[dict] = None):
    """Score a trace based on total token usage.

    Sessions under 50k tokens score 1.0, decreasing linearly above.
    """
    total_tokens = 0
    if metrics and isinstance(metrics, dict):
        total_tokens = metrics.get("tokens", 0)

    if total_tokens <= 0:
        return {"score": 1.0, "metadata": {"total_tokens": 0, "note": "no token data"}}

    score = min(1.0, 50000 / total_tokens)
    return {"score": round(score, 4), "metadata": {"total_tokens": total_tokens}}


project.scorers.create(
    name="TokenEfficiency",
    slug="token-efficiency",
    description="Score traces by token efficiency. Under 50k tokens = 1.0, linear decrease above.",
    parameters=TokenEfficiencyParams,
    handler=token_efficiency_handler,
)
