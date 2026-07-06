# public/pdf/*.pdf → public/pdf-pages/<id>/<n>.webp 페이지 이미지 생성.
# 덱 PDF를 교체한 뒤 실행: python tools/make_pdf_pages.py
# 페이지 수는 src/pdfPages.json에 기록되어 뷰어가 읽는다.
import json
from pathlib import Path

import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parents[1]
SRC = {
    "blackout": ROOT / "public/pdf/Project_Blackout_포트폴리오.pdf",
    "b3": ROOT / "public/pdf/Project_B3_포트폴리오.pdf",
    "console": ROOT / "public/pdf/Project_Deckbuilder_포트폴리오.pdf",
}
OUT = ROOT / "public/pdf-pages"
WIDTH = 1600  # 렌더 가로 픽셀

counts = {}
for pid, pdf_path in SRC.items():
    out_dir = OUT / pid
    out_dir.mkdir(parents=True, exist_ok=True)
    for old in out_dir.glob("*.webp"):
        old.unlink()
    doc = pdfium.PdfDocument(pdf_path)
    for i, page in enumerate(doc, start=1):
        scale = WIDTH / page.get_width()
        page.render(scale=scale).to_pil().save(out_dir / f"{i}.webp", "WEBP", quality=80)
    counts[pid] = len(doc)
    print(f"{pid}: {len(doc)} pages")

(ROOT / "src/pdfPages.json").write_text(json.dumps(counts), encoding="utf-8")
print("src/pdfPages.json:", counts)
