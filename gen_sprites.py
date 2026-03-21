#!/usr/bin/env python3
"""
Dark Survival – High-quality pixel art sprite generator
Creates 128×64 sprite sheets (4 walk frames + 4 attack frames, each 32×32)
for warrior / gunner / mage / assassin.
"""
from PIL import Image

# ── helpers ────────────────────────────────────────────────────────────────
T   = (0,0,0,0)
OL  = (18,12,28,255)   # universal outline

SKIN   = (252,196,148,255)
SKIN_S = (212,150, 98,255)
SKIN_D = (170,105, 60,255)
WHITE  = (255,255,255,255)

def c(r,g,b,a=255): return (r,g,b,a)

def px(img,x,y,col):
    if 0<=x<img.width and 0<=y<img.height and col[3]>0:
        img.putpixel((x,y),col)

def rect(img,x1,y1,x2,y2,fill,border=None):
    for y in range(y1,y2+1):
        for x in range(x1,x2+1):
            if border and (x==x1 or x==x2 or y==y1 or y==y2):
                px(img,x,y,border)
            else:
                px(img,x,y,fill)

def hline(img,y,x1,x2,col):
    for x in range(x1,x2+1): px(img,x,y,col)

def vline(img,x,y1,y2,col):
    for y in range(y1,y2+1): px(img,x,y,col)

def shadow_blob(img, cx, y, w):
    """oval drop shadow"""
    for dx in range(-w,w+1):
        a = max(0, 60 - abs(dx)*8)
        if a>0: px(img, cx+dx, y, c(0,0,0,a))

# ══════════════════════════════════════════════════════════════════════════
#  WARRIOR  (steel-blue armour, cyan trim, long sword)
# ══════════════════════════════════════════════════════════════════════════
def draw_warrior(frame_type, fi):
    img = Image.new('RGBA',(32,32),T)

    AR  = c( 72,108,172)   # armour mid
    ARL = c(105,150,210)   # armour light
    ARD = c( 45, 68,115)   # armour dark
    TR  = c( 90,215,255)   # cyan trim
    BL  = c(230,238,252)   # blade
    BLL = c(255,255,255)   # blade highlight
    HA  = c(148, 96, 48)   # handle
    EY  = c( 80,200,255)   # eye

    # walk: alternate leg splay (dx offsets for left/right leg)
    walk = [(0,0,0,0),(-2,1,2,-1),(0,0,0,0),(2,-1,-2,1)]
    atk  = [(-1,-1),( 3, 2),( 5, 3),( 1, 1)]

    if frame_type=='walk':
        llx,lly,rlx,rly = walk[fi]
        wsx,wsy = 0,0           # sword offset
        bob = 1 if fi in(1,3) else 0
    else:
        llx,lly,rlx,rly = 0,0,0,0
        wsx,wsy = atk[fi]
        bob = 0

    by = bob  # body y-offset when striding

    # drop shadow
    shadow_blob(img,15,30,6)

    # ── BOOTS / LOWER LEGS ────────────────────────────────────────
    # left boot
    rect(img,10+llx,25+lly,14+llx,28+lly, AR,OL)
    hline(img,25+lly, 11+llx,13+llx, ARL)
    # right boot
    rect(img,17+rlx,25+rly,21+rlx,28+rly, AR,OL)
    hline(img,25+rly, 18+rlx,20+rlx, ARL)

    # ── UPPER LEGS ────────────────────────────────────────────────
    rect(img,11+llx,19+by+lly,13+llx,24+lly, ARD,OL)
    rect(img,18+rlx,19+by+rly,20+rlx,24+rly, ARD,OL)

    # ── SWORD (drawn behind left arm) ─────────────────────────────
    sx = 5+wsx;  sy = 9+by+wsy
    # blade
    rect(img,sx,sy-8,sx+1,sy+1, BL)
    vline(img,sx,sy-8,sy, BLL)
    px(img,sx,sy-8,WHITE)
    # guard
    rect(img,sx-1,sy+1,sx+2,sy+2, BL,OL)
    # handle
    rect(img,sx,sy+3,sx+1,sy+5, HA,OL)

    # ── TORSO ─────────────────────────────────────────────────────
    rect(img, 9,12+by,22,20+by, AR,OL)
    rect(img,11,13+by,17,19+by, ARL)          # chest plate
    rect(img,12,14+by,15,17+by, c(130,175,228)) # chest highlight
    vline(img,21,13+by,19+by, ARD)             # right shadow
    hline(img,20+by,9,22, TR)                  # belt

    # ── LEFT ARM ──────────────────────────────────────────────────
    arm_yo = -2 if (frame_type=='attack' and fi==0) else 0
    rect(img, 6,12+by+arm_yo, 8,19+by+arm_yo, AR,OL)
    rect(img, 6,12+by+arm_yo, 9,13+by+arm_yo, ARL,OL)  # shoulder pad

    # ── RIGHT ARM ─────────────────────────────────────────────────
    rect(img,23,12+by,25,19+by, AR,OL)
    rect(img,22,12+by,25,13+by, ARL,OL)

    # ── NECK ──────────────────────────────────────────────────────
    rect(img,13,10+by,18,12+by, SKIN,OL)

    # ── HELMET ────────────────────────────────────────────────────
    rect(img,11, 3+by,20,10+by, AR,OL)
    rect(img,12, 1+by,19, 4+by, ARL,OL)         # crest
    px(img,13,2+by,c(145,185,230))              # crest highlight
    # visor slit (dark)
    rect(img,12, 6+by,19, 8+by, ARD)
    hline(img,6+by,12,19,OL)
    # eye glow through visor
    px(img,14,7+by,EY); px(img,15,7+by,EY)
    px(img,17,7+by,EY); px(img,18,7+by,EY)
    # helmet highlights
    hline(img,4+by,12,18,c(130,170,220))

    return img

