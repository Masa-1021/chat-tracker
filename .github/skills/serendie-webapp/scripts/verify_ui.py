#!/usr/bin/env python3
"""
Serendie UI Verification Script

Playwrightを使用してWebアプリのUIを検証し、スクリーンショットを撮影する。

Usage:
    python verify_ui.py [--url URL] [--output-dir DIR]

Options:
    --url         検証するURL (default: http://localhost:5173/)
    --output-dir  スクリーンショット保存先 (default: /tmp/serendie-verify)
"""

import argparse
import os
import sys
from datetime import datetime

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Error: playwright is not installed.")
    print("Run: pip install playwright && playwright install chromium")
    sys.exit(1)


def verify_serendie_ui(url: str, output_dir: str) -> dict:
    """Serendie UIの検証を実行"""

    os.makedirs(output_dir, exist_ok=True)
    results = {
        "url": url,
        "timestamp": datetime.now().isoformat(),
        "checks": [],
        "screenshots": [],
        "passed": True
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})

        print(f"Verifying: {url}")
        print(f"Output: {output_dir}")
        print("-" * 50)

        # ページ読み込み
        try:
            page.goto(url)
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(1000)
        except Exception as e:
            print(f"FAIL: Could not load page - {e}")
            results["passed"] = False
            browser.close()
            return results

        # 1. フルページスクリーンショット
        full_path = os.path.join(output_dir, "full_page.png")
        page.screenshot(path=full_path, full_page=True)
        results["screenshots"].append(full_path)
        print(f"Screenshot: {full_path}")

        # 2. テーマ属性の確認
        theme = page.locator("html").get_attribute("data-panda-theme")
        if theme:
            print(f"OK: Theme attribute found - {theme}")
            results["checks"].append({"name": "theme", "status": "pass", "value": theme})
        else:
            print("WARN: No data-panda-theme attribute on <html>")
            results["checks"].append({"name": "theme", "status": "warn", "value": None})

        # 3. Serendie CSS変数の確認
        css_vars = page.evaluate("""() => {
            const root = document.documentElement;
            const styles = getComputedStyle(root);
            return {
                primaryDefault: styles.getPropertyValue('--sds-color-primary-default').trim(),
                surfaceDefault: styles.getPropertyValue('--sds-color-surface-default').trim()
            };
        }""")

        if css_vars["primaryDefault"]:
            print(f"OK: Serendie CSS variables loaded")
            results["checks"].append({"name": "css_vars", "status": "pass", "value": css_vars})
        else:
            print("FAIL: Serendie CSS variables not found - check @import")
            results["checks"].append({"name": "css_vars", "status": "fail", "value": css_vars})
            results["passed"] = False

        # 4. ボタンのpadding確認（グローバルリセット問題の検出）
        buttons = page.locator("button").all()
        if buttons:
            btn_styles = page.evaluate("""() => {
                const btn = document.querySelector('button');
                if (!btn) return null;
                const styles = window.getComputedStyle(btn);
                return {
                    padding: styles.padding,
                    paddingLeft: styles.paddingLeft,
                    paddingRight: styles.paddingRight
                };
            }""")

            if btn_styles:
                padding_left = btn_styles.get("paddingLeft", "0px")
                if padding_left == "0px":
                    print(f"FAIL: Button padding is 0 - global reset issue detected!")
                    print("      Fix: Remove '* {{ padding: 0; }}' from CSS")
                    results["checks"].append({"name": "button_padding", "status": "fail", "value": btn_styles})
                    results["passed"] = False
                else:
                    print(f"OK: Button padding correct - {btn_styles['padding']}")
                    results["checks"].append({"name": "button_padding", "status": "pass", "value": btn_styles})

        # 5. Switchコンポーネントの確認
        switches = page.locator("[data-scope='switch']").all()
        if switches:
            switch_styles = page.evaluate("""() => {
                const el = document.querySelector('[data-scope="switch"]');
                if (!el) return null;
                const styles = window.getComputedStyle(el);
                return {
                    display: styles.display,
                    padding: styles.padding
                };
            }""")

            if switch_styles and switch_styles.get("padding") != "0px":
                print(f"OK: Switch component styled correctly")
                results["checks"].append({"name": "switch", "status": "pass", "value": switch_styles})
            else:
                print(f"WARN: Switch component may have styling issues")
                results["checks"].append({"name": "switch", "status": "warn", "value": switch_styles})

        # 6. コンポーネントセクションのスクリーンショット（存在する場合）
        components_section = page.locator("#components")
        if components_section.count() > 0:
            components_section.scroll_into_view_if_needed()
            page.wait_for_timeout(300)
            comp_path = os.path.join(output_dir, "components_section.png")
            page.screenshot(path=comp_path)
            results["screenshots"].append(comp_path)
            print(f"Screenshot: {comp_path}")

        browser.close()

    # 結果サマリー
    print("-" * 50)
    if results["passed"]:
        print("RESULT: All checks passed")
    else:
        print("RESULT: Some checks failed - review issues above")

    return results


def main():
    parser = argparse.ArgumentParser(description="Verify Serendie UI")
    parser.add_argument("--url", default="http://localhost:5173/", help="URL to verify")
    parser.add_argument("--output-dir", default="/tmp/serendie-verify", help="Output directory")
    args = parser.parse_args()

    results = verify_serendie_ui(args.url, args.output_dir)
    sys.exit(0 if results["passed"] else 1)


if __name__ == "__main__":
    main()
