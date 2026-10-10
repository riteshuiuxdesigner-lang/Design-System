"""Single source of truth for the design system tokens.

Defines the four Figma variable collections (Primitives, Semantic, Responsive,
Component) plus text/effect/grid styles, validates tier rules and contrast,
and writes tokens.json. Run: python3 build_tokens.py [review_template.html out.html]
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).parent

# --------------------------------------------------------------------------
# Tier 1 · Primitives (one mode). Raw values only. Hidden from every picker.
# --------------------------------------------------------------------------
STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
SCALES = {
    "neutral": ["#fafafa", "#f4f4f4", "#e7e7e7", "#d4d4d4", "#8f8f8f", "#6f6f6f", "#545454", "#404040", "#282828", "#181818", "#0b0b0b"],
    "blue":    ["#f4f8ff", "#e6eeff", "#d0dffe", "#afc9ff", "#7ea7ff", "#3f75ff", "#3263e4", "#2752c1", "#1f4098", "#173172", "#0a1e50"],
    "green":   ["#f2faf3", "#e3f3e6", "#c8e8cf", "#a1d9af", "#68bf82", "#1a9951", "#038744", "#017037", "#03582b", "#074220", "#002c11"],
    "amber":   ["#fef7ef", "#fceedd", "#f9debd", "#f8c990", "#f3ae50", "#e59602", "#b67700", "#935f01", "#724801", "#553500", "#372100"],
    "red":     ["#fef5f4", "#ffe8e5", "#ffd2ce", "#ffb2ab", "#ff7b74", "#e0383b", "#c9292f", "#a91e24", "#86191d", "#641516", "#450709"],
    "sky":     ["#f1f9fd", "#e1f1f9", "#c5e4f4", "#9bd2ed", "#5db5dd", "#0f99c9", "#047ba2", "#006688", "#00506c", "#003c52", "#012736"],
}
POP = {"yellow": "#ffd84a", "lime": "#c8f560", "pink": "#ff8fc8", "orange": "#ffb36b", "violet": "#b9a3ff"}


def hex_alpha(hex6, pct):
    return hex6 + format(round(pct / 100 * 255), "02x")


prim = {}  # name -> {type, value}


def P(name, typ, value):
    prim[name] = {"type": typ, "value": value}


for scale, vals in SCALES.items():
    for s, v in zip(STEPS, vals):
        P(f"color/{scale}/{s}", "color", v)
for n, v in POP.items():
    P(f"color/pop/{n}", "color", v)
P("color/white", "color", "#ffffff")
P("color/black", "color", "#000000")
P("color/transparent", "color", "#00000000")
for a in [4, 6, 8, 10, 14, 20, 30, 40, 45, 55, 65]:
    P(f"color/alpha/black/{a}", "color", hex_alpha("#000000", a))
for a in [6, 10]:
    P(f"color/alpha/white/{a}", "color", hex_alpha("#ffffff", a))
P("color/alpha/blue-500/20", "color", hex_alpha("#3f75ff", 20))
P("color/alpha/blue-400/24", "color", hex_alpha("#7ea7ff", 24))
P("color/alpha/red-600/20", "color", hex_alpha("#c9292f", 20))
P("color/alpha/red-400/24", "color", hex_alpha("#ff7b74", 24))

for v in [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]:
    P(f"space/{v}", "number", v)
P("space/neg-8", "number", -8)
for v in [0, 4, 8, 12, 16, 24, 32, 9999]:
    P(f"radius/{v}", "number", v)
for v in [0, 1, 2]:
    P(f"border-width/{v}", "number", v)
for v in [4, 8, 16, 20, 24, 32, 36, 40, 44, 52, 56, 64, 120, 200, 240, 280, 320, 400, 560, 640, 720, 1280, 1440]:
    P(f"size/{v}", "number", v)
for v in [2, 3, 4, 8, 12]:
    P(f"grid/count/{v}", "number", v)
P("font/family/inter-display", "string", "Inter Display")
for v in [400, 500, 600, 700]:
    P(f"font/weight/{v}", "number", v)
for v in [12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 36, 40, 44, 48, 56, 64]:
    P(f"font/size/{v}", "number", v)
for v in [16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 60, 68]:
    P(f"font/line-height/{v}", "number", v)
for v in [0, 120, 200, 320]:
    P(f"motion/duration/{v}", "number", v)
P("motion/easing/standard", "string", "cubic-bezier(0.2, 0, 0, 1)")
P("motion/easing/enter", "string", "cubic-bezier(0.16, 1, 0.3, 1)")
P("motion/easing/exit", "string", "cubic-bezier(0.7, 0, 0.84, 0)")
P("motion/easing/spring", "string", "cubic-bezier(0.34, 1.56, 0.64, 1)")

# --------------------------------------------------------------------------
# Tier 2 · Semantic (modes Light / Dark). Aliases primitives only.
# --------------------------------------------------------------------------
sem = {}  # name -> {type, scopes, values: {Light, Dark}, note}
C = lambda s: f"color/{s}"
N = lambda s: f"color/neutral/{s}"
W = "color/white"


def S(name, typ, light, dark=None, scopes=None, note=""):
    sem[name] = {"type": typ, "scopes": scopes, "values": {"Light": light, "Dark": dark if dark is not None else light}, "note": note}


BG = ["FRAME_FILL", "SHAPE_FILL"]
TX = ["TEXT_FILL"]
IC = ["SHAPE_FILL", "STROKE_COLOR"]
BD = ["STROKE_COLOR"]
EF = ["EFFECT_COLOR"]
FILL_ANY = ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR"]

# Backgrounds
S("color/bg/default", "color", W, N(950), BG, "Page canvas")
S("color/bg/surface", "color", W, N(900), BG, "Cards, panels, inputs")
S("color/bg/raised", "color", W, N(800), BG, "Menus, modals, popovers")
S("color/bg/subtle", "color", N(50), N(950), BG, "Sunken areas, wells")
S("color/bg/muted", "color", N(100), N(800), BG, "Quiet fills, tracks")
S("color/bg/muted-hover", "color", N(200), N(700), BG)
S("color/bg/hover", "color", "color/alpha/black/4", "color/alpha/white/6", BG, "Transparent hover wash")
S("color/bg/pressed", "color", "color/alpha/black/8", "color/alpha/white/10", BG)
S("color/bg/inverse", "color", N(950), N(50), BG, "Toast, tooltip")
S("color/bg/selected", "color", N(950), N(50), BG, "Selected chip, current page")
S("color/bg/disabled", "color", N(100), N(800), BG)
S("color/bg/overlay", "color", "color/alpha/black/40", "color/alpha/black/65", BG, "Modal scrim")
# Text
S("color/text/primary", "color", N(950), N(50), TX)
S("color/text/secondary", "color", N(600), N(300), TX)
S("color/text/muted", "color", N(500), N(400), TX, "Placeholders, captions")
S("color/text/disabled", "color", N(400), N(600), TX, "Exempt from contrast (WCAG 1.4.3)")
S("color/text/inverse", "color", W, N(950), TX)
S("color/text/selected", "color", W, N(950), TX)
S("color/text/on-action", "color", W, W, TX, "Label on primary/destructive")
S("color/text/on-pop", "color", N(950), N(950), TX, "Ink on pop colors, both modes")
S("color/text/link", "color", C("blue/600"), C("blue/400"), TX)
S("color/text/link-hover", "color", C("blue/700"), C("blue/300"), TX)
# Icon
S("color/icon/primary", "color", N(950), N(50), IC)
S("color/icon/secondary", "color", N(600), N(300), IC)
S("color/icon/muted", "color", N(500), N(400), IC)
S("color/icon/disabled", "color", N(400), N(600), IC)
S("color/icon/inverse", "color", W, N(950), IC)
S("color/icon/on-pop", "color", N(950), N(950), IC)
S("color/icon/on-action", "color", W, W, IC, "Icons on primary/destructive")
# Border
S("color/border/subtle", "color", N(200), N(800), BD, "Dividers, card outlines")
S("color/border/default", "color", N(300), N(700), BD, "Secondary buttons, chips")
S("color/border/strong", "color", N(400), N(500), BD, "Inputs, checkboxes, switch track (3:1)")
S("color/border/hover", "color", N(500), N(400), BD)
S("color/border/selected", "color", N(950), N(50), BD)
S("color/border/disabled", "color", N(200), N(800), BD)
S("color/border/elevation", "color", "color/transparent", N(800), BD, "Edge on raised layers in dark mode")
# Focus
S("color/focus/ring", "color", C("blue/500"), C("blue/400"), FILL_ANY + EF, "Brand #3f75ff")
S("color/focus/halo", "color", "color/alpha/blue-500/20", "color/alpha/blue-400/24", EF, "Soft input focus glow")
# Actions
S("color/action/primary/default", "color", C("blue/600"), C("blue/600"), BG)
S("color/action/primary/hover", "color", C("blue/700"), C("blue/700"), BG)
S("color/action/primary/pressed", "color", C("blue/800"), C("blue/800"), BG)
S("color/action/primary/disabled", "color", N(100), N(800), BG)
S("color/action/secondary/default", "color", W, N(900), BG)
S("color/action/secondary/hover", "color", N(100), N(800), BG)
S("color/action/secondary/pressed", "color", N(200), N(700), BG)
S("color/action/secondary/border", "color", N(300), N(700), BD)
S("color/action/tertiary/default", "color", N(100), N(800), BG)
S("color/action/tertiary/hover", "color", N(200), N(700), BG)
S("color/action/tertiary/pressed", "color", N(300), N(600), BG)
S("color/action/ghost/hover", "color", "color/alpha/black/4", "color/alpha/white/6", BG)
S("color/action/ghost/pressed", "color", "color/alpha/black/8", "color/alpha/white/10", BG)
S("color/action/destructive/default", "color", C("red/600"), C("red/600"), BG)
S("color/action/destructive/hover", "color", C("red/700"), C("red/700"), BG)
S("color/action/destructive/pressed", "color", C("red/800"), C("red/800"), BG)
# Feedback
for kind, scale in [("error", "red"), ("success", "green"), ("warning", "amber"), ("info", "sky")]:
    S(f"color/feedback/{kind}/bg", "color", C(f"{scale}/50"), C(f"{scale}/950"), BG)
    S(f"color/feedback/{kind}/border", "color", C(f"{scale}/200"), C(f"{scale}/800"), BD)
    S(f"color/feedback/{kind}/text", "color", C(f"{scale}/700"), C(f"{scale}/300"), TX)
    S(f"color/feedback/{kind}/icon", "color", C(f"{scale}/600"), C(f"{scale}/400"), IC)
S("color/feedback/error/solid", "color", C("red/600"), C("red/400"), FILL_ANY, "Error input border")
S("color/feedback/error/halo", "color", "color/alpha/red-600/20", "color/alpha/red-400/24", EF)
# Pop
for n in POP:
    S(f"color/pop/{n}", "color", f"color/pop/{n}", f"color/pop/{n}", BG, "Always with text/on-pop")
# Controls
S("color/control/knob", "color", W, W, BG, "Switch knob")
S("color/control/thumb", "color", W, N(700), BG, "Selected segment in segmented control")
# Shadow
for n, (l, d) in {"xs": (6, 30), "sm": (8, 40), "md": (10, 45), "lg": (14, 55), "xl": (20, 65)}.items():
    S(f"color/shadow/{n}", "color", f"color/alpha/black/{l}", f"color/alpha/black/{d}", EF)
# Illustration
S("color/illustration/stroke", "color", N(950), N(50), FILL_ANY)
S("color/illustration/fill", "color", W, N(900), BG)
S("color/illustration/muted", "color", N(100), N(800), BG)

# Numbers (same value in both modes)
for n, v in {"none": 0, "3xs": 2, "2xs": 4, "xs": 8, "sm": 12, "md": 16, "lg": 20, "xl": 24, "2xl": 32, "3xl": 40, "4xl": 48, "5xl": 64, "6xl": 80, "7xl": 96}.items():
    S(f"space/{n}", "number", f"space/{v}", scopes=["GAP"])
S("space/overlap", "number", "space/neg-8", scopes=["GAP"], note="Negative gap for overlapping avatars")
for n, v in {"none": 0, "xs": 4, "sm": 8, "md": 12, "lg": 16, "xl": 24, "2xl": 32, "full": 9999}.items():
    S(f"radius/{n}", "number", f"radius/{v}", scopes=["CORNER_RADIUS"])
S("radius/control", "number", "radius/9999", scopes=["CORNER_RADIUS"], note="Every interactive control. One switch for the pill look")
for n, v in {"none": 0, "default": 1, "thick": 2, "focus": 2}.items():
    S(f"border-width/{n}", "number", f"border-width/{v}", scopes=["STROKE_FLOAT"])
for n, v in {"control/sm": 36, "control/md": 44, "control/lg": 52, "touch-target": 44,
             "icon/sm": 16, "icon/md": 20, "icon/lg": 24,
             "avatar/xs": 24, "avatar/sm": 32, "avatar/md": 40, "avatar/lg": 56,
             "illustration/sm": 120, "illustration/md": 200, "illustration/lg": 280,
             "track/sm": 4, "track/md": 8, "nav-height": 64, "sidebar": 240, "popover": 320, "drawer": 400,
             "modal/sm": 400, "modal/md": 560, "modal/lg": 720, "command": 640}.items():
    S(f"size/{n}", "number", f"size/{v}", scopes=["WIDTH_HEIGHT"])
for n, v in {"instant": 0, "fast": 120, "base": 200, "slow": 320}.items():
    S(f"motion/duration/{n}", "number", f"motion/duration/{v}", scopes=[], note="ms · code handoff")
for n in ["standard", "enter", "exit", "spring"]:
    S(f"motion/easing/{n}", "string", f"motion/easing/{n}", scopes=[], note="Code handoff")

# --------------------------------------------------------------------------
# Tier 2 · Responsive (modes Desktop / Tablet / Mobile). Typography + layout.
# --------------------------------------------------------------------------
resp = {}
MODES_R = ["Desktop", "Tablet", "Mobile"]


def R(name, typ, d, t=None, m=None, scopes=None, note="", raw=False):
    t = d if t is None else t
    m = t if m is None else m
    resp[name] = {"type": typ, "scopes": scopes, "values": {"Desktop": d, "Tablet": t, "Mobile": m}, "note": note, "raw": raw}


# style: (desktop size/lh, tablet, mobile, weight, tracking em)
TYPE = {
    "display":    ((64, 68), (56, 60), (44, 48), 700, -0.035),
    "heading-1":  ((48, 56), (40, 48), (36, 40), 700, -0.03),
    "heading-2":  ((36, 44), (36, 44), (28, 36), 600, -0.025),
    "heading-3":  ((24, 32), (24, 32), (22, 28), 600, -0.02),
    "heading-4":  ((20, 28), (20, 28), (18, 24), 600, -0.01),
    "body-lg":    ((18, 28), (18, 28), (18, 28), 400, 0),
    "body-md":    ((16, 24), (16, 24), (16, 24), 400, 0),
    "body-sm":    ((14, 20), (14, 20), (14, 20), 400, 0.005),
    "label-md":   ((15, 20), (15, 20), (15, 20), 600, 0.005),
    "label-sm":   ((13, 16), (13, 16), (13, 16), 600, 0.01),
    "caption":    ((12, 16), (12, 16), (12, 16), 500, 0.01),
    "numeric-md": ((14, 20), (14, 20), (14, 20), 500, 0),
}
for st, (d, t, m, w, em) in TYPE.items():
    R(f"type/{st}/family", "string", "font/family/inter-display", scopes=["FONT_FAMILY"])
    R(f"type/{st}/weight", "number", f"font/weight/{w}", scopes=["FONT_WEIGHT"])
    R(f"type/{st}/size", "number", f"font/size/{d[0]}", f"font/size/{t[0]}", f"font/size/{m[0]}", scopes=["FONT_SIZE"])
    R(f"type/{st}/line-height", "number", f"font/line-height/{d[1]}", f"font/line-height/{t[1]}", f"font/line-height/{m[1]}", scopes=["LINE_HEIGHT"])
    trk = lambda size: round(size * em, 2)
    R(f"type/{st}/tracking", "number", trk(d[0]), trk(t[0]), trk(m[0]), scopes=["LETTER_SPACING"],
      note=f"{em:+}em at each size, in px", raw=True)
R("layout/grid/columns", "number", "grid/count/12", "grid/count/8", "grid/count/4", scopes=[])
R("layout/grid/gutter", "number", "space/24", "space/24", "space/16", scopes=["GAP"])
R("layout/grid/margin", "number", "space/40", "space/32", "space/16", scopes=["GAP"])
R("layout/section-gap", "number", "space/96", "space/80", "space/64", scopes=["GAP"])
R("layout/asset-grid/columns", "number", "grid/count/4", "grid/count/3", "grid/count/2", scopes=[])
R("layout/asset-grid/gap", "number", "space/24", "space/20", "space/16", scopes=["GAP"])
R("layout/container/narrow", "number", "size/640", scopes=["WIDTH_HEIGHT"])
R("layout/container/default", "number", "size/1280", scopes=["WIDTH_HEIGHT"])
R("layout/container/wide", "number", "size/1440", scopes=["WIDTH_HEIGHT"])

# --------------------------------------------------------------------------
# Tier 3 · Component (one mode). Aliases Semantic / Responsive only.
# --------------------------------------------------------------------------
comp = {}


def K(name, alias, note=""):
    comp[name] = {"alias": alias, "note": note}


# Button
for v, bgs, txt in [
    ("primary", ("action/primary/default", "action/primary/hover", "action/primary/pressed", "action/primary/disabled"), "text/on-action"),
    ("secondary", ("action/secondary/default", "action/secondary/hover", "action/secondary/pressed", "bg/disabled"), "text/primary"),
    ("tertiary", ("action/tertiary/default", "action/tertiary/hover", "action/tertiary/pressed", "bg/disabled"), "text/primary"),
    ("destructive", ("action/destructive/default", "action/destructive/hover", "action/destructive/pressed", "action/primary/disabled"), "text/on-action"),
]:
    for st, a in zip(["default", "hover", "pressed", "disabled"], bgs):
        K(f"button/{v}/bg/{st}", f"color/{a}")
    K(f"button/{v}/text/default", f"color/{txt}")
    K(f"button/{v}/text/disabled", "color/text/disabled")
K("button/secondary/border/default", "color/action/secondary/border")
K("button/ghost/bg/hover", "color/action/ghost/hover")
K("button/ghost/bg/pressed", "color/action/ghost/pressed")
K("button/ghost/text/default", "color/text/secondary")
K("button/ghost/text/hover", "color/text/primary")
K("button/ghost/text/disabled", "color/text/disabled")
K("button/radius", "radius/control")
for sz, h, px, ic in [("sm", "control/sm", "md", "icon/sm"), ("md", "control/md", "lg", "icon/md"), ("lg", "control/lg", "xl", "icon/md")]:
    K(f"button/{sz}/height", f"size/{h}")
    K(f"button/{sz}/padding-x", f"space/{px}")
    K(f"button/{sz}/gap", "space/xs")
    K(f"button/{sz}/icon", f"size/{ic}")
# Input + field
K("input/bg/default", "color/bg/surface")
K("input/bg/disabled", "color/bg/disabled")
K("input/border/default", "color/border/strong")
K("input/border/hover", "color/border/hover")
K("input/border/focus", "color/focus/ring")
K("input/border/error", "color/feedback/error/solid")
K("input/border/disabled", "color/border/disabled")
K("input/text/value", "color/text/primary")
K("input/text/placeholder", "color/text/muted")
K("input/text/disabled", "color/text/disabled")
K("input/icon", "color/icon/muted")
K("input/radius", "radius/control")
K("input/border-width", "border-width/default")
K("input/padding-x", "space/md")
K("input/gap", "space/xs")
for sz, h in [("sm", "control/sm"), ("md", "control/md"), ("lg", "control/lg")]:
    K(f"input/{sz}/height", f"size/{h}")
K("field/label/text", "color/text/primary")
K("field/helper/text", "color/text/muted")
K("field/error/text", "color/feedback/error/text")
K("field/gap", "space/xs")
# Checkbox / radio / switch
K("checkbox/bg/default", "color/bg/surface")
K("checkbox/bg/checked", "color/action/primary/default")
K("checkbox/bg/disabled", "color/bg/disabled")
K("checkbox/border/default", "color/border/strong")
K("checkbox/border/hover", "color/border/hover")
K("checkbox/icon", "color/text/on-action")
K("checkbox/size", "size/icon/md")
K("checkbox/radius", "radius/xs")
K("checkbox/border-width", "border-width/thick")
K("radio/radius", "radius/full")
K("switch/track/off", "color/border/strong")
K("switch/track/on", "color/action/primary/default")
K("switch/track/disabled", "color/bg/disabled")
K("switch/knob", "color/control/knob")
K("switch/radius", "radius/full")
K("selection/label-gap", "space/xs")
# Chip (filter)
K("chip/bg/default", "color/bg/surface")
K("chip/bg/hover", "color/bg/muted")
K("chip/bg/selected", "color/bg/selected")
K("chip/border/default", "color/border/default")
K("chip/text/default", "color/text/primary")
K("chip/text/selected", "color/text/selected")
K("chip/height", "size/avatar/md", "40px")
K("chip/padding-x", "space/md")
K("chip/gap", "space/xs")
K("chip/radius", "radius/control")
# Badge
K("badge/neutral/bg", "color/bg/muted")
K("badge/neutral/text", "color/text/secondary")
K("badge/ink/bg", "color/bg/inverse")
K("badge/ink/text", "color/text/inverse")
for n in POP:
    K(f"badge/pop-{n}/bg", f"color/pop/{n}")
K("badge/pop/text", "color/text/on-pop")
for kind in ["success", "warning", "error", "info"]:
    K(f"badge/{kind}/bg", f"color/feedback/{kind}/bg")
    K(f"badge/{kind}/border", f"color/feedback/{kind}/border")
    K(f"badge/{kind}/text", f"color/feedback/{kind}/text")
K("badge/height", "size/avatar/xs", "24px")
K("badge/padding-x", "space/sm")
K("badge/radius", "radius/control")
# Segmented control / tabs
K("segmented/track/bg", "color/bg/muted")
K("segmented/thumb/bg", "color/control/thumb")
K("segmented/text/default", "color/text/secondary")
K("segmented/text/selected", "color/text/primary")
K("segmented/padding", "space/2xs")
K("segmented/radius", "radius/control")
# Card
K("card/bg", "color/bg/surface")
K("card/border", "color/border/subtle")
K("card/radius", "radius/xl")
K("card/padding", "space/xl")
K("asset-card/thumb/radius", "radius/xl")
K("asset-card/gap", "space/sm")
K("asset-card/title", "color/text/primary")
K("asset-card/meta", "color/text/muted")
# Avatar
K("avatar/bg", "color/pop/orange", "Swap per instance with any pop color")
K("avatar/text", "color/text/on-pop")
K("avatar/radius", "radius/full")
# Alert
for kind in ["info", "success", "warning", "error"]:
    K(f"alert/{kind}/bg", f"color/feedback/{kind}/bg")
    K(f"alert/{kind}/border", f"color/feedback/{kind}/border")
    K(f"alert/{kind}/icon", f"color/feedback/{kind}/icon")
K("alert/title", "color/text/primary")
K("alert/body", "color/text/secondary")
K("alert/radius", "radius/lg")
K("alert/padding", "space/md")
K("alert/gap", "space/sm")
# Toast / tooltip
K("toast/bg", "color/bg/inverse")
K("toast/text", "color/text/inverse")
K("toast/icon-bg", "color/pop/lime")
K("toast/radius", "radius/control")
K("toast/padding", "space/xs")
K("tooltip/bg", "color/bg/inverse")
K("tooltip/text", "color/text/inverse")
K("tooltip/radius", "radius/sm")
K("tooltip/padding-x", "space/sm")
K("tooltip/padding-y", "space/xs")
# Menu
K("menu/bg", "color/bg/raised")
K("menu/border", "color/border/subtle")
K("menu/item/bg/hover", "color/bg/muted")
K("menu/item/text", "color/text/primary")
K("menu/item/icon", "color/icon/muted")
K("menu/item/text-destructive", "color/feedback/error/text")
K("menu/radius", "radius/lg")
K("menu/item/radius", "radius/control")
K("menu/padding", "space/xs")
# Modal
K("modal/bg", "color/bg/raised")
K("modal/border", "color/border/elevation")
K("modal/scrim", "color/bg/overlay")
K("modal/radius", "radius/2xl")
K("modal/padding", "space/xl")
K("modal/gap", "space/md")
# --- Added for the full component build (Phase 5) ---
EXTRA = {
    # Button icons
    "button/primary/icon": "color/icon/on-action", "button/secondary/icon": "color/icon/primary",
    "button/tertiary/icon": "color/icon/primary", "button/ghost/icon": "color/icon/secondary",
    "button/destructive/icon": "color/icon/on-action", "button/icon-disabled": "color/icon/disabled",
    "button-group/gap": "space/xs",
    # Spinner
    "spinner/size/sm": "size/icon/sm", "spinner/size/md": "size/icon/md", "spinner/size/lg": "size/icon/lg",
    "spinner/color/default": "color/icon/secondary", "spinner/color/on-action": "color/icon/on-action", "spinner/color/inverse": "color/icon/inverse",
    # Divider
    "divider/color": "color/border/subtle", "divider/width": "border-width/default",
    # Icon button
    "icon-button/sm/size": "size/control/sm", "icon-button/md/size": "size/control/md", "icon-button/lg/size": "size/control/lg",
    "icon-button/sm/icon": "size/icon/sm", "icon-button/md/icon": "size/icon/md", "icon-button/lg/icon": "size/icon/lg",
    "icon-button/radius": "radius/control", "icon-button/selected/bg": "color/bg/selected", "icon-button/selected/icon": "color/icon/inverse",
    # Link
    "link/text/default": "color/text/link", "link/text/hover": "color/text/link-hover", "link/text/subtle": "color/text/primary",
    "link/text/disabled": "color/text/disabled", "link/gap": "space/2xs", "link/icon": "size/icon/sm",
    # Field
    "field/required": "color/feedback/error/text", "field/label/gap": "space/2xs",
    # Search
    "search/bg/default": "color/bg/muted", "search/bg/hover": "color/bg/muted-hover", "search/kbd/bg": "color/bg/surface",
    "search/kbd/text": "color/text/muted", "search/kbd/radius": "radius/control", "search/kbd/padding-x": "space/xs",
    # Textarea / OTP / slider
    "textarea/radius": "radius/lg", "textarea/padding-y": "space/sm", "textarea/min-height": "size/illustration/sm",
    "otp/cell/size": "size/control/lg", "otp/gap": "space/xs", "otp/radius": "radius/md",
    "slider/track": "color/bg/muted", "slider/fill": "color/action/primary/default", "slider/thumb": "color/control/knob",
    "slider/thumb-border": "color/action/primary/default", "slider/track-height": "size/track/sm", "slider/thumb-size": "size/icon/md",
    # Switch geometry
    "switch/width": "size/control/md", "switch/height": "size/icon/lg", "switch/knob-size": "size/icon/md", "switch/padding": "space/3xs",
    # Radio card (license selector)
    "radio-card/bg/default": "color/bg/surface", "radio-card/bg/selected": "color/bg/subtle", "radio-card/border/default": "color/border/default",
    "radio-card/border/selected": "color/border/selected", "radio-card/radius": "radius/lg", "radio-card/padding": "space/md", "radio-card/gap": "space/sm",
    # File upload
    "dropzone/bg": "color/bg/subtle", "dropzone/border": "color/border/strong", "dropzone/border-active": "color/focus/ring",
    "dropzone/radius": "radius/xl", "dropzone/padding": "space/2xl", "dropzone/icon-bg": "color/pop/yellow", "dropzone/gap": "space/sm",
    # Progress
    "progress/track": "color/bg/muted", "progress/fill": "color/action/primary/default", "progress/fill-success": "color/feedback/success/icon",
    "progress/radius": "radius/full", "progress/height": "size/track/md",
    # Avatar
    "avatar/xs/size": "size/avatar/xs", "avatar/sm/size": "size/avatar/sm", "avatar/md/size": "size/avatar/md", "avatar/lg/size": "size/avatar/lg",
    "avatar/status": "color/feedback/success/icon", "avatar/ring": "color/bg/surface", "avatar-group/overlap": "space/overlap",
    # Price tag
    "price/bg": "color/bg/muted", "price/text": "color/text/primary", "price/free/bg": "color/pop/lime", "price/free/text": "color/text/on-pop",
    "price/sale/text": "color/feedback/error/text", "price/strike": "color/text/muted", "price/radius": "radius/control",
    "price/padding-x": "space/xs", "price/gap": "space/2xs",
    # Rating
    "rating/star/filled": "color/feedback/warning/icon", "rating/star/empty": "color/border/strong", "rating/gap": "space/3xs", "rating/count": "color/text/muted",
    # List item / table / stat
    "list-item/bg/hover": "color/bg/hover", "list-item/padding-x": "space/md", "list-item/padding-y": "space/sm", "list-item/gap": "space/sm",
    "list-item/radius": "radius/md", "list-item/title": "color/text/primary", "list-item/meta": "color/text/muted",
    "table/header/bg": "color/bg/subtle", "table/header/text": "color/text/muted", "table/row/border": "color/border/subtle",
    "table/row/hover": "color/bg/hover", "table/cell/padding-x": "space/md", "table/cell/padding-y": "space/sm", "table/radius": "radius/lg",
    "stat/delta/up": "color/feedback/success/text", "stat/delta/down": "color/feedback/error/text", "stat/label": "color/text/muted", "stat/value": "color/text/primary",
    # Skeleton / empty state
    "skeleton/bg": "color/bg/muted", "skeleton/radius": "radius/sm", "skeleton/radius-text": "radius/full", "skeleton/radius-media": "radius/xl",
    "empty/gap": "space/md", "empty/title": "color/text/primary", "empty/body": "color/text/secondary", "empty/padding": "space/2xl",
    # Pagination / breadcrumbs
    "pagination/item/size": "size/control/sm", "pagination/item/text": "color/text/secondary", "pagination/item/hover": "color/bg/hover",
    "pagination/current/bg": "color/bg/selected", "pagination/current/text": "color/text/selected", "pagination/gap": "space/2xs", "pagination/radius": "radius/control",
    "breadcrumb/text": "color/text/muted", "breadcrumb/current": "color/text/primary", "breadcrumb/separator": "color/icon/muted", "breadcrumb/gap": "space/xs",
    # Navigation
    "nav/bg": "color/bg/surface", "nav/border": "color/border/subtle", "nav/height": "size/nav-height", "nav/padding-x": "space/xl",
    "nav/gap": "space/xl", "nav/link/text": "color/text/secondary", "nav/link/active": "color/text/primary", "nav/link/active-bg": "color/bg/muted",
    "nav/link/hover-bg": "color/bg/hover", "nav/link/padding-x": "space/sm", "nav/link/radius": "radius/control",
    "bottom-nav/bg": "color/bg/surface", "bottom-nav/border": "color/border/subtle", "bottom-nav/height": "size/nav-height",
    "bottom-nav/item/text": "color/text/muted", "bottom-nav/item/active": "color/text/primary", "bottom-nav/item/active-bg": "color/pop/yellow",
    "sidebar/bg": "color/bg/subtle", "sidebar/width": "size/sidebar", "sidebar/padding": "space/sm", "sidebar/item/text": "color/text/secondary",
    "sidebar/item/active-text": "color/text/primary", "sidebar/item/active-bg": "color/bg/muted", "sidebar/item/hover-bg": "color/bg/hover",
    "stepper/active/bg": "color/bg/selected", "stepper/active/text": "color/text/selected", "stepper/done/bg": "color/pop/lime",
    "stepper/done/icon": "color/icon/on-pop", "stepper/upcoming/bg": "color/bg/muted", "stepper/upcoming/text": "color/text/muted",
    "stepper/connector": "color/border/default", "stepper/connector-done": "color/border/selected", "stepper/size": "size/avatar/sm",
    # Overlays
    "drawer/bg": "color/bg/raised", "drawer/radius": "radius/2xl", "drawer/padding": "space/xl", "drawer/width": "size/drawer", "drawer/handle": "color/border/default",
    "popover/bg": "color/bg/raised", "popover/border": "color/border/subtle", "popover/radius": "radius/lg", "popover/padding": "space/md", "popover/width": "size/popover",
    "command/bg": "color/bg/raised", "command/item-active": "color/bg/muted", "command/radius": "radius/xl", "command/width": "size/command",
    "modal/sm/width": "size/modal/sm", "modal/md/width": "size/modal/md", "modal/lg/width": "size/modal/lg", "modal/icon-bg": "color/pop/violet",
    "tooltip/max-width": "size/popover",
    # Date picker / carousel / notifications
    "date/day/size": "size/control/sm", "date/day/selected-bg": "color/bg/selected", "date/day/selected-text": "color/text/selected",
    "date/day/today-border": "color/border/selected", "date/day/range-bg": "color/bg/muted", "date/day/hover": "color/bg/hover", "date/day/outside": "color/text/disabled",
    "carousel/dot": "color/border/default", "carousel/dot-active": "color/bg/selected", "carousel/radius": "radius/xl",
    "notification/unread": "color/action/primary/default", "notification/bg-unread": "color/bg/subtle", "notification/width": "size/popover",
}
for k, a in EXTRA.items():
    K(k, a)
# Focus

# --------------------------------------------------------------------------
# Styles (bind to variables; geometry that has no variable lives in the style)
# --------------------------------------------------------------------------
text_styles = [{"name": f"type/{st}", "binds": {p: f"type/{st}/{p}" for p in ["family", "weight", "size", "line-height", "tracking"]}} for st in TYPE]
effect_styles = [
    {"name": "elevation/1", "layers": [[0, 1, 2, 0, "color/shadow/xs"]]},
    {"name": "elevation/2", "layers": [[0, 2, 4, -1, "color/shadow/xs"], [0, 6, 16, -4, "color/shadow/md"]]},
    {"name": "elevation/3", "layers": [[0, 4, 8, -2, "color/shadow/xs"], [0, 16, 32, -8, "color/shadow/lg"]]},
    {"name": "elevation/4", "layers": [[0, 8, 16, -4, "color/shadow/sm"], [0, 28, 56, -12, "color/shadow/xl"]]},
    {"name": "focus/ring", "layers": [[0, 0, 0, 2, "color/bg/surface"], [0, 0, 0, 4, "color/focus/ring"]]},
    {"name": "focus/halo", "layers": [[0, 0, 0, 4, "color/focus/halo"]]},
    {"name": "focus/halo-error", "layers": [[0, 0, 0, 4, "color/feedback/error/halo"]]},
]
grid_styles = [{"name": "layout/columns", "binds": {"count": "layout/grid/columns", "gutter": "layout/grid/gutter", "margin": "layout/grid/margin"}}]

# --------------------------------------------------------------------------
# Scopes for primitives: hidden from every picker
# --------------------------------------------------------------------------
for v in prim.values():
    v["scopes"] = []


def code_syntax(name):
    return "var(--" + name.replace("/", "-") + ")"


# --------------------------------------------------------------------------
# Validation
# --------------------------------------------------------------------------
errors = []
for n, v in sem.items():
    for mode, a in v["values"].items():
        if a not in prim:
            errors.append(f"Semantic {n} [{mode}] -> {a}: not a primitive")
        elif prim[a]["type"] != v["type"]:
            errors.append(f"Semantic {n} type mismatch")
for n, v in resp.items():
    for mode, a in v["values"].items():
        if v["raw"]:
            continue
        if a not in prim:
            errors.append(f"Responsive {n} [{mode}] -> {a}: not a primitive")
for n, v in comp.items():
    a = v["alias"]
    if a in sem:
        v["type"] = sem[a]["type"]
        v["scopes"] = sem[a]["scopes"]
        v["tier"] = "Semantic"
    elif a in resp:
        v["type"] = resp[a]["type"]
        v["scopes"] = resp[a]["scopes"]
        v["tier"] = "Responsive"
    else:
        errors.append(f"Component {n} -> {a}: not a Semantic/Responsive token")
for st in text_styles:
    for a in st["binds"].values():
        if a not in resp:
            errors.append(f"Text style {st['name']} -> {a} missing")
for es in effect_styles:
    for layer in es["layers"]:
        if layer[4] not in sem:
            errors.append(f"Effect style {es['name']} -> {layer[4]} missing")


def resolve(name, mode):
    if name in prim:
        return prim[name]["value"]
    if name in sem:
        return resolve(sem[name]["values"][mode], mode)
    raise KeyError(name)


def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def lum(h):
    h = h.lstrip("#")[:6]
    r, g, b = (lin(int(h[i:i + 2], 16)) for i in (0, 2, 4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    x, y = sorted([lum(a), lum(b)], reverse=True)
    return (x + 0.05) / (y + 0.05)


PAIRS = [
    ("color/text/primary", "color/bg/default", 4.5), ("color/text/primary", "color/bg/raised", 4.5),
    ("color/text/secondary", "color/bg/surface", 4.5), ("color/text/secondary", "color/bg/raised", 4.5),
    ("color/text/muted", "color/bg/surface", 4.5), ("color/text/muted", "color/bg/subtle", 4.5), ("color/text/muted", "color/bg/muted", 4.5),
    ("color/text/inverse", "color/bg/inverse", 4.5), ("color/text/selected", "color/bg/selected", 4.5),
    ("color/text/link", "color/bg/surface", 4.5), ("color/text/link", "color/bg/default", 4.5),
    ("color/text/on-action", "color/action/primary/default", 4.5), ("color/text/on-action", "color/action/primary/hover", 4.5),
    ("color/text/on-action", "color/action/primary/pressed", 4.5), ("color/text/on-action", "color/action/destructive/default", 4.5),
    ("color/text/primary", "color/action/secondary/default", 4.5), ("color/text/primary", "color/action/tertiary/default", 4.5),
    ("color/text/primary", "color/action/tertiary/pressed", 4.5),
    *[("color/text/on-pop", f"color/pop/{n}", 4.5) for n in POP],
    *[(f"color/feedback/{k}/text", f"color/feedback/{k}/bg", 4.5) for k in ["error", "success", "warning", "info"]],
    ("color/border/strong", "color/bg/surface", 3), ("color/border/strong", "color/bg/default", 3),
    ("color/focus/ring", "color/bg/surface", 3), ("color/focus/ring", "color/bg/default", 3),
    ("color/feedback/error/solid", "color/bg/surface", 3),
    ("color/icon/secondary", "color/bg/surface", 3), ("color/icon/muted", "color/bg/surface", 3),
    ("color/text/secondary", "color/bg/muted", 4.5), ("color/text/primary", "color/control/thumb", 4.5),
]
contrast = []
for fg, bg, need in PAIRS:
    row = {"fg": fg, "bg": bg, "need": need}
    for mode in ["Light", "Dark"]:
        r = ratio(resolve(fg, mode), resolve(bg, mode))
        row[mode] = round(r, 2)
        if r < need:
            errors.append(f"Contrast {fg} on {bg} [{mode}] = {r:.2f} < {need}")
    contrast.append(row)

if errors:
    print("VALIDATION FAILED")
    print("\n".join(errors))
    sys.exit(1)

# --------------------------------------------------------------------------
# Output
# --------------------------------------------------------------------------
out = {
    "meta": {"name": "Marketplace design system", "version": "0.3.0", "typeface": "Inter Display",
             "brand": "#3f75ff"},
    "collections": {
        "Primitives": {"modes": ["Value"], "variables": {n: {**v, "values": {"Value": v["value"]}} for n, v in prim.items()}},
        "Semantic": {"modes": ["Light", "Dark"], "variables": {n: {**v, "codeSyntax": code_syntax(n),
                     "resolved": {m: resolve(n, m) for m in ["Light", "Dark"]}} for n, v in sem.items()}},
        "Responsive": {"modes": MODES_R, "variables": {n: {**v, "codeSyntax": code_syntax(n),
                       "resolved": {m: (v["values"][m] if v["raw"] else prim[v["values"][m]]["value"]) for m in MODES_R}} for n, v in resp.items()}},
        "Component": {"modes": ["Default"], "variables": {n: {**v, "codeSyntax": code_syntax(n)} for n, v in comp.items()}},
    },
    "styles": {"text": text_styles, "effect": effect_styles, "grid": grid_styles},
    "validation": {"contrast": contrast,
                   "counts": {"Primitives": len(prim), "Semantic": len(sem), "Responsive": len(resp), "Component": len(comp),
                              "textStyles": len(text_styles), "effectStyles": len(effect_styles), "gridStyles": len(grid_styles)}},
}
for v in out["collections"]["Primitives"]["variables"].values():
    v.pop("value", None)
(HERE / "tokens.json").write_text(json.dumps(out, indent=1))
print("OK", out["validation"]["counts"])

if len(sys.argv) == 3:
    tpl = Path(sys.argv[1]).read_text()
    Path(sys.argv[2]).write_text(tpl.replace("__DATA__", json.dumps(out)))
    print("review page written")
