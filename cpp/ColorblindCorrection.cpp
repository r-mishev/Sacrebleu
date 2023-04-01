#include "ColorblindCorrection.h"

//Color Correction Algorithms
void ColorblindCorrection::LMS(float& r, float& g, float& b, std::string type)

{
    // computing LMS matrix
    float L = (17.8824 * r) + (43.5161 * g) + (4.11935 * b);
    float M = (3.45565 * r) + (27.1554 * g) + (3.86714 * b);
    float S = (0.0299566 * r) + (0.184309 * g) + (1.46709 * b);

    float rgb[3][3];

    setType(rgb, type);

    // simulating color blindness
    float l = (rgb[0][0] * L) + (rgb[0][1] * M) + (rgb[0][2] * S);
    float m = (rgb[1][0] * L) + (rgb[1][1] * M) + (rgb[1][2] * S);
    float s = (rgb[2][0] * L) + (rgb[2][1] * M) + (rgb[2][2] * S);

    // LMS to RGB matrix conversion
    float R = (0.0809444479 * l) + (-0.130504409 * m) + (0.116721066 * s);
    float G = (-0.0102485335 * l) + (0.0540193266 * m) + (-0.113614708 * s);
    float B = (-0.000365296938 * l) + (-0.00412161469 * m) + (0.693511405 * s);
    // Isolate invisible colors to color vision deficiency (calculate error matrix)
    R = r - R;
    G = g - G;
    B = b - B;
    // Shift colors towards visible spectrum (apply error modification)
    float RR = (0.0 * R) + (0.0 * G) + (0.0 * B);
    float GG = (0.7 * R) + (1.0 * G) + (0.0 * B);
    float BB = (0.7 * R) + (0.0 * G) + (1.0 * B);
    // Add compensation to original values
    R = RR + r;
    G = GG + g;
    B = BB + b;
    // Clamp values
    if (R < 0)
        R = 0;
    if (R > 255)
        R = 255;
    if (G < 0)
        G = 0;
    if (G > 255)
        G = 255;
    if (B < 0)
        B = 0;
    if (B > 255)
        B = 255;

    r = static_cast<int>(R);
    g = static_cast<int>(G);
    b = static_cast<int>(B);
};
void ColorblindCorrection::CBFS(float& r, float& g, float& b, std::string color)
{
    float h, s, l;
    RGBtoHSL(r, g, b, h, s, l);;

    float rgb[3];
    setColor(rgb, color);

    float distance = sqrt((r - rgb[0]) * (r - rgb[0]) + (g - rgb[1]) * (g - rgb[1]) + (b - rgb[2]) * (b - rgb[2]));
    //set percentage to set threshold
    float percentage = 0.3;
    float threshold = percentage * 441.67;

    if (distance < threshold)
    {
        h -= h * 0.3;
        s -= s * 0.1;
        l += l * 0.25;
    }
    else
    {
        s += s * 0.1;
        l -= l * 0.1;
    }
    HSLtoRBG(h, s, l, r, b, g);
};
void ColorblindCorrection::shiftingColors(float& r, float& g, float& b, int posX, int posY)
{
    float h, s, v;
    RGBtoHSV(r, g, b, h, s, v);

    h += ((posX + posY) % 50) / 100.0;
    s += ((posX + posY) % 50) / 100.0;
    v += ((posX + posY) % 50) / 100.0;

    if (h > 1)
        h -= 1;
    else if (h < 1)
        h += 1;

    HSVtoRBG(h, s, v, r, g, b);
};

//Auxilary methods to extend the use of the LMS and CBFS algorithms 
void ColorblindCorrection::setType(float rgb[3][3], std::string s)
{
    // Daltonization values
    float protanope[3][3] = { {0.0, 2.02344, -2.52581},
                             {0.0, 1.0, 0.0},
                             {0.0, 0.0, 1.0} };
    float deuteranope[3][3] = { {1.0, 0.0, 0.0},
                               {0.494207, 0.0, 1.24827},
                               {0.0, 0.0, 1.0} };
    float tritanope[3][3] = { {1.0, 0.0, 0.0},
                             {0.494207, 0.0, 1.24827},
                             {0.0, 0.0, 1.0} };

    if (s == "protanope")
    {
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                rgb[i][j] = protanope[i][j];
    }
    else if (s == "deuteranope")
    {
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                rgb[i][j] = deuteranope[i][j];
    }
    else
    {
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                rgb[i][j] = tritanope[i][j];
    }
};
void ColorblindCorrection::setColor(float rgb[3], std::string s)
{
    if (s == "red") {
        rgb[0] = 255;
        rgb[1] = 0;
        rgb[2] = 0;
    }
    else if (s == "green") {
        rgb[0] = 0;
        rgb[1] = 255;
        rgb[2] = 0;
    }
    else if (s == "blue") {
        rgb[0] = 0;
        rgb[1] = 0;
        rgb[2] = 255;
    }

};

//RGB encoders
void ColorblindCorrection::RGBtoHSV(float r, float g, float b, float& h, float& s, float& v)
{
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;


    float cmax = std::max(std::max(r, g), b);
    float cmin = std::min(std::min(r, g), b);
    float delta = cmax - cmin;

    //Calculating hue
    if (delta == 0) {
        h = 0;
    }
    else if (cmax == r) {
        h = fmod(((g - b) / delta), 6.0);
    }
    else if (cmax == g) {
        h = ((b - r) / delta) + 2.0;
    }
    else {
        h = ((r - g) / delta) + 4.0;
    }
    h *= 60.0;

    //Calculating saturation
    if (cmax == 0) {
        s = 0;
    }
    else {
        s = delta / cmax;
    }

    v = cmax;

};
void ColorblindCorrection::HSVtoRBG(float h, float s, float v, float& r, float& g, float& b)
{
    float c = v * s;
    float x = c * (1 - fabs(fmod(h / 60.0, 2) - 1));
    float m = v - c;

    float r1, g1, b1;
    if (h < 60) {
        r1 = c;
        g1 = x;
        b1 = 0;
    }
    else if (h < 120) {
        r1 = x;
        g1 = c;
        b1 = 0;
    }
    else if (h < 180) {
        r1 = 0;
        g1 = c;
        b1 = x;
    }
    else if (h < 240) {
        r1 = 0;
        g1 = x;
        b1 = c;
    }
    else if (h < 300) {
        r1 = x;
        g1 = 0;
        b1 = c;
    }
    else {
        r1 = c;
        g1 = 0;
        b1 = x;
    }

    r = static_cast<int>((r1 + m) * 255.0);
    g = static_cast<int>((g1 + m) * 255.0);
    b = static_cast<int> ((b1 + m) * 255.0);

    if (r < 0)
        r = 0;
    if (r > 255)
        r = 255;
    if (g < 0)
        g = 0;
    if (g > 255)
        g = 255;
    if (b < 0)
        b = 0;
    if (b > 255)
        b = 255;
};
void ColorblindCorrection::RGBtoHSL(float r, float g, float b, float& h, float& s, float& l)
{
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;


    float cmax = std::max(std::max(r, g), b);
    float cmin = std::min(std::min(r, g), b);
    float delta = cmax - cmin;

    //Calculating hue
    if (delta == 0) {
        h = 0;
    }
    else if (cmax == r) {
        h = fmod(((g - b) / delta), 6.0);
    }
    else if (cmax == g) {
        h = ((b - r) / delta) + 2.0;
    }
    else {
        h = ((r - g) / delta) + 4.0;
    }
    h *= 60.0;

    //Calculating saturation
    if (cmax == 0) {
        s = 0;
    }
    else {
        s = delta / cmax;
    }

    //Calculating lightness
    l = (cmax + cmin) / 2.000;
};
void ColorblindCorrection::HSLtoRBG(float h, float s, float l, float& r, float& g, float& b)
{
    if (s == 0) {
        r = g = b = static_cast<int>(l * 255.0);
        return;
    }

    float c = (1.0 - fabs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - fabs(fmod(h / 60.0, 2) - 1.0));
    float m = l - c / 2.0;

    float rp, gp, bp;
    if (h < 60.0) {
        rp = c;
        gp = x;
        bp = 0;
    }
    else if (h < 120.0) {
        rp = x;
        gp = c;
        bp = 0;
    }
    else if (h < 180.0) {
        rp = 0;
        gp = c;
        bp = x;
    }
    else if (h < 240.0) {
        rp = 0;
        gp = x;
        bp = c;
    }
    else if (h < 300.0) {
        rp = x;
        gp = 0;
        bp = c;
    }
    else {
        rp = c;
        gp = 0;
        bp = x;
    }

    r = static_cast<int>((rp + m) * 255.0);
    g = static_cast<int>((gp + m) * 255.0);
    b = static_cast<int>((bp + m) * 255.0);

    //clamp values
    if (r < 0)
        r = 0;
    if (r > 255)
        r = 255;
    if (g < 0)
        g = 0;
    if (g > 255)
        g = 255;
    if (b < 0)
        b = 0;
    if (b > 255)
        b = 255;


};
