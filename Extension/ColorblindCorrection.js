let severity = 1;

//Auxiliary methods to extend the use of the algorithms
function setType(flag) {
    // Daltonization values
    const protanope = [
        [0.0, 2.02344, -2.52581],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0]
    ];
    const deuteranope = [
        [1.0, 0.0, 0.0],
        [0.494207, 0.0, 1.24827],
        [0.0, 0.0, 1.0]
    ];
    const tritanope = [
        [1.0, 0.0, 0.0],
        [0.494207, 0.0, 1.24827],
        [0.0, 0.0, 1.0]
    ];

    if (flag === 1) {
        return protanope;
    }
    else if (flag === 2) {
        return deuteranope
    }
    else {
        return tritanope;
    }
};
function setColor(flag) {
    let rgb = [];
    if (flag === 1) {
        rgb[0] = 255;
        rgb[1] = 0;
        rgb[2] = 0;
    } else if (flag === 2) {
        rgb[0] = 0;
        rgb[1] = 255;
        rgb[2] = 0;
    } else {
        rgb[0] = 0;
        rgb[1] = 0;
        rgb[2] = 255;
    }

    return rgb;
};

function setSeverity(s) {
    severity = s;
}

function getSeverity() {
    return severity;
}

//RGB encoders
function RGBtoHSV(r, g, b) {
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;

    let cmax = Math.max(r, g, b);
    let cmin = Math.min(r, g, b);
    let delta = cmax - cmin;

    //Calculating hue
    if (delta == 0) {
        h = 0;
    } else if (cmax == r) {
        h = ((g - b) / delta) % 6.0;
    } else if (cmax == g) {
        h = ((b - r) / delta) + 2.0;
    } else {
        h = ((r - g) / delta) + 4.0;
    }
    h *= 60.0;

    //Calculating saturation
    if (cmax == 0) {
        s = 0;
    } else {
        s = delta / cmax;
    }
    v = cmax;

    return [h, s, v];
}
function HSVtoRGB(h, s, v) {
    let c = v * s;
    let x = c * (1 - Math.abs((h / 60.0) % 2 - 1));
    let m = v - c;

    let r1, g1, b1;
    if (h < 60) {
        r1 = c;
        g1 = x;
        b1 = 0;
    } else if (h < 120) {
        r1 = x;
        g1 = c;
        b1 = 0;
    } else if (h < 180) {
        r1 = 0;
        g1 = c;
        b1 = x;
    } else if (h < 240) {
        r1 = 0;
        g1 = x;
        b1 = c;
    } else if (h < 300) {
        r1 = x;
        g1 = 0;
        b1 = c;
    } else {
        r1 = c;
        g1 = 0;
        b1 = x;
    }

    r = Math.round((r1 + m) * 255.0);
    g = Math.round((g1 + m) * 255.0);
    b = Math.round((b1 + m) * 255.0);

    if (r < 0) r = 0;
    if (r > 255) r = 255;
    if (g < 0) g = 0;
    if (g > 255) g = 255;
    if (b < 0) b = 0;
    if (b > 255) b = 255;

    return [r, g, b];
}
function RGBtoHSL(r, g, b, h, s, l) {
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;

    const cmax = Math.max(r, g, b);
    const cmin = Math.min(r, g, b);
    const delta = cmax - cmin;

    //Calculating hue
    if (delta == 0) {
        h = 0;
    } else if (cmax == r) {
        h = ((g - b) / delta) % 6.0;
    } else if (cmax == g) {
        h = (b - r) / delta + 2.0;
    } else {
        h = (r - g) / delta + 4.0;
    }
    h *= 60.0;

    console.log(h);

    //Calculating saturation
    if (cmax == 0) {
        s = 0;
    } else {
        s = delta / cmax;
    }

    //Calculating lightness
    l = (cmax + cmin) / 2.0;

    return [h, s, l];
}
function HSLtoRGB(h, s, l) {
    if (s == 0) {
        const value = Math.round(l * 255.0);
        return [value, value, value];
    }

    const c = (1.0 - Math.abs(2.0 * l - 1.0)) * s;
    const x = c * (1.0 - Math.abs(((h / 60.0) % 2) - 1.0));
    const m = l - c / 2.0;

    let rp, gp, bp;
    if (h < 60.0) {
        rp = c;
        gp = x;
        bp = 0;
    } else if (h < 120.0) {
        rp = x;
        gp = c;
        bp = 0;
    } else if (h < 180.0) {
        rp = 0;
        gp = c;
        bp = x;
    } else if (h < 240.0) {
        rp = 0;
        gp = x;
        bp = c;
    } else if (h < 300.0) {
        rp = x;
        gp = 0;
        bp = c;
    } else {
        rp = c;
        gp = 0;
        bp = x;
    }

    r = Math.round((rp + m) * 255.0);
    g = Math.round((gp + m) * 255.0);
    b = Math.round((bp + m) * 255.0);

    //clamp values
    r = Math.min(Math.max(r, 0), 255);
    g = Math.min(Math.max(g, 0), 255);
    b = Math.min(Math.max(b, 0), 255);

    return [r, g, b];
}

