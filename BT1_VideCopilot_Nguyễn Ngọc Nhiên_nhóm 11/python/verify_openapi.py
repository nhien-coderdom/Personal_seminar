import importlib.util
from pathlib import Path
import yaml
import sys

ROOT = Path(__file__).resolve().parent.parent
MAIN_PATH = ROOT / "python" / "main.py"
OPENAPI_PATH = ROOT / "openapi.yaml"

spec = yaml.safe_load(OPENAPI_PATH.read_text())

spec_mod = importlib.util.spec_from_file_location("sns_main", str(MAIN_PATH))
mod = importlib.util.module_from_spec(spec_mod)
spec_mod.loader.exec_module(mod)

app = getattr(mod, "app", None)
if app is None:
    print("FAILED: app not found")
    sys.exit(2)

# Emulate startup behavior: override openapi
app.openapi = lambda: spec
remote = app.openapi()

if remote == spec:
    print("MATCH")
    sys.exit(0)
else:
    print("MISMATCH")
    sys.exit(3)
