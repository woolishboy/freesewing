import { name, version } from "../package.json";

export default {
  name: name,
  version: version,
  hooks: {
    preRender: function(svg) {
      if (svg.attributes.get("freesewing:plugin-round") === false)
        svg.attributes.set("freesewing:plugin-round", version);
    }
  },
  macros: {
    round: function(so) {
      const C = 0.55191502449;
      // Find angle between points
      let from = so.from;
      let to = so.to;
      let via = so.via;
      let radius = so.radius;
      let prefix = so.prefix;
      let angle1 = from.angle(via);
      let angle2 = via.angle(to);
      if((angle1-angle2)%90 !== 0)
        throw new Error("The tound macro currently only supports 90 degree angles.");
      let fd = from.dist(via);
      let td = to.dist(via);
      if(radius > fd || radius > td || typeof radius === "undefined")
        radius = fd > td ? td : fd;
      this.points[prefix+"Start"] = via.shiftTowards(from, radius);
      this.points[prefix+"Cp1"] = via.shiftTowards(from, radius*(1-C));
      this.points[prefix+"Cp2"] = via.shiftTowards(to, radius*(1-C));
      this.points[prefix+"End"] = via.shiftTowards(to, radius);
      this.paths[prefix+"Rounded"] = new this.Path()
        .move(this.points[prefix+"Start"])
        .curve(
          this.points[prefix+"Cp1"],
          this.points[prefix+"Cp2"],
          this.points[prefix+"End"]
        )
        .attr("class", so.class ? so.class : "");
      if(typeof so.render !== undefined && so.render) this.paths[prefix+"Rounded"].render = true;
      else this.paths[prefix+"Rounded"].render = false;
    }
  }
};