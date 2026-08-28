#!/usr/bin/env python
"""Shkarko/rregullo logot e markave për Print Master — emra të saktë nga Wikimedia."""
import json, subprocess, time, urllib.parse

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PrintMasterLogoBot/1.0"
OUT = "C:/Users/Student/Desktop/viprint/assets/brands"

# slug -> emri i saktë i skedarit në Wikimedia Commons (ose 'wiki:PAGE' për pageimage)
FILES = {
    "kfc":        "KFC logo wordmark.svg",
    "mcdonalds":  "McDonald's Golden Arches.svg",
    "cocacola":   "Coca-Cola logo.svg",
    "zara":       "Zara Logo.svg",
    "nestle":     "Nestlé textlogo.svg",
    "lidl":       "Lidl logo.svg",
    "aldi":       "Aldi Süd Logo (2006).svg",
    "carrefour":  "wiki:Carrefour",
    "kaufland":   "Kaufland Logo.svg",
    "tesco":      "Tesco 2016 logo.svg",
    "amazon":     "Amazon logo.svg",
    "hsbc":       "HSBC UK logo.svg",
    "decathlon":  "Decathlon - logo (1990-2024).svg",
    "redbull":    "Logo of Red bull.svg",
    "nike":       "Logo NIKE.svg",
    "adidas":     "Adidas Logo.svg",
    "puma":       "Puma-logo-(text).svg",
    "samsung":    "Samsung Orig Wordmark BLACK RGB.png",
}

def curl(url, out=None, timeout=25):
    cmd = ["curl", "-sL", "--max-time", str(timeout), "-A", UA, url]
    if out:
        cmd += ["-o", out]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    return r.stdout if not out else ""

def pageimage(title):
    q = urllib.parse.quote(title.replace(" ", "_"))
    try:
        d = json.loads(curl(f"https://en.wikipedia.org/w/api.php?action=query&titles={q}&prop=pageimages&format=json&pithumbsize=330&redirects=1"))
        for p in d.get("query", {}).get("pages", {}).values():
            pi = p.get("thumbnail", {}).get("source")
            if pi:
                return pi
    except Exception:
        pass
    return None

def valid(path):
    try:
        from PIL import Image
        im = Image.open(path); im.load()
        return im.size
    except Exception:
        return None

ok, fail = 0, 0
for slug, src in FILES.items():
    path = f"{OUT}/{slug}.png"
    url = None
    if src.startswith("wiki:"):
        url = pageimage(src[5:])
        if not url:
            print(f"FAIL {slug}: pageimage nuk u gjet")
            fail += 1
            continue
    else:
        enc = urllib.parse.quote(src)
        url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{enc}?width=330"
    got = False
    for attempt in range(3):
        curl(url, path)
        if valid(path):
            got = True
            break
        time.sleep(2.2)
    if got:
        print(f"OK  {slug} <- {src} {valid(path)}")
        ok += 1
    else:
        print(f"FAIL {slug}: shkarkimi dështoi")
        fail += 1
    time.sleep(2.2)

print(f"\n=== OK: {ok} / FAIL: {fail} ===")
