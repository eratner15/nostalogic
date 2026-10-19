"""Printable TPU skin for the M5Stack StickS3: a pebble with two ears and a keyring loop.

The StickS3 (48 x 24 x 15 mm) slides in through the open back. Print in TPU 95A
(soft and stretchy) or PLA for a fit check. Cutout positions are estimates: check them
against M5Stack's StickS3 3D model before you order more than one print.

Axes: x = width, y = height (ears up, USB-C down), z = depth (screen faces +z).
Run: python3 hatchling/hardware/shell/sticks3_sleeve.py  (writes build/sticks3_sleeve.stl and a preview PNG)
"""

import os

import numpy as np
import trimesh
from manifold3d import Manifold

# Device size plus a 0.3 mm gap on each side.
DEV_W, DEV_H, DEV_D = 24.0, 48.0, 15.0
GAP = 0.3
WALL = 2.2

# Estimated front layout (confirm on the real device).
SCREEN_W, SCREEN_H, SCREEN_Y = 17.0, 27.0, 7.0   # window centred 7 mm above the middle
BUTTON_R, BUTTON_Y = 6.0, -15.0                   # KEY1 under the screen
USB_W, USB_H = 10.0, 4.5                          # USB-C slot in the bottom wall
SIDE_SLOT_H, SIDE_SLOT_D, SIDE_SLOT_Y = 10.0, 5.0, 8.0


def rounded_box(w, h, d, r):
    """Box with all edges rounded to radius r, centred on the origin."""
    hx, hy, hz = w / 2 - r, h / 2 - r, d / 2 - r
    corners = [Manifold.sphere(r, 32).translate([sx * hx, sy * hy, sz * hz])
               for sx in (-1, 1) for sy in (-1, 1) for sz in (-1, 1)]
    return Manifold.batch_hull(corners)


def cube(w, h, d, center):
    return Manifold.cube([w, h, d], center=True).translate(center)


def build():
    iw, ih, idp = DEV_W + 2 * GAP, DEV_H + 2 * GAP, DEV_D + 2 * GAP
    ow, oh, od = iw + 2 * WALL, ih + 2 * WALL, idp + 2 * WALL

    body = rounded_box(ow + 4, oh + 2, od + 2, 7.0)  # a little extra bulge for a pebble look
    for sx in (-1, 1):  # ears
        body = body + Manifold.sphere(5.5, 32).scale([1.0, 1.25, 0.7]).translate([sx * 9.5, oh / 2 + 2.5, 0])
    loop = Manifold.cylinder(4.0, 6.0, 6.0, 48, center=True) - Manifold.cylinder(4.2, 3.0, 3.0, 48, center=True)
    body = body + loop.rotate([0, 90, 0]).translate([0, oh / 2 + 4.5, 0])

    cavity = rounded_box(iw, ih, idp, 1.5)
    cuts = [
        cavity,
        cube(iw - 6, ih - 10, 20, [0, 0, -idp / 2 - 5]),                       # open back: slide in
        cube(SCREEN_W, SCREEN_H, 20, [0, SCREEN_Y, idp / 2 + 5]),              # screen window
        Manifold.cylinder(20, BUTTON_R, BUTTON_R, 48).translate([0, BUTTON_Y, 0]),  # KEY1
        cube(USB_W, 20, USB_H, [0, -ih / 2 - 5, 0]),                           # USB-C
        cube(20, SIDE_SLOT_H, SIDE_SLOT_D, [ow / 2 + 5, SIDE_SLOT_Y, 0]),       # right key
        cube(20, SIDE_SLOT_H, SIDE_SLOT_D, [-ow / 2 - 5, SIDE_SLOT_Y, 0]),      # left reset
    ]
    for c in cuts:
        body = body - c
    return body


def to_trimesh(m):
    mesh = m.to_mesh()
    return trimesh.Trimesh(vertices=np.asarray(mesh.vert_properties)[:, :3], faces=np.asarray(mesh.tri_verts))


def preview(mesh, path):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection

    fig = plt.figure(figsize=(12, 5), facecolor="white")
    views = [("Front", 90, -90), ("Three-quarter", 25, -60), ("Back", -90, -90)]
    tris = mesh.vertices[mesh.faces]
    for i, (title, elev, azim) in enumerate(views):
        ax = fig.add_subplot(1, 3, i + 1, projection="3d")
        pc = Poly3DCollection(tris, facecolor="#f2c9a0", edgecolor="#9c7a5a", linewidths=0.05)
        ax.add_collection3d(pc)
        lim = 34
        ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim); ax.set_zlim(-lim, lim)
        ax.set_box_aspect([1, 1, 1])
        ax.view_init(elev=elev, azim=azim)
        ax.set_axis_off()
        ax.set_title(title)
    fig.suptitle("StickS3 skin v0 (TPU), about %.0f x %.0f x %.0f mm" % tuple(mesh.extents), fontsize=12)
    fig.savefig(path, dpi=110, bbox_inches="tight")


def main():
    out = os.path.join(os.path.dirname(__file__), "..", "..", "build")
    os.makedirs(out, exist_ok=True)
    mesh = to_trimesh(build())
    stl = os.path.join(out, "sticks3_sleeve.stl")
    mesh.export(stl)
    preview(mesh, os.path.join(out, "sticks3_sleeve.png"))
    print(f"wrote {stl}: {mesh.extents.round(1)} mm, watertight={mesh.is_watertight}")


if __name__ == "__main__":
    main()
