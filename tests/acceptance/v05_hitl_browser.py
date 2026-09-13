#!/usr/bin/env python3
import json
import os

from playwright.sync_api import sync_playwright

WEB = os.getenv("FORGE_WEB_URL", "http://127.0.0.1:3000")
EMAIL = os.getenv("FORGE_BOOTSTRAP_ADMIN_EMAIL", "hitl@forge.local")
PASSWORD = os.environ["HITL_TEST_PASSWORD"]
EVIDENCE = os.getenv("HITL_EVIDENCE_DIR", "/tmp")


def path(name: str) -> str:
    return os.path.join(EVIDENCE, name)


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.goto(WEB, wait_until="networkidle")
        page.get_by_text("Sign in to your workspace").wait_for(timeout=15000)
        page.get_by_placeholder("you@company.com").fill(EMAIL)
        page.locator('input[type="password"]').fill(PASSWORD)
        page.get_by_role("button", name="Sign in").click()
        page.get_by_text("Welcome to Forge").wait_for(timeout=20000)
        page.get_by_text("v0.5 HITL Acceptance Project", exact=True).first.click()
        page.get_by_role("button", name="Playground", exact=True).first.click()
        inp = page.get_by_placeholder("Message the workflow…")
        inp.wait_for(timeout=15000)

        # Approve path.
        inp.fill("browser approve path")
        inp.press("Enter")
        page.get_by_text("Approval required", exact=True).wait_for(timeout=20000)
        page.get_by_text("Approve v0.5 controlled action?", exact=True).wait_for(timeout=5000)
        page.screenshot(path=path("hitl-browser-pending-approve.png"), full_page=True)
        page.get_by_role("button", name="approve", exact=True).click()
        page.get_by_text("Approval required", exact=True).wait_for(state="detached", timeout=15000)
        page.screenshot(path=path("hitl-browser-approved.png"), full_page=True)

        # Reject path.
        page.get_by_role("button", name="Reset", exact=True).click()
        inp = page.get_by_placeholder("Message the workflow…")
        inp.fill("browser reject path")
        inp.press("Enter")
        page.get_by_text("Approval required", exact=True).wait_for(timeout=20000)
        page.get_by_role("button", name="reject", exact=True).click()
        page.get_by_text("Approval required", exact=True).wait_for(state="detached", timeout=15000)
        page.screenshot(path=path("hitl-browser-rejected.png"), full_page=True)

        # Refresh/reopen path. The browser stores only opaque run/thread/workflow IDs;
        # the actual interrupt payload must be replayed from Forge after reload.
        page.get_by_role("button", name="Reset", exact=True).click()
        inp = page.get_by_placeholder("Message the workflow…")
        inp.fill("browser refresh persistence path")
        inp.press("Enter")
        page.get_by_text("Approval required", exact=True).wait_for(timeout=20000)
        page.screenshot(path=path("hitl-browser-before-refresh.png"), full_page=True)
        page.reload(wait_until="networkidle")
        page.get_by_text("Approval required", exact=True).wait_for(timeout=15000)
        page.get_by_text("Approve v0.5 controlled action?", exact=True).wait_for(timeout=5000)
        page.screenshot(path=path("hitl-browser-after-refresh.png"), full_page=True)
        with open(path("hitl-browser-refresh.json"), "w", encoding="utf-8") as f:
            json.dump({"pending_approval_restored_after_refresh": True}, f)

        # Prove the restored approval is actionable and clears normally.
        page.get_by_role("button", name="approve", exact=True).click()
        page.get_by_text("Approval required", exact=True).wait_for(state="detached", timeout=15000)
        print("HITL_BROWSER_E2E_PASS")
        browser.close()


if __name__ == "__main__":
    main()
