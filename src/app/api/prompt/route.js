import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json(
    ```
Here is some data about the exoplanet Kepler 85 b.

Exoplanet Name :Kepler-85 b
Status :Confirmed
Radius (Rjup / Re):0.1760(Rjup)1.9728(Rearth)
Mass (Mjup / Me):0.0465(Mjup)14.7841(Mearth)
Semi Major Axis / Orbital Distance Calculated0.0789(AU)0.0789(AU Est.)
Eccentricity :0.0000
Orbital Period(Yrs)0.0227
Orbital Period(Observed/Estimated)8.31(Days Obs.)8.31(Days Est.)
Surface Gravity (G Earth)3.7987
Star Radiation at Atmospheric Boundary:137764.2(W/m2)
Measured Temperature (K)0.0(K)
Blackbody T 0.1(K)859.9(K)
Blackbody T 0.3(K)807.5(K)
Blackbody T 0.7(K)653.4(K)
Tidally Locked Blackbody T 0.1(K)1022.5(K)
Tidally Locked Blackbody T 0.3(K)960.3(K)
Size Class:super-Earth-size
Stellar Radius(Rsun) :0.9(Rsun Measured)
Stellar Mass(Msun) :0.9(Msun Measured)1.0(Msun Estimated)
Star Age :0.0(GY)
Temperature :5520(K)
Spectral type :G7
UV portion[%]:7.0
Visible portion[%]:43.4
IR portion[%]:49.7
Metalicity :0.0
Absolute Magnitude:5.6
Apparent Magnitude:15.0
Right Ascension(RA)290.9734
Declination (DEC)45.2903

Your job is to convert this data into,

a) Atmospheric Data : To render this planet, what would be it's planets scattering points, optical depth points, density falloff, wavelengths for dispersion (in nm), scattering strength, intensity, dither strength and dither scale?

b) Color Data : What would be the color of this planet? Generate a spectrum of 8 colors which would be used to visualize this planet accurately. 

Here is the C# class which is used in the frontend to generate the atmosphere, to help you. You are also supposed to come up with values for related variables.

C# Class
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static UnityEngine.Mathf;

[CreateAssetMenu (menuName = "Celestial Body/Atmosphere")]
public class AtmosphereSettings : ScriptableObject {

	public bool enabled = true;
	public Shader atmosphereShader;
	public ComputeShader opticalDepthCompute;
	public int textureSize = 256;

	public int inScatteringPoints ;
	public int opticalDepthPoints ;
	public float densityFalloff ;

	public Vector3 wavelengths;

	public Vector4 testParams;
	public float scatteringStrength;
	public float intensity;

	public float ditherStrength ;
	public float ditherScale;
	public Texture2D blueNoise;

	[Range (0, 1)]
	public float atmosphereScale = 0.5f;

	[Header ("Test")]
	public float timeOfDay;
	public float sunDst = 1;

	RenderTexture opticalDepthTexture;
	bool settingsUpToDate;

	public void SetProperties (Material material, float bodyRadius) {
		/*
		if (Application.isPlaying) {
			if (Time.time > 1) {
				timeOfDay += Time.deltaTime * 0.1f;
					var sun = GameObject.Find ("Test Sun");
			sun.transform.position = new Vector3 (Mathf.Cos (timeOfDay), Mathf.Sin (timeOfDay), 0) * sunDst;
			sun.transform.LookAt (Vector3.zero);
			}
		}
		*/
		if (!settingsUpToDate || !Application.isPlaying) {
			var sun = GameObject.Find ("Test Sun");
			if (sun) {
				sun.transform.position = new Vector3 (Mathf.Cos (timeOfDay), Mathf.Sin (timeOfDay), 0) * sunDst;
				sun.transform.LookAt (Vector3.zero);
			}

			float atmosphereRadius = (1 + atmosphereScale) * bodyRadius;

			material.SetVector ("params", testParams);
			material.SetInt ("numInScatteringPoints", inScatteringPoints);
			material.SetInt ("numOpticalDepthPoints", opticalDepthPoints);
			material.SetFloat ("atmosphereRadius", atmosphereRadius);
			material.SetFloat ("planetRadius", bodyRadius);
			material.SetFloat ("densityFalloff", densityFalloff);

			// Strength of (rayleigh) scattering is inversely proportional to wavelength^4
			float scatterX = Pow (400 / wavelengths.x, 4);
			float scatterY = Pow (400 / wavelengths.y, 4);
			float scatterZ = Pow (400 / wavelengths.z, 4);
			material.SetVector ("scatteringCoefficients", new Vector3 (scatterX, scatterY, scatterZ) * scatteringStrength);
			material.SetFloat ("intensity", intensity);
			material.SetFloat ("ditherStrength", ditherStrength);
			material.SetFloat ("ditherScale", ditherScale);
			material.SetTexture ("_BlueNoise", blueNoise);

			PrecomputeOutScattering ();
			material.SetTexture ("_BakedOpticalDepth", opticalDepthTexture);

			settingsUpToDate = true;
		}
	}

	void PrecomputeOutScattering () {
		if (!settingsUpToDate || opticalDepthTexture == null || !opticalDepthTexture.IsCreated ()) {
			ComputeHelper.CreateRenderTexture (ref opticalDepthTexture, textureSize, FilterMode.Bilinear);
			opticalDepthCompute.SetTexture (0, "Result", opticalDepthTexture);
			opticalDepthCompute.SetInt ("textureSize", textureSize);
			opticalDepthCompute.SetInt ("numOutScatteringSteps", opticalDepthPoints);
			opticalDepthCompute.SetFloat ("atmosphereRadius", (1 + atmosphereScale));
			opticalDepthCompute.SetFloat ("densityFalloff", densityFalloff);
			opticalDepthCompute.SetVector ("params", testParams);
			ComputeHelper.Run (opticalDepthCompute, textureSize, textureSize);
		}

	}

	void OnValidate () {
		settingsUpToDate = false;
	}
}

You are also supposed to generate the mesh for the terrain of the planet. Here is the scripts for the noise generator 

C# CODE - Class
[CreateAssetMenu (menuName = "Celestial Body/Earth-Like/Earth Shape")]
public class EarthShape : CelestialBodyShape {

	[Header ("Continent settings")]
	public float oceanDepthMultiplier ;
	public float oceanFloorDepth ;
	public float oceanFloorSmoothing;

	public float mountainBlend; // Determines how smoothly the base of mountains blends into the terrain

	[Header ("Noise settings")]
	public SimpleNoiseSettings continentNoise;
	public SimpleNoiseSettings maskNoise;

	public RidgeNoiseSettings ridgeNoise;
	public Vector4 testParams;

	protected override void SetShapeData () {
		var prng = new PRNG (seed);
		continentNoise.SetComputeValues (heightMapCompute, prng, "_continents");
		ridgeNoise.SetComputeValues (heightMapCompute, prng, "_mountains");
		maskNoise.SetComputeValues (heightMapCompute, prng, "_mask");

		heightMapCompute.SetFloat ("oceanDepthMultiplier", oceanDepthMultiplier);
		heightMapCompute.SetFloat ("oceanFloorDepth", oceanFloorDepth);
		heightMapCompute.SetFloat ("oceanFloorSmoothing", oceanFloorSmoothing);
		heightMapCompute.SetFloat ("mountainBlend", mountainBlend);
		heightMapCompute.SetVector ("params", testParams);

		//

	}

}

C# CODE - Class

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class SimpleNoiseSettings {
	public int numLayers ;
	public float lacunarity ;
	public float persistence ;
	public float scale;
	public float elevation;
	public float verticalShift;
	public Vector3 offset;

	// Set values using exposed settings
	public void SetComputeValues (ComputeShader cs, PRNG prng, string varSuffix) {
		SetComputeValues (cs, prng, varSuffix, scale, elevation, persistence);
	}

	// Set values using custom scale and elevation
	public void SetComputeValues (ComputeShader cs, PRNG prng, string varSuffix, float scale, float elevation) {
		SetComputeValues (cs, prng, varSuffix, scale, elevation, persistence);
	}

	// Set values using custom scale and elevation
	public void SetComputeValues (ComputeShader cs, PRNG prng, string varSuffix, float scale, float elevation, float persistence) {
		Vector3 seededOffset = new Vector3 (prng.Value (), prng.Value (), prng.Value ()) * prng.Value () * 10000;

		float[] noiseParams = {
			// [0]
			seededOffset.x + offset.x,
			seededOffset.y + offset.y,
			seededOffset.z + offset.z,
			numLayers,
			// [1]
			persistence,
			lacunarity,
			scale,
			elevation,
			// [2]
			verticalShift
		};

		cs.SetFloats ("noiseParams" + varSuffix, noiseParams);
	}
}


C# Code - new Class
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class RidgeNoiseSettings {
	public int numLayers;
	public float lacunarity;
	public float persistence;
	public float scale;
	public float power;
	public float elevation;
	public float gain;
	public float verticalShift = 0;
	public float peakSmoothing = 0;
	public Vector3 offset;

	// Set values using exposed settings
	public void SetComputeValues (ComputeShader cs, PRNG prng, string varSuffix) {
		SetComputeValues (cs, prng, varSuffix, scale, elevation, power);
	}

	// Set values using custom scale and elevation
	public void SetComputeValues (ComputeShader cs, PRNG prng, string varSuffix, float scale, float elevation, float power) {
		Vector3 seededOffset = new Vector3 (prng.Value (), prng.Value (), prng.Value ()) * prng.Value () * 10000;

		float[] noiseParams = {
			// [0]
			seededOffset.x + offset.x,
			seededOffset.y + offset.y,
			seededOffset.z + offset.z,
			numLayers,
			// [1]
			persistence,
			lacunarity,
			scale,
			elevation,
			// [2]
			power,
			gain,
			verticalShift,
			peakSmoothing
		};

		cs.SetFloats ("noiseParams" + varSuffix, noiseParams);
	}
}

You must also return another set of color values - One for the shore color (the overall color), two for the flat colors of the planet, two for the steep terrain.

These are not part of any other JSON objects. these should be separate.

Return all values for the approriate variables and settings. Modify the values you want.
Return the results in JSON format, and a separate image.

NO EXCESS TEXT. I WANT A RAW JSON.

```,
    { status: 200 }
  );
}