# ══════════════════════════════════════════════════════════════════════════
#  GUNNER  (tan coat, yellow scarf, long rifle)
# ══════════════════════════════════════════════════════════════════════════
def draw_gunner(frame_type, fi):
    img = Image.new('RGBA',(32,32),T)

    CO  = c(130,110, 70)   # coat mid
    COL = c(165,145,100)   # coat light
    COD = c( 90, 72, 40)   # coat dark
    SC  = c(255,235, 55)   # scarf yellow
    SCL = c(255,255,130)   # scarf highlight
    RI  = c( 50, 60, 70)   # rifle dark
    RIL = c( 90,105,115)   # rifle light
    HA  = c(255,140, 50)   # hair orange
    EY  = c( 80,210,120)   # eye green
    GL  = c(220,230, 50)   # muzzle flash

    walk = [(0,0,0,0),(-2,1,2,-1),(0,0,0,0),(2,-1,-2,1)]
    bob  = [0,1,0,1]

    if frame_type=='walk':
        llx,lly,rlx,rly = walk[fi]
        by = bob[fi]
        rsx,rsy = 0,0   # rifle offset
    else:
        llx,lly,rlx,rly = 0,0,0,0
        by = 0
        atk_r = [(0,0),(0,-1),(2,-2),(1,-1)]
        rsx,rsy = atk_r[fi]

    shadow_blob(img,15,30,5)

    # ── BOOTS ─────────────────────────────────────────────────────
    rect(img,10+llx,25+lly,14+llx,28+lly, COD,OL)
    hline(img,25+lly,11+llx,13+llx,CO)
    rect(img,17+rlx,25+rly,21+rlx,28+rly, COD,OL)
    hline(img,25+rly,18+rlx,20+rlx,CO)

    # ── UPPER LEGS ────────────────────────────────────────────────
    rect(img,11+llx,19+by+lly,13+llx,24+lly, CO,OL)
    rect(img,18+rlx,19+by+rly,20+rlx,24+rly, CO,OL)

    # ── RIFLE (behind right arm) ───────────────────────────────────
    rx = 18+rsx; ry = 10+by+rsy
    # barrel
    rect(img,rx,ry,rx+1,ry+15, RI)
    vline(img,rx,ry,ry+14, RIL)
    # stock / grip
    rect(img,rx-1,ry+10,rx+2,ry+14, RIL,OL)
    rect(img,rx-1,ry+14,rx+3,ry+16, COD,OL)
    # muzzle flash on attack frame 1-2
    if frame_type=='attack' and fi in(1,2):
        for dd in range(3):
            px(img,rx,ry-1-dd,GL if dd<2 else c(255,255,200))

    # ── TORSO/COAT ────────────────────────────────────────────────
    rect(img, 9,12+by,22,20+by, CO,OL)
    rect(img,11,13+by,17,19+by, COL)
    rect(img,12,14+by,14,16+by, c(190,170,125))
    vline(img,21,13+by,19+by, COD)
    # coat buttons
    for bi in range(3):
        px(img,16,14+by+bi*2,OL)
    # belt
    hline(img,20+by,9,22,COD)

    # ── ARMS ──────────────────────────────────────────────────────
    rect(img, 6,12+by, 8,19+by, CO,OL)
    rect(img,23,12+by,25,19+by, CO,OL)

    # ── SCARF ─────────────────────────────────────────────────────
    rect(img,10,10+by,21,13+by, SC,OL)
    hline(img,10+by,11,20,SCL)
    # scarf tail
    rect(img,10,14+by,14,17+by, SC,OL)
    px(img,13,14+by,c(220,200,30))

    # ── HEAD ──────────────────────────────────────────────────────
    rect(img,12, 3+by,19, 9+by, SKIN,OL)
    vline(img,18,4+by,8+by, SKIN_S)
    # hair
    hline(img,3+by,12,19,HA)
    hline(img,4+by,12,13,HA)
    px(img,19,4+by,HA); px(img,19,5+by,HA)
    # eyes
    px(img,14,6+by,EY); px(img,15,6+by,OL)
    px(img,17,6+by,EY); px(img,18,6+by,OL)
    # mouth
    hline(img,8+by,14,17,SKIN_S)
    # goggles on forehead
    rect(img,13,4+by,18,5+by,c(60,80,90),OL)
    px(img,14,4+by,c(100,160,200)); px(img,17,4+by,c(100,160,200))

    return img

