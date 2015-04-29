var cmcComparation = function() {
    var _lightness = 2.0;
    var _chroma = 1.0;

    /**
     * @param colorA tinyColor
     * @param colorB tinyColor
     */
    var compare = function(colorA, colorB) {
        var aLab = tinyColorToLabObject(colorA);
        var bLab = tinyColorToLabObject(colorB);

        var deltaL = aLab.L - bLab.L;
        var h = Math.atan2(aLab.B, aLab.A);

        var c1 = Math.sqrt(aLab.A * aLab.A + aLab.B * aLab.B);
        var c2 = Math.sqrt(bLab.A * bLab.A + bLab.B * bLab.B);
        var deltaC = c1 - c2;

        var deltaH = Math.sqrt(
            (aLab.A - bLab.A) * (aLab.A - bLab.A) +
            (aLab.B - bLab.B) * (aLab.B - bLab.B) - 
            deltaC * deltaC);

        /** LOL fuck maths amirite */
        if (isNaN(deltaH)) {
            deltaH = 1.0;
        }

        var c1_4 = c1 * c1;
        c1_4 *= c1_4;
        var t = 164 <= h || h >= 345
                    ? .56 + Math.abs(.2 * Math.cos(h + 168.0))
                    : .36 + Math.abs(.4 * Math.cos(h + 35.0));
        var f = Math.sqrt(c1_4 / (c1_4 + 1900.0));

        var sL = aLab.L < 16 ? .511 : (.040975 * aLab.L) / (1.0 + .01765 * aLab.L);
        var sC = (.0638 * c1) / (1 + .0131 * c1) + .638;
        var sH = sC * (f * t + 1 - f);

        var differences = distanceDivided(deltaL, _lightness * sL) +
                          distanceDivided(deltaC, _chroma * sC) +
                          distanceDivided(deltaH, sH);

        return Math.sqrt(differences);
    }

    var distanceDivided = function(a, dividend) {
        var adiv = a / dividend;
        return adiv * adiv;
    }

    return {
        compare: compare
    }
}