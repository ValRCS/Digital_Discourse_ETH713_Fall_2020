"""Execute every Week 02 code cell in one fresh standard-library namespace."""
import contextlib
import io
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
notebook = json.loads((ROOT / "Using_Libraries_and_Notebooks_2026.ipynb").read_text(encoding="utf-8"))
assert notebook["nbformat"] == 4
assert len({c["id"] for c in notebook["cells"]}) == len(notebook["cells"])
namespace = {"__name__": "__main__"}
executed = 0
try:
    for index, cell in enumerate(notebook["cells"], 1):
        if cell["cell_type"] == "code":
            with contextlib.redirect_stdout(io.StringIO()):
                exec(compile("".join(cell["source"]), f"cell-{index}", "exec"), namespace)
            executed += 1
    assert namespace["frequencies"].most_common() == [("rīga", 4), ("jelgava", 2), ("liepāja", 2), ("cēsis", 1)]
    assert namespace["output_path"].read_text(encoding="utf-8").splitlines()[0] == "token\tcount"
    assert json.loads(namespace["metadata_path"].read_text(encoding="utf-8"))["documents"] == 3
finally:
    if "workspace" in namespace:
        namespace["workspace"].cleanup()
print(f"Week 02: {executed} code cells executed successfully.")
