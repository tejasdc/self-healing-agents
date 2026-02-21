"""ToolUsageSummary scorer for Braintrust online scoring.

Push with: cd scorers && braintrust push tool_usage_summary.py
"""
import braintrust
from pydantic import BaseModel
from typing import Optional

project = braintrust.projects.create(name="self-healing-sleep")


class ToolUsageSummaryParams(BaseModel):
    metadata: Optional[dict] = None


def tool_usage_summary_handler(metadata: Optional[dict] = None):
    """Tag tool span with its tool name. Informational scorer (always 1.0).

    The real aggregation happens via BTQL GROUP BY in query_braintrust.py.
    """
    tool_name = "unknown"
    if metadata and isinstance(metadata, dict):
        tool_name = metadata.get("tool_name", "unknown")

    return {"score": 1.0, "metadata": {"tool_name": tool_name}}


project.scorers.create(
    name="ToolUsageSummary",
    slug="tool-usage-summary",
    description="Tag each tool span with its tool name for BTQL aggregation.",
    parameters=ToolUsageSummaryParams,
    handler=tool_usage_summary_handler,
)