# ══════════════════════════════════════════════════════════════════════════
#  MAGE  (purple robes, staff with crystal, orbiting spark)
# ══════════════════════════════════════════════════════════════════════════
def draw_mage(frame_type, fi):
    img = Image.new('RGBA',(32,32),T)

    RO  = c(125, 60,185)   # robe mid
    ROL = c(175,100,235)   # robe light
    ROD = c( 75, 30,115)   # robe dark
    TR  = c(200,150,255)   # trim/accent
    ST  = c(140,100, 55)   # staff wood
    CR  = c(150,255,255)   # crystal
    CRL = c(220,255,255)   # crystal bright
    HA  = c( 60, 40, 80)   # hair dark purple
    EY  = c(255,180,  0)   # eye amber/gold
    SP  = c(255,230, 80)   # spark

    walk = [(0,0,0,0),(-1,1,1,-1),(0,0,0,0),(1,-1,-1,1)]
    bob  = [0,1,0,1]

    if frame_type=='walk':
        llx,lly,rlx,rly = walk[fi]
        by = bob[fi]
        stx,sty = 0,0
    else:
        llx,lly,rlx,rly = 0,0,0,0
        by = 0
        atk_st = [(0,0),(0,-3),(-1,-5),(0,-2)]
        stx,sty = atk_st[fi]

    shadow_blob(img,15,30,6)

    # ── ROBE BOTTOM (wide) ────────────────────────────────────────
    rect(img, 8,21+by,23,28, RO,OL)
    rect(img, 9,22+by,22,27, ROL)
    vline(img,22,22+by,27,ROD)
    # robe hem
    hline(img,28,8,23,TR)
    # leg lines (subtle)
    vline(img,15,22+by,27,ROD)

    # ── TORSO ─────────────────────────────────────────────────────
    rect(img,10,12+by,21,21+by, RO,OL)
    rect(img,11,13+by,17,20+by, ROL)
    rect(img,12,14+by,14,17+by, c(195,135,250))
    vline(img,20,13+by,20+by,ROD)
    # decorative trim lines
    hline(img,13+by,10,21,TR)
    hline(img,20+by,10,21,TR)

    # ── STAFF (right side) ────────────────────────────────────────
    spx = 22+stx; spy = 3+by+sty
    vline(img,spx,spy,spy+18, ST)
    vline(img,spx+1,spy,spy+16, c(170,130,75))  # highlight
    # crystal
    rect(img,spx-1,spy-3,spx+2,spy, CR,OL)
    px(img,spx,spy-3,CRL); px(img,spx+1,spy-2,CRL)
    # crystal glow
    if frame_type=='attack' and fi in(1,2):
        for gx in range(-2,3):
            for gy in range(-2,3):
                d = abs(gx)+abs(gy)
                if d<=3:
                    a = 120-d*35
                    if a>0: px(img,spx+gx,spy-2+gy,c(150,255,255,a))

    # ── ARMS ──────────────────────────────────────────────────────
    rect(img, 6,12+by, 9,20+by, RO,OL)
    rect(img,22,12+by,26,20+by, RO,OL)
    # sleeve trim
    hline(img,20+by,6,9,TR)
    hline(img,20+by,22,26,TR)

    # ── FLOATING SPARK (magic effect) ─────────────────────────────
    import math
    angle = fi*(math.pi/2)
    sx = int(16+8*math.cos(angle)); sy = int(14+by+6*math.sin(angle))
    if frame_type=='attack':
        sx = int(16+4*math.cos(angle*2)); sy = int(12+by+4*math.sin(angle*2))
    px(img,sx,sy,SP)
    px(img,sx-1,sy,c(255,200,50,150)); px(img,sx+1,sy,c(255,200,50,150))
    px(img,sx,sy-1,c(255,200,50,150)); px(img,sx,sy+1,c(255,200,50,150))

    # ── HEAD & HAT ────────────────────────────────────────────────
    rect(img,12, 6+by,19,12+by, SKIN,OL)
    vline(img,18,7+by,11+by,SKIN_S)
    # hair
    hline(img,6+by,12,19,HA); hline(img,7+by,12,13,HA)
    px(img,19,7+by,HA)
    # eyes
    px(img,14,9+by,EY); px(img,17,9+by,EY)
    # pointy wizard hat
    # brim
    rect(img,10,6+by,21,7+by,ROD,OL)
    px(img,11,6+by,ROL); px(img,20,6+by,ROL)
    # cone
    for hi in range(6):
        x1=13-hi//2; x2=18+hi//2
        px(img,x1+1,5+by-hi,RO); px(img,x2-1,5+by-hi,RO)
        px(img,x1,5+by-hi,OL); px(img,x2,5+by-hi,OL)
        hline(img,5+by-hi,x1+1,x2-1,ROD if hi%2==0 else RO)
    # star on hat
    px(img,15,2+by,TR); px(img,16,1+by,TR); px(img,17,2+by,TR)

    return img