//Colorblindness Correction Alorithms
function LMS(r, g, b, flag = 1) {
    // computing LMS matrix
    let L = (17.8824 * r) + (43.5161 * g) + (4.11935 * b);
    let M = (3.45565 * r) + (27.1554 * g) + (3.86714 * b);
    let S = (0.0299566 * r) + (0.184309 * g) + (1.46709 * b);

    let rgb = [
        [0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0]
    ];

    rgb = setType(flag);

    // simulating color blindness
    let l = (rgb[0][0] * L) + (rgb[0][1] * M) + (rgb[0][2] * S);
    let m = (rgb[1][0] * L) + (rgb[1][1] * M) + (rgb[1][2] * S);
    let s = (rgb[2][0] * L) + (rgb[2][1] * M) + (rgb[2][2] * S);

    // LMS to RGB matrix conversion
    let R = (0.0809444479 * l) + (-0.130504409 * m) + (0.116721066 * s);
    let G = (-0.0102485335 * l) + (0.0540193266 * m) + (-0.113614708 * s);
    let B = (-0.000365296938 * l) + (-0.00412161469 * m) + (0.693511405 * s);

    // Isolate invisible colors to color vision deficiency (calculate error matrix)
    R = r - R;
    G = g - G;
    B = b - B;

    // Shift colors towards visible spectrum (apply error modification)
    let RR = (0.0 * R) + (0.0 * G) + (0.0 * B);
    let GG = (0.7 * R) + (1.0 * G) + (0.0 * B);
    let BB = (0.7 * R) + (0.0 * G) + (1.0 * B);

    // Add compensation to original values
    R = RR + r;
    G = GG + g;
    B = BB + b;

    // Clamp values
    if (R < 0) R = 0;
    if (R > 255) R = 255;
    if (G < 0) G = 0;
    if (G > 255) G = 255;
    if (B < 0) B = 0;
    if (B > 255) B = 255;

    r = Math.floor(R);
    g = Math.floor(G);
    b = Math.floor(B);

    console.log(r, g, b);

    return [r, g, b];
}
function CBFS(r, g, b, flag = 1) {
    let h = 0, s = 0, l = 0;
    [h, s, l] = RGBtoHSL(r, g, b);

    let rgb = setColor(flag);

    const distance = Math.sqrt((r - rgb[0]) * (r - rgb[0]) + (g - rgb[1]) * (g - rgb[1]) + (b - rgb[2]) * (b - rgb[2]));
    const threshold = 0.3 * 441.67;

    if (distance < threshold) {
        h -= h * 0.3;
        s -= s * 0.1;
        l += l * 0.25;
    } else {
        s += s * 0.1;
        l -= l * 0.1;
    }
    [r, g, b] = HSLtoRGB(h, s, l);

    console.log(r, g, b);
    return [r, g, b];
}
function shiftingColors(r, g, b, posX, posY) {
    let h, s, v;
    [h, s, v] = RGBtoHSV(r, g, b);

    h += ((posX + posY) % 50) / 100.0;
    s += ((posX + posY) % 50) / 100.0;
    v += ((posX + posY) % 50) / 100.0;

    if (h > 1)
        h -= 1;
    else if (h < 1)
        h += 1;

    [r, g, b] = HSVtoRGB(h, s, v);
}

function adjustForSeverity(r1, g1, b1, r2, g2, b2, severity) {
    r2 = severity * r1 + (1 - severity) * r2;
    g2 = severity * g1 + (1 - severity) * g2;
    b2 = severity * b1 + (1 - severity) * b2;

    return [r2, g2, b2];
}

function execute(r, g, b, algorithm, flag = 1, x = 0, y = 0) {
    if ([r, g, b] == [0, 0, 0] || [r, g, b] == [255, 255, 255])
        return;

    let r1 = r;
    let g1 = g;
    let b1 = b;

    switch (algorithm) {
        case "LMS":
            [r, g, b] = LMS(r, g, b, flag);
            break;
        case "CFBS":
            [r, g, b] = CBFS(r, g, b, flag);
            break;
        case "SHIFT":
            shiftingColors(r, g, b, x, y);
            break;
    }

    [r1, g1, b1] = adjustForSeverity(r1, g1, b1, r, g, b, getSeverity());

    return [r1, g1, b1];
}