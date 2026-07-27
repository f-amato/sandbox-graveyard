#!/usr/bin/env python3
"""Convert a Burp Dastardly JUnit report into Faraday vulns and push via bulk_create.

Dastardly emits JUnit XML (testsuite=URL, testcase=issue, failure=detail), which
faraday-cli has no plugin for. This maps it to Faraday's bulk_create schema and
POSTs it straight to the workspace.

Env: FARADAY_URL, FARADAY_TOKEN, WS   Arg: report path (default dastardly-report.xml)
"""
import os, sys, re, json, socket, urllib.request, urllib.error
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

REPORT = sys.argv[1] if len(sys.argv) > 1 else "dastardly-report.xml"
FARADAY_URL = os.environ["FARADAY_URL"].rstrip("/")
TOKEN = os.environ["FARADAY_TOKEN"]
WS = os.environ["WS"]

SEV = {"critical": "critical", "high": "high", "medium": "medium", "low": "low",
       "info": "informational", "information": "informational",
       "informational": "informational"}


def severity_of(text: str) -> str:
    m = re.search(r"severity[:\s]+([A-Za-z]+)", text or "", re.I)
    return SEV.get(m.group(1).lower(), "informational") if m else "informational"


def _bad(v: int) -> bool:
    # chars illegal in XML 1.0
    return v < 0x9 or v in (0xB, 0xC) or 0xE <= v <= 0x1F


with open(REPORT, "rb") as fh:
    raw = fh.read().decode("utf-8", "replace")
# strip illegal numeric char references + raw control chars Dastardly may embed
raw = re.sub(r"&#x([0-9a-fA-F]+);", lambda m: "" if _bad(int(m.group(1), 16)) else m.group(0), raw)
raw = re.sub(r"&#(\d+);", lambda m: "" if _bad(int(m.group(1))) else m.group(0), raw)
raw = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", raw)
root = ET.fromstring(raw)
by_host: dict[str, list] = {}
count = 0
for ts in root.iter("testsuite"):
    url = ts.get("name") or "https://sandbox-graveyard.vercel.app/"
    u = urlparse(url if "://" in url else "https://" + url)
    host = u.hostname or "sandbox-graveyard.vercel.app"
    path = u.path or "/"
    for tc in ts.iter("testcase"):
        name = (tc.get("name") or "Dastardly issue").strip()
        for f in tc.findall("failure"):
            desc = (f.text or f.get("message") or "").strip()
            by_host.setdefault(host, []).append({
                "name": name,
                "desc": (desc[:5000] or name),
                "severity": severity_of(name + " " + desc),
                "type": "VulnerabilityWeb",
                "website": host, "path": path, "method": "GET",
                "refs": [{"name": "Burp Dastardly", "type": "other"}],
            })
            count += 1

hosts = []
for host, vulns in by_host.items():
    try:
        ip = socket.gethostbyname(host)
    except Exception:
        ip = "0.0.0.0"
    hosts.append({"ip": ip, "hostnames": [host], "description": "",
                  "services": [{"name": "https", "port": 443, "protocol": "tcp",
                                "status": "open", "vulnerabilities": vulns}]})

print(f"Dastardly -> Faraday: {count} findings across {len(hosts)} host(s)")
if not count:
    sys.exit(0)

req = urllib.request.Request(
    f"{FARADAY_URL}/_api/v3/ws/{WS}/bulk_create",
    data=json.dumps({"hosts": hosts}).encode(),
    headers={"Authorization": f"Token {TOKEN}", "Content-Type": "application/json"},
    method="POST",
)
try:
    resp = urllib.request.urlopen(req, timeout=90)
    print("bulk_create:", resp.status, resp.read(200).decode(errors="replace"))
except urllib.error.HTTPError as e:
    print("bulk_create HTTPError", e.code, e.read(500).decode(errors="replace"))
    sys.exit(1)