# ══════════════════════════════════════════════════════════════════════════
#  ASSASSIN  (dark cloak, pink accents, dual daggers)
# ══════════════════════════════════════════════════════════════════════════
def draw_assassin(frame_type, fi):
    img = Image.new('RGBA',(32,32),T)

    CL  = c( 55, 30, 50)   # cloak dark
    CLL = c( 85, 50, 75)   # cloak light
    CLD = c( 30, 15, 28)   # cloak shadow
    AC  = c(255,128,170)   # pink accent
    ACL = c(255,200,220)   # accent highlight
    DA  = c(210,215,230)   # dagger blade
    DAL = c(250,252,255)   # dagger highlight
    DAH = c(100, 60, 80)   # dagger handle
    HA  = c( 30, 25, 20)   # hair very dark
    EY  = c(255, 80,120)   # eye pink/red
    SH  = c(255,220, 80)   # shuriken gold

    walk = [(0,0,0,0),(-2,1,2,-1),(0,0,0,0),(2,-1,-2,1)]
    bob  = [0,1,0,1]

    if frame_type=='walk':
        llx,lly,rlx,rly = walk[fi]
        by = bob[fi]
        d1x,d1y = 0,0
        d2x,d2y = 0,0
    else:
        llx,lly,rlx,rly = 0,0,0,0
        by = 0
        atk1 = [(0,0),(4,1),(6,2),(2,1)]
        atk2 = [(0,0),(-3,-2),(-5,-3),(-2,-1)]
        d1x,d1y = atk1[fi]
        d2x,d2y = atk2[fi]

    shadow_blob(img,15,30,5)

    # ── LEGS (narrow, agile) ───────────────────────────────────────
    rect(img,11+llx,19+by+lly,13+llx,24+lly, CL,OL)
    rect(img,10+llx,25+lly,14+llx,28+lly, CLD,OL)
    hline(img,25+lly,11+llx,13+llx,AC)    # accent stripe on boot

    rect(img,18+rlx,19+by+rly,20+rlx,24+rly, CL,OL)
    rect(img,17+rlx,25+rly,21+rlx,28+rly, CLD,OL)
    hline(img,25+rly,18+rlx,20+rlx,AC)

    # ── RIGHT DAGGER ──────────────────────────────────────────────
    r2x = 22+d1x; r2y = 11+by+d1y
    rect(img,r2x,r2y,r2x+1,r2y+5, DA)
    vline(img,r2x,r2y,r2y+4, DAL)
    px(img,r2x,r2y,c(255,255,255))
    rect(img,r2x-1,r2y+5,r2x+2,r2y+6, DA,OL)
    rect(img,r2x,r2y+7,r2x+1,r2y+9, DAH,OL)

    # ── TORSO/CLOAK ───────────────────────────────────────────────
    rect(img, 9,12+by,22,21+by, CL,OL)
    rect(img,10,13+by,17,20+by, CLL)
    vline(img,21,13+by,20+by,CLD)
    # diagonal cloak detail
    for di in range(4):
        px(img,11+di,14+by+di,CLD)
    # accent stripe
    hline(img,13+by,9,22,AC)
    hline(img,21+by,9,22,AC)
    vline(img,15,13+by,21+by,c(AC[0],AC[1],AC[2],80))

    # ── LEFT DAGGER ───────────────────────────────────────────────
    l2x = 6+d2x; l2y = 11+by+d2y
    rect(img,l2x,l2y,l2x+1,l2y+5, DA)
    vline(img,l2x,l2y,l2y+4, DAL)
    px(img,l2x,l2y,c(255,255,255))
    rect(img,l2x-1,l2y+5,l2x+2,l2y+6, DA,OL)
    rect(img,l2x,l2y+7,l2x+1,l2y+9, DAH,OL)

    # ── ARMS ──────────────────────────────────────────────────────
    rect(img, 6,12+by, 9,20+by, CL,OL)
    rect(img,22,12+by,25,20+by, CL,OL)
    # wrapping detail
    hline(img,15+by,6,9,AC); hline(img,15+by,22,25,AC)

    # ── HOOD / HEAD ────────────────────────────────────────────────
    # Hood shadow over face
    rect(img,10, 3+by,21,12+by, CLD,OL)
    rect(img,12, 5+by,19,11+by, SKIN_S,OL)
    vline(img,18,6+by,10+by,SKIN_D)
    # deep hood shadow
    rect(img,10, 3+by,21, 6+by, CLD,OL)
    # hair strands
    hline(img,5+by,13,18,HA)
    px(img,12,6+by,HA); px(img,19,6+by,HA)
    # glowing eyes in shadow
    px(img,14,8+by,EY); px(img,15,8+by,c(EY[0],EY[1],EY[2],180))
    px(img,17,8+by,EY); px(img,18,8+by,c(EY[0],EY[1],EY[2],180))
    # eye glow aura
    px(img,14,7+by,c(255,100,140,60)); px(img,17,7+by,c(255,100,140,60))
    # mask / lower face cover
    rect(img,12,9+by,19,11+by,CL,OL)
    hline(img,10+by,12,19,AC)   # mask accent line
    # scarf/wrap on neck
    rect(img,13,12+by,18,13+by,CL,OL)

    # ── SHURIKEN (idle only, floating) ────────────────────────────
    if frame_type=='walk' and fi in(0,2):
        px(img,25,17+by,SH)
        px(img,26,16+by,SH); px(img,26,18+by,SH)
        px(img,27,17+by,SH)

    return img

# ══════════════════════════════════════════════════════════════════════════
#  SHEET BUILDER
# ══════════════════════════════════════════════════════════════════════════
CLASSES = {
    'warrior':  draw_warrior,
    'gunner':   draw_gunner,
    'mage':     draw_mage,
    'assassin': draw_assassin,
}

import os, sys
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

for name, fn in CLASSES.items():
    sheet = Image.new('RGBA',(128,64),(0,0,0,0))
    for fi in range(4):
        frame = fn('walk',   fi)
        sheet.paste(frame,(fi*32,  0), frame)
        frame = fn('attack', fi)
        sheet.paste(frame,(fi*32, 32), frame)
    path = os.path.join(OUT_DIR, f'{name}-sprite.png')
    sheet.save(path)
    print(f'✓ {path}')

print('All sprites generated.')
