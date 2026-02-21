"""Snapshot current .claude/ artifacts for sleep agent analysis."""

import json, os, glob, sys

CLAUDE_DIR = os.path.expanduser("~/.claude")


def read_json_safe(path):
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def collect_hooks():
    """Extract hooks from settings.json."""
    settings = read_json_safe(os.path.join(CLAUDE_DIR, "settings.json"))
    if not settings:
        return []
    hooks = settings.get("hooks", {})
    result = []
    for event_type, hook_list in hooks.items():
        if isinstance(hook_list, list):
            for hook in hook_list:
                result.append({
                    "event": event_type,
                    "type": hook.get("type", "unknown"),
                    "command": hook.get("command", ""),
                    "matcher": hook.get("matcher", ""),
                })
        elif isinstance(hook_list, dict):
            result.append({
                "event": event_type,
                "type": hook_list.get("type", "unknown"),
                "command": hook_list.get("command", ""),
                "matcher": hook_list.get("matcher", ""),
            })
    return result


def collect_skills():
    """Find all SKILL.md files under .claude/."""
    skills = []
    for skill_file in glob.glob(os.path.join(CLAUDE_DIR, "**/SKILL.md"), recursive=True):
        try:
            with open(skill_file) as f:
                content = f.read(500)
            skills.append({
                "path": skill_file,
                "preview": content,
            })
        except OSError:
            skills.append({"path": skill_file, "preview": "[unreadable]"})
    return skills


def collect_memory():
    """List memory entries from project memory directories."""
    entries = []
    for memory_dir in glob.glob(os.path.join(CLAUDE_DIR, "projects/*/memory")):
        for entry in glob.glob(os.path.join(memory_dir, "*.md")):
            try:
                with open(entry) as f:
                    content = f.read(300)
                entries.append({
                    "path": entry,
                    "preview": content,
                })
            except OSError:
                entries.append({"path": entry, "preview": "[unreadable]"})
    global_memory = os.path.join(CLAUDE_DIR, "MEMORY.md")
    if os.path.exists(global_memory):
        try:
            with open(global_memory) as f:
                entries.append({"path": global_memory, "preview": f.read(500)})
        except OSError:
            pass
    return entries


def collect_claude_md():
    """Find all CLAUDE.md files."""
    files = []
    for md_file in glob.glob(os.path.join(CLAUDE_DIR, "**/CLAUDE.md"), recursive=True):
        try:
            size = os.path.getsize(md_file)
            with open(md_file) as f:
                lines = f.readlines()
            files.append({
                "path": md_file,
                "size_bytes": size,
                "line_count": len(lines),
            })
        except OSError:
            files.append({"path": md_file, "size_bytes": 0, "line_count": 0})
    cwd_claude = os.path.join(os.getcwd(), "CLAUDE.md")
    if os.path.exists(cwd_claude):
        try:
            size = os.path.getsize(cwd_claude)
            with open(cwd_claude) as f:
                lines = f.readlines()
            files.append({"path": cwd_claude, "size_bytes": size, "line_count": len(lines)})
        except OSError:
            pass
    return files


def main():
    snapshot = {
        "hooks": collect_hooks(),
        "skills": collect_skills(),
        "memory": collect_memory(),
        "claude_md_files": collect_claude_md(),
        "claude_dir": CLAUDE_DIR,
    }
    json.dump(snapshot, sys.stdout, indent=2)


if __name__ == "__main__":
    main()
