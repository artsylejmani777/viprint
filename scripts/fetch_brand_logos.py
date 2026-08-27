#!/usr/bin/env python3
"""Shkarko logot e markave nga Wikimedia Commons (SVG -> PNG 330px)."""
import json, os, sys, time, urllib.parse, urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ViPrint/1.0 (contact: none)'}
OUT = r"C:\Users\Student\Desktop\viprint\assets\brands"
os.makedirs(OUT, exist_ok=True)
DELAY = 2.2  # sekonda ndërmjet kërkesave (Wikimedia rate limit)

BRANDS = [
    # (slug, emri i kerkimit)
    ('google',      'Google logo svg'),
    ('microsoft',   'Microsoft logo svg'),
    ('deloitte',    'Deloitte logo svg'),
    ('hsbc',        'HSBC logo svg'),
    ('amazon',      'Amazon logo svg'),
    ('ikea',        'IKEA logo svg'),
    ('hm',          'H&M logo svg'),
    ('mediamarkt',  'MediaMarkt logo svg'),
    ('decathlon',   'Decathlon logo svg'),
    ('zara',        'Zara logo svg'),
    ('cocacola',    'Coca-Cola logo svg'),
    ('pepsi',       'Pepsi logo svg'),
    ('heineken',    'Heineken logo svg'),
    ('loreal',      'L\'Oréal logo svg'),
    ('nestle',      'Nestlé logo svg'),
    ('lidl',        'Lidl logo svg'),
    ('aldi',        'Aldi logo svg'),
    ('carrefour',   'Carrefour logo svg'),
    ('kaufland',    'Kaufland logo svg'),
    ('tesco',       'Tesco logo svg'),
    ('redbull',     'Red Bull logo svg'),
    ('nike',        'Nike logo svg'),
    ('adidas',      'Adidas logo svg'),
    ('puma',        'Puma logo svg'),
    ('samsung',     'Samsung logo svg'),
]

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read()

def search_logo(q):
    url = ('https://commons.wikimedia.org/w/api.php?action=query&list=search'
           '&srnamespace=6&srsearch=' + urllib.parse.quote(q) + '&srlimit=5&format=json')
    data = json.loads(get(url))
    hits = data.get('query', {}).get('search', [])
    for h in hits:
        t = h['title']
        low = t.lower()
        if low.endswith('.svg') and ('logo' in low or 'wordmark' in low):
            return t
    for h in hits:
        if h['title'].lower().endswith('.svg'):
            return h['title']
    return None

def fetch_one(slug, q):
    """Kthe (slug, title, size) ose (slug, error)."""
    try:
        title = search_logo(q)
        if not title:
            return (slug, 'no search hit')
        fname = urllib.parse.quote(title.replace('File:', '').replace(' ', '_'))
        url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + fname + '?width=330'
        data = get(url)
        if len(data) < 500 or data[:8] == b'<!DOCTYP':
            return (slug, 'bad download ' + str(len(data)) + 'B')
        path = os.path.join(OUT, slug + '.png')
        with open(path, 'wb') as f:
            f.write(data)
        return (slug, title, len(data))
    except Exception as e:
        return (slug, str(e)[:80])

ok, fail = [], []
todo = list(BRANDS)
attempt = 0
while todo and attempt < 4:
    attempt += 1
    next_todo = []
    for slug, q in todo:
        time.sleep(DELAY)
        r = fetch_one(slug, q)
        if len(r) == 3:
            ok.append(r)
            print(f'  OK  {r[0]}.png <- {r[1]}', flush=True)
        else:
            if attempt < 4 and '429' in r[1]:
                next_todo.append((slug, q))  # rirpvo
            else:
                fail.append(r)
                print(f'  FAIL {slug}: {r[1]}', flush=True)
    todo = next_todo
    if todo:
        print(f'--- rritja {attempt + 1}: {len(todo)} të mbetura ---', flush=True)
        time.sleep(6)

print('=== OK (' + str(len(ok)) + ') ===')
for slug, title, size in ok:
    print(f'  {slug}.png  <- {title}  ({size}B)')
print('=== FAIL (' + str(len(fail)) + ') ===')
for slug, why in fail:
    print(f'  {slug}: {why}')
