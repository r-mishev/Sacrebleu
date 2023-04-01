#pragma once
#include <string>

class ColorblindCorrection
{
public:
	void LMS(float& r, float& g, float& b, std::string type = "protanope");
	void CBFS(float& r, float& g, float& b, std::string color = "red");
	void shiftingColors(float& r, float& g, float& b, int posX, int posY);
private:
	//auxiliary selectors
	void setType(float rgb[3][3], std::string s);
	void setColor(float rgb[3], std::string s);
	//RGB convertors
	void RGBtoHSV(float r, float g, float b, float& h, float& s, float& v);
	void HSVtoRBG(float h, float s, float v, float& r, float& g, float& b);
	void RGBtoHSL(float r, float g, float b, float& h, float& s, float& l);
	void HSLtoRBG(float h, float s, float l, float& r, float& g, float& b);
};

