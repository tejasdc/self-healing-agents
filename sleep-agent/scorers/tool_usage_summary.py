"""ToolUsageSummary scorer for Braintrust online scoring.

Push with: braintrust push sleep-agent/scorers/tool_usage_summary.py

Note: This scorer runs per-span. It tags each tool span with its tool_name.
Cross-session aggregation is done by query_braintrust.py via BTQL, not here.
"""
from braintrust import Score


def ToolUsageSummary(output, metadata=None, **kwargs) -> Score:
    """Tag tool span with its tool name. Informational scorer (always 1.0).

    The real aggregation happens in query_braintrust.py via BTQL GROUP BY.
    This scorer ensures tool_name is available in scores metadata for querying.
    """
    tool_name = "unknown"
    if metadata and isinstance(metadata, dict):
        tool_name = metadata.get("tool_name", "unknown")

    return Score(
        name="ToolUsageSummary",
        score=1.0,
        metadata={"tool_name": tool_name}
    )
