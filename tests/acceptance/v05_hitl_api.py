#!/usr/bin/env python3
import json
import os

import httpx

BASE = os.getenv("FORGE_API_URL", "http://127.0.0.1:8000")
EMAIL = os.getenv("FORGE_BOOTSTRAP_ADMIN_EMAIL", "hitl@forge.local")
PASSWORD = os.environ["HITL_TEST_PASSWORD"]
EVIDENCE = os.getenv("HITL_EVIDENCE_DIR", "/tmp")


def dump(name: str, value) -> None:
    with open(os.path.join(EVIDENCE, name), "w", encoding="utf-8") as f:
        json.dump(value, f, indent=2)


def client() -> httpx.Client:
    c = httpx.Client(base_url=BASE, timeout=30)
    r = c.post("/v1/auth/login", json={"email": EMAIL, "password": PASSWORD})
    r.raise_for_status()
    c.headers["Authorization"] = f"Bearer {r.json()['access_token']}"
    return c


def main() -> None:
    c = client()
    p = c.post("/v1/projects", json={"name": "v0.5 HITL Acceptance Project"})
    assert p.status_code == 201, p.text
    pid = p.json()["id"]

    executable = {
        "id": "v05_hitl",
        "version": 1,
        "state": {"messages": {"type": "list[message]", "reducer": "add_messages"}},
        "entry_node": "approval",
        "nodes": [
            {
                "id": "approval",
                "type": "human_input",
                "config": {
                    "prompt": "Approve v0.5 controlled action?",
                    "allowed_decisions": ["approve", "reject"],
                },
            },
            {"id": "end", "type": "end", "config": {}},
        ],
        "edges": [{"source": "approval", "target": "end"}],
    }
    w = c.post(
        f"/v1/projects/{pid}/workflows",
        json={"name": "v0.5 HITL Gate", "description": "Runtime approval acceptance", "executable": executable},
    )
    assert w.status_code == 201, w.text
    wid = w.json()["id"]
    u = c.patch(f"/v1/projects/{pid}", json={"config": {"api_workflow_id": wid, "default_model": "fake:echo"}})
    assert u.status_code == 200, u.text

    def start(label: str):
        r = c.post(
            f"/v1/projects/{pid}/run",
            json={"input": {"messages": [{"role": "user", "content": label}]}, "stream": False},
        )
        assert r.status_code == 200, r.text
        out = r.json()
        assert out.get("interrupted") is True and out.get("thread_id") and out.get("run_id"), out
        return out

    approve_pending = start("approve path")
    dump("hitl-approve-pending.json", approve_pending)

    c.close()
    c = client()  # Fresh auth/session boundary: server state must still resume.
    r = c.post(
        f"/v1/projects/{pid}/run",
        json={"thread_id": approve_pending["thread_id"], "resume": {"value": "approve"}, "stream": False},
    )
    assert r.status_code == 200, r.text
    approved = r.json()
    assert approved.get("interrupted") is not True
    assert approved.get("thread_id") == approve_pending["thread_id"]
    dump("hitl-approved.json", approved)

    duplicate = c.post(
        f"/v1/projects/{pid}/run",
        json={"thread_id": approve_pending["thread_id"], "resume": {"value": "approve"}, "stream": False},
    )
    assert duplicate.status_code == 409, (duplicate.status_code, duplicate.text)
    dump("hitl-duplicate.json", {"status": duplicate.status_code, "body": duplicate.json()})

    reject_pending = start("reject path")
    dump("hitl-reject-pending.json", reject_pending)
    r = c.post(
        f"/v1/projects/{pid}/run",
        json={"thread_id": reject_pending["thread_id"], "resume": {"value": "reject"}, "stream": False},
    )
    assert r.status_code == 200, r.text
    rejected = r.json()
    assert rejected.get("interrupted") is not True
    dump("hitl-rejected.json", rejected)

    assert c.get(f"/v1/projects/{pid}").status_code == 200
    rw = c.get(f"/v1/projects/{pid}/workflows/{wid}")
    assert rw.status_code == 200
    assert rw.json()["executable"]["nodes"][0]["type"] == "human_input"
    dump("hitl-ids.json", {"project_id": pid, "workflow_id": wid})
    print("HITL_HTTP_E2E_PASS", pid, wid, approve_pending["run_id"], reject_pending["run_id"])


if __name__ == "__main__":
    main()
