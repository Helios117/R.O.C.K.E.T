precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D source;

float rand2D(in vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float randFloat (vec2 uv){
    return fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453123);
    }

float dotNoise2D(in float x, in float y, in float fractionalMaxDotSize, in float dDensity)
{
    float integer_x = x - fract(x);
    float fractional_x = x - integer_x;

    float integer_y = y - fract(y);
    float fractional_y = y - integer_y;

    if (rand2D(vec2(integer_x+1.0, integer_y +1.0)) > dDensity)
       {return 0.0;}

    float xoffset = (rand2D(vec2(integer_x, integer_y)) -0.5);
    float yoffset = (rand2D(vec2(integer_x+1.0, integer_y)) - 0.5);
    float dotSize = 0.5 * fractionalMaxDotSize * max(0.25,rand2D(vec2(integer_x, integer_y+1.0)));

    vec2 truePos = vec2 (0.5 + xoffset * (1.0 - 2.0 * dotSize) , 0.5 + yoffset * (1.0 -2.0 * dotSize));

    float distance = length(truePos - vec2(fractional_x, fractional_y));

    return 1.0 - smoothstep (0.3 * dotSize, 1.0* dotSize, distance);

}
float DotNoise2D(in vec2 coord, in float wavelength, in float fractionalMaxDotSize, in float dDensity)
{
   return dotNoise2D(coord.x/wavelength, coord.y/wavelength, fractionalMaxDotSize, dDensity);
}

float noise(vec2 p, float freq ){
	float unit = u_resolution.x/freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(3.14159265358979323846*xy));
	float a = randFloat((ij+vec2(0.,0.)));
	float b = randFloat((ij+vec2(1.,0.)));
	float c = randFloat((ij+vec2(0.,1.)));
	float d = randFloat((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}


float pNoise(vec2 p, int res){
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<50; i++){
		n+=amp*noise(p, f);
		f*=2.;
		normK+=amp;
		amp*=persistance;
		if (iCount == res) break;
		iCount++;
	}
	float nf = n/normK;
	return nf*nf*nf*nf;
}

float normalnoise(vec2 p) {
    return pNoise(p, 1024) * 0.5 + 0.5;
}

float nebulanoise(vec2 p, float i){
    vec2 offset = vec2(randFloat(vec2(i))*1000.0);
    p += offset;
    const int steps = 10;
    float scale = pow(2.0, float(steps));
    float displace = 2.0;
    for (int i = 0; i < steps; i++) {
        displace = normalnoise(p * scale + displace);
        scale *= 0.5;
    }
    return normalnoise(p + displace);
}

vec4 nebula(vec3 color, float i){
    vec2 vUV = (gl_FragCoord.xy*2.0-u_resolution.xy)/u_resolution.y;
    float scale = 1.5, density = 0.4, falloff = 5.0;
    vec3 s = texture2D(source, vUV).rgb;
    float n = nebulanoise(gl_FragCoord.xy * scale * 1.0, i);
    n = pow(n + density, falloff);
    //gl_FragColor = vec4(mix(s, color, n), 1.0);
    return vec4(mix(s, color, n), 1.0);
}

vec4 stars(vec3 coreColor, vec3 haloColor, 
vec2 center, vec2 resolution,
float coreRadius, float haloFalloff, float scale){
    float d = length(gl_FragCoord.xy - center * resolution) / scale;
    if (d <= coreRadius) {
        return (vec4(1.0) + vec4(coreColor, 1.0))/1.2;
    }

    float e = 1.0 - exp(-(d - coreRadius) * haloFalloff);
    vec3 rgb = mix(coreColor, haloColor, e);
    rgb = mix(rgb, vec3(0,0,0), e);

    return vec4(rgb, 1.0);
}

void main(){
    
    vec2 uv=gl_FragCoord.xy/u_resolution.xy;

    vec2 vUV=(gl_FragCoord.xy*2.0-u_resolution.xy)/u_resolution.y;
    float noise=DotNoise2D(vec2(gl_FragCoord),0.11,1.,0.1);
    vec4 finalcolor = vec4(0.0,0.0,0.0,1.0);
    /*
    //Rendering larger stars
    for (float i = 0.0; i < 3.0; i++){
        float r = randFloat(vec2(i+1.0));
        float g = randFloat(vec2(i+2.0));
        float b = randFloat(vec2(i+3.0));
        vec3 coreColor = vec3(r,g,b);
        vec3 haloColor = vec3(r+0.1, g+0.1, b+0.1);
        
        vec2 centre = vec2(randFloat(vec2(i))*160.0, randFloat(vec2(i+10.0))*90.0);

        vec4 starColor = stars(coreColor, haloColor, centre, vec2(10.0), 4.0, .05, 3.0);
        if (starColor.x != 0.){
            finalcolor = (finalcolor + starColor*15.0);
        }
    }
    */
    //Rendering nebulae
    for (float i = 0.0; i < 4.0; i++){
        float r = randFloat(vec2(i+1.0));
        float g = randFloat(vec2(i+2.0));
        float b = randFloat(vec2(i+3.0));
        vec3 seedColor = vec3(0.66*r, 0.04*g, 0.92*b);
        finalcolor = (finalcolor + nebula(seedColor, i+1.0)) / 2.0;
    }

    //Rendering point stars
    if (noise == 1.0){
        float r = randFloat(uv);
        float g = randFloat(uv+uv);
        float b = randFloat(uv+uv+uv);
        float brightness = randFloat(vUV);
        //gl_FragColor = vec4(r, g, b, brightness);
        finalcolor += vec4(r,g,b,brightness);
    }
    

    gl_FragColor = finalcolor;
    
}