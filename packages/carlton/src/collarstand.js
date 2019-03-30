export default function(part) {
  let { paperless, sa, snippets, Snippet, utils, store, complete, points, measurements, options, macro, Point, paths, Path } = part.shorthand();

  let height = measurements.chestCircumference * options.collarHeight;
  let length = store.get("frontCollarLength") + store.get("backCollarLength");
  points.topLeft = new Point(0, 0);
  points.bottomLeft = new Point(0, height);
  points.topRight = new Point(length, height * -1 * options.collarFlare);
  points.bottomRight = new Point(length, height)
  points.bottomLeftCp = points.bottomLeft.shift(0, points.bottomRight.x * 0.4);
  points.standTop = points.bottomLeft.shiftFractionTowards(points.topLeft, 0.25);
  points.standTip = new Point(points.topRight.x * 0.75, points.bottomLeft.y + points.topRight.x/8.5);
  points.standTipCp = points.standTip.shift(180, points.standTop.dy(points.bottomLeft));
  points.standTopCp = points.standTop.shift(0, points.standTip.x * 0.9);

  for (let i of ["standTopCp", "standTip", "standTipCp", "bottomLeftCp"]) {
    points[i+"Left"] = points[i].flipX();
  }

  paths.seam = new Path()
    .move(points.bottomLeft)
    .curve(points.bottomLeftCp, points.standTipCp, points.standTip)
    ._curve(points.standTopCp, points.standTop)
    .curve_(points.standTopCpLeft, points.standTipLeft)
    .curve(points.standTipCpLeft, points.bottomLeftCpLeft, points.bottomLeft)
    .close()
    .attr("class", "fabric");

  if (complete) {
    points.title = points.bottomLeftCp.clone();
    macro("title", {
      at: points.title,
      nr: 7,
      title: "collarStand"
    });

    macro("grainline", {
      from: points.bottomLeft,
      to: points.standTop
    });

    if (sa) paths.sa = paths.seam.offset(sa).attr("class", "fabric sa");

    if (paperless) {
      macro("hd", {
        from: points.standTipLeft,
        to: points.standTip,
        y: points.standTip.y + sa + 15
      });
      macro("vd", {
        from: points.bottomLeft,
        to: points.standTop,
        x: points.standTip.x + sa + 15
      });
      macro("vd", {
        from: points.standTip,
        to: points.standTop,
        x: points.standTip.x + sa + 30
      });
    }
  }

  return part;
}