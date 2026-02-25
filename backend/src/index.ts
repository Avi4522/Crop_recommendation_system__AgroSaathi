import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const app = express();
const isVercel = process.env.VERCEL === '1';

let prismaUrl = 'file:./dev.db';
if (isVercel) {
  // Vercel deployment could have different working directories based on build settings
  const possiblePaths = [
    path.join(process.cwd(), 'backend', 'prisma', 'dev.db'),
    path.join(__dirname, '..', 'prisma', 'dev.db'),
    path.join(__dirname, 'backend', 'prisma', 'dev.db'),
    path.join(process.cwd(), 'prisma', 'dev.db') // if nested
  ];

  let foundDbPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      foundDbPath = p;
      break;
    }
  }

  if (foundDbPath) {
    const targetDb = '/tmp/dev.db';
    try {
      if (!fs.existsSync(targetDb)) {
        fs.copyFileSync(foundDbPath, targetDb);
      }
      prismaUrl = `file:${targetDb}`;
      console.log(`Vercel DB effectively moved and bound to: ${targetDb}`);
    } catch (e) {
      console.error('Failed to copy sqlite file to tmp', e);
      prismaUrl = `file:${foundDbPath}`; // Fallback if copy fails
    }
  } else {
    console.error('CRITICAL: SQLite db not found anywhere in Vercel bundle. Ensure vercel.json `includeFiles` is correct.');
  }
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: prismaUrl
    }
  }
});

app.use(cors());
app.use(express.json());

// Get all districts
app.get('/api/districts', async (req, res) => {
  try {
    const districts = await prisma.district.findMany();
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch districts' });
  }
});

// Get all crops
app.get('/api/crops', async (req, res) => {
  try {
    const crops = await prisma.crop.findMany();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
});

// Calculate and Recommend Crops
app.post('/api/recommend', async (req, res) => {
  try {
    const { districtName, talukaName, soilType, waterAvailability, farmSize, budget, experienceLevel, temperature, season } = req.body;

    const crops = await prisma.crop.findMany();
    // Case-insensitive lookup or exact match depending on DB, exact match is fine since we hardcode
    const district = await prisma.district.findFirst({ where: { name: districtName } });

    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }

    // Advanced Recommendation Logic (MVP simplified)
    const recommendations = crops.map(crop => {
      let score = 100;
      let tempAlert = null;

      // Taluka match (Hyper-local precision)
      if (talukaName && crop.suitableTalukas) {
        if (crop.suitableTalukas.includes(talukaName)) {
          score += 20; // Bonus for explicit taluka match
        } else {
          score -= 10; // REDUCED Penalty if not explicitly suitable for this specific taluka (allows more crops to surface)
        }
      }

      // Soil match
      if (!crop.suitableSoilTypes.includes(soilType)) score -= 30;

      // Water match based on rainfall vs requirement (simplified)
      if (crop.waterReqLitersHec > (district.avgRainfallMm * 1000) && waterAvailability === 'Rain-fed') {
        score -= 40;
      }

      // Season Biological Match (New Feature)
      if (season && crop.suitableSeasons) {
        if (!crop.suitableSeasons.includes(season)) {
          score -= 60; // Strictly penalize if the crop cannot be grown in this season
        } else {
          score += 10; // Bonus for explicit season match
        }
      }

      // Temperature Biological Match (New Feature)
      if (temperature !== undefined && temperature !== null) {
        if (temperature < crop.optimalTempMin) {
          score -= 50; // Heavily penalize if it's too cold
          tempAlert = "Too Cold";
        } else if (temperature > crop.optimalTempMax) {
          score -= 50; // Heavily penalize if it's too hot
          tempAlert = "Too Hot";
        } else {
          score += 10; // Bonus for being in the perfect temperature range
          tempAlert = "Optimal Temp";
        }
      }

      // Experience level match
      if (crop.difficultyLevel > 3 && experienceLevel === 'Beginner') score -= 20;

      // Cost match vs budget
      const totalEstimatedCost = (crop.costSeedHec + crop.costFertilizerHec + crop.costLaborHec + crop.costOtherHec) * farmSize;
      if (totalEstimatedCost > budget) score -= 50;

      // Ensure score stays within bounds
      score = Math.max(0, score);

      // Profit estimation
      const estimatedRevenue = (crop.yieldMinQuintalHec + crop.yieldMaxQuintalHec) / 2 * 5000 * farmSize; // Assume flat 5000/quintal for MVP
      const estimatedProfit = estimatedRevenue - totalEstimatedCost;

      return {
        crop,
        suitabilityScore: score,
        estimatedCost: totalEstimatedCost,
        estimatedRevenue,
        estimatedProfit,
        tempAlert: tempAlert, // Pass up alert for UI
        breakdown: {
          talukaMatch: (talukaName && crop.suitableTalukas && crop.suitableTalukas.includes(talukaName)) ? true : false,
          soil: crop.suitableSoilTypes.includes(soilType) ? 5 : 2,
          water: score > 50 ? 4 : 2,
          budget: totalEstimatedCost <= budget ? 5 : 1
        }
      };
    });

    // Filter out completely inviable crops (score 0), then sort by score and profit
    const viableRecommendations = recommendations.filter(r => r.suitabilityScore > 0);
    viableRecommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore || b.estimatedProfit - a.estimatedProfit);

    // RETURN ALL VIABLE CROPS instead of artificially slicing to the top 5
    res.json(viableRecommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Recommendation engine failed' });
  }
});

// Market Profit Prediction Engine
app.post('/api/predict-profit', async (req, res) => {
  try {
    const { crop, district, currentPrice, msp, expectedYield, season } = req.body;

    // In a full production app, this would query a timeseries DB of APMC mandates.
    // For MVP, we simulate an AI analyzing historical variations (±10% to ±30% swings).

    // Simulate last 3 years of historical prices leading up to current price
    const generateHistorical = (base: number) => {
      return [
        base * (1 - (Math.random() * 0.2)), // Year -3
        base * (1 + (Math.random() * 0.15 - 0.05)), // Year -2
        base * (1 + (Math.random() * 0.25 - 0.1)), // Year -1
      ].map(val => Math.round(val));
    };

    const historicalPrices = generateHistorical(currentPrice);

    // AI Prediction Logic (Simulated Math Model)
    // Factoring Seasonality + MSP safety net + Historical Volatility (Randomized for MVP demo)
    const volatilityDelta = (Math.random() * 0.15) - 0.05; // -5% to +10% typical shift
    let predictedPrice = Math.round(currentPrice * (1 + volatilityDelta));

    // Determine Risk Level algorithmically
    // High Risk: Current price is far below MSP, or historical volatility is massive
    // Low Risk: Current price safely above MSP, steady growth
    let riskLevel = "Medium";
    if (msp > 0) {
      if (currentPrice < msp * 0.9) riskLevel = "High";
      else if (currentPrice > msp * 1.15 && volatilityDelta > 0) riskLevel = "Low";
    }

    // Cost/Revenue Math
    const revenuePerAcre = predictedPrice * expectedYield;

    // Approximate cultivation cost for MVP (Using a flat baseline multiplied by yield intensity)
    const estimatedCostPerAcre = expectedYield * 1200; // rough baseline cost
    const profitPerAcre = revenuePerAcre - estimatedCostPerAcre;

    res.json({
      crop,
      predictedPrice,
      revenuePerAcre,
      profitPerAcre,
      riskLevel,
      historicalPrices
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Market prediction engine failed' });
  }
});

// AI Fertilizer Recommendation Engine
app.post('/api/recommend-fertilizer', async (req, res) => {
  try {
    const { crop, nitrogen, phosphorus, potassium, ph, soilType } = req.body;

    // Standard Baseline Requirements (kg/ha)
    // In production, this would be meticulously mapped per crop. For MVP we use generic high-yield averages.
    const idealN = 120;
    const idealP = 60;
    const idealK = 40;

    // Calculate Deficiencies
    const defN = Math.max(0, idealN - nitrogen);
    const defP = Math.max(0, idealP - phosphorus);
    const defK = Math.max(0, idealK - potassium);

    // Calculate Fertilizer Quantities (Advanced)
    // Urea (46% N) -> kg needed = N def / 0.46
    // DAP (18% N, 46% P) -> Provides both N and P
    // SSP (Single Super Phosphate) (16% P, 11% S) -> Cheaper alternative for P
    // MOP (Muriate of Potash) (60% K)
    // NPK 12:32:16 Complex -> Balanced option if all three are deficient

    let ureaKg = 0;
    let dapKg = 0;
    let sspKg = 0;
    let mopKg = 0;
    let npkComplexKg = 0;

    let remainingN = defN;
    let remainingP = defP;
    let remainingK = defK;

    // Logic: If all high deficiency, suggest NPK Complex 12:32:16
    if (remainingN > 20 && remainingP > 20 && remainingK > 15) {
      // Use NPK complex primarily for P and K
      npkComplexKg = Math.min(remainingP / 0.32, remainingK / 0.16);
      remainingN -= (npkComplexKg * 0.12);
      remainingP -= (npkComplexKg * 0.32);
      remainingK -= (npkComplexKg * 0.16);
    }

    // Resolve remaining P with SSP or DAP
    if (remainingP > 0) {
      if (ph > 7.5) {
        // Alkaline soil -> SSP preferred (contains Sulphur which helps acidify)
        sspKg = remainingP / 0.16;
        remainingP = 0;
      } else {
        // Normal soil -> DAP
        dapKg = remainingP / 0.46;
        remainingN -= (dapKg * 0.18); // DAP also gives Nitrogen
        remainingP = 0;
      }
    }

    // Resolve remaining N with Urea
    if (remainingN > 0) {
      ureaKg = remainingN / 0.46;
    }

    // Resolve remaining K with MOP
    if (remainingK > 0) {
      mopKg = remainingK / 0.60;
    }

    // Convert kg/ha to kg/acre roughly (divide by 2.47)
    ureaKg = Math.round(Math.max(0, ureaKg) / 2.47);
    dapKg = Math.round(Math.max(0, dapKg) / 2.47);
    sspKg = Math.round(Math.max(0, sspKg) / 2.47);
    mopKg = Math.round(Math.max(0, mopKg) / 2.47);
    npkComplexKg = Math.round(Math.max(0, npkComplexKg) / 2.47);

    let totalQuantity = ureaKg + dapKg + sspKg + mopKg + npkComplexKg;
    // Costs: Urea=~6, DAP=~27, SSP=~10, MOP=~34, NPK=~30
    let estimatedCost = (ureaKg * 6) + (dapKg * 27) + (sspKg * 10) + (mopKg * 34) + (npkComplexKg * 30);

    let recommendedFertilizer = "";
    if (totalQuantity === 0) {
      recommendedFertilizer = "No chemical fertilizer needed! Soil is rich. Consider 1 ton/acre FYM.";
    } else {
      const parts = [];
      if (npkComplexKg > 0) parts.push(`NPK 12:32:16: ${npkComplexKg}kg`);
      if (ureaKg > 0) parts.push(`Urea: ${ureaKg}kg`);
      if (dapKg > 0) parts.push(`DAP: ${dapKg}kg`);
      if (sspKg > 0) parts.push(`SSP: ${sspKg}kg`);
      if (mopKg > 0) parts.push(`MOP: ${mopKg}kg`);
      recommendedFertilizer = parts.join(" + ");
    }

    // Organic Alternatives based on Soil Type / pH
    let soilHealthAdvice = "Soil health looks optimal for typical nutrient uptake.";
    if (ph < 6.0) {
      soilHealthAdvice = `Your soil is acidic (pH ${ph}). Consider applying agricultural lime. Substitute some Urea with organic compost to prevent further acidification.`;
      recommendedFertilizer += " (Consider pairing with 2 tons/acre Vermicompost)";
    } else if (ph > 8.0) {
      soilHealthAdvice = `Your soil is alkaline (pH ${ph}). Add gypsum to lower pH naturally. Avoid excessive chemical fertilizers which might lock up Iron and Zinc.`;
    } else if (soilType === 'Sandy') {
      soilHealthAdvice = "Sandy soil drains nutrients quickly. Apply fertilizers in 3-4 split doses rather than all at once. Add organic manure to improve water retention.";
    } else if (soilType === 'Clay') {
      soilHealthAdvice = "Clay soils retain nutrients well but can suffer from waterlogging. Ensure proper drainage before basal fertilizer application.";
    }

    // Application Schedule
    let applicationSchedule = "1. Basal Dose (At Sowing): Apply full DAP, full MOP, and 30% of Urea.\n";
    applicationSchedule += "2. First Top Dressing (30 Days): Apply 35% of Urea.\n";
    applicationSchedule += "3. Second Top Dressing (Flowering Stage): Apply remaining 35% of Urea.";

    res.json({
      recommendedFertilizer,
      requiredQuantityKg: totalQuantity,
      estimatedCost,
      applicationSchedule,
      soilHealthAdvice
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fertilizer recommendation engine failed' });
  }
});

// AI Seasonal Crop Planning Engine
app.post('/api/seasonal-plan', async (req, res) => {
  try {
    const { crop, location, season, waterAvailability, temperature, rainfall } = req.body;

    const cropData = await prisma.crop.findFirst({ where: { nameEn: crop } });
    if (!cropData) {
      return res.status(404).json({ error: 'Crop not found in intelligent database.' });
    }

    // 1. Sowing & Harvesting Date Ranges (2026 Baseline)
    let sowingStart, sowingEnd;
    if (season === 'Kharif') {
      sowingStart = new Date("2026-06-15");
      sowingEnd = new Date("2026-07-15");
    } else if (season === 'Rabi') {
      sowingStart = new Date("2026-10-15");
      sowingEnd = new Date("2026-11-20");
    } else { // Zaid
      sowingStart = new Date("2026-02-15");
      sowingEnd = new Date("2026-03-15");
    }

    // Calculate Harvest Period by adding the growingSeasonDays to the sowing windows
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const harvestStart = addDays(sowingStart, cropData.growingSeasonDays);
    const harvestEnd = addDays(sowingEnd, cropData.growingSeasonDays);

    const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const sowingDateRange = `${formatDate(sowingStart)} - ${formatDate(sowingEnd)}`;
    const harvestingPeriod = `${formatDate(harvestStart)} - ${formatDate(harvestEnd)}`;

    // 2. Irrigation Timeline
    let irrigationTimeline = "";
    if (waterAvailability === 'Rainfed') {
      irrigationTimeline = "<ul style='padding-left: 20px; margin: 0;'><li>☁️ <b>Dependent on monsoon.</b></li><li>🚧 Ensure field bunding to retain moisture.</li><li>💧 Give 1 life-saving irrigation at flowering.</li></ul>";
    } else {
      if (cropData.waterReqLitersHec > 8000000) { // e.g. Paddy, Sugarcane 
        irrigationTimeline = "<ul style='padding-left: 20px; margin: 0;'><li>🌊 <b>High Water Demand.</b></li><li>💧 Pre-sowing irrigation.</li><li>💧 Frequent irrigation every 5-7 days.</li><li>🛑 Drain 10 days before harvest.</li></ul>";
      } else {
        irrigationTimeline = "<ul style='padding-left: 20px; margin: 0;'><li>🌱 <b>Moderate Demand.</b></li><li>💧 Irrigate after sowing.</li><li>⏳ Irrigate every 15-20 days.</li><li>🛑 Avoid water stagnation.</li></ul>";
      }
    }

    // 3. Weather Risks
    let weatherRiskAlert = "<ul style='padding-left: 20px; margin: 0;'><li>✅ <b>Normal weather expected.</b> No major alerts.</li></ul>";
    if (temperature > 40) {
      weatherRiskAlert = "<ul style='padding-left: 20px; margin: 0;'><li>🔥 <b>High Heat Stress.</b></li><li>May cause flower drop.</li><li>Frequent light irrigation and mulching recommended.</li></ul>";
    } else if (temperature < 10 && season === 'Rabi') {
      weatherRiskAlert = "<ul style='padding-left: 20px; margin: 0;'><li>❄️ <b>Frost Risk.</b></li><li>Cold waves may damage leaves.</li><li>Apply evening irrigation to keep soil warm.</li></ul>";
    }

    // Assess rainfall matching
    const cropRainNeedsMm = cropData.waterReqLitersHec / 10000; // rough conversion to mm
    if (rainfall < (cropRainNeedsMm * 0.4) && waterAvailability === 'Rainfed') {
      weatherRiskAlert = `<ul style='padding-left: 20px; margin: 0;'><li>🏜️ <b>Severe Drought Risk.</b></li><li>Forecast (${rainfall}mm) is far below crop need.</li><li>Consider a drought-resistant variety.</li></ul>`;
    } else if (rainfall > (cropRainNeedsMm * 1.5)) {
      weatherRiskAlert = "<ul style='padding-left: 20px; margin: 0;'><li>🌧️ <b>Heavy Rainfall Risk.</b></li><li>Ensure deep drainage to prevent waterlogging.</li></ul>";
    }

    // 4. Crop Rotation Suggestion
    const genericRotations: Record<string, string> = {
      'Cereal': '<b>Legume</b> (e.g., Gram, Moong) 🥜<br><span style="font-size:0.9em; color:#4B5563;">Restores soil nitrogen.</span>',
      'Legume': '<b>Cereal</b> (e.g., Wheat, Maize) 🌾<br><span style="font-size:0.9em; color:#4B5563;">Uses fixed nitrogen perfectly.</span>',
      'Cash Crop': '<b>Cover crops</b> (e.g., Dhaincha) 🌿<br><span style="font-size:0.9em; color:#4B5563;">Restores depleted soil health.</span>'
    };

    // Naively categorize based on string for MVP:
    let cropCat = 'Cereal';
    if (['Gram', 'Moong', 'Groundnut', 'Soybean', 'Tur'].some(c => crop.includes(c))) cropCat = 'Legume';
    if (['Cotton', 'Sugarcane', 'Tobacco', 'Castor'].some(c => crop.includes(c))) cropCat = 'Cash Crop';

    const cropRotationSuggestion = `Rotate next with:<br><div style="margin-top:8px; padding:10px; background:rgba(0,0,0,0.04); border-radius:6px;">${genericRotations[cropCat]}</div>`;

    // 5. Pest & Disease Preventive Care
    let preventiveCareTips = "<ul style='padding-left: 20px; margin: 0;'><li>🚜 Deep summer ploughing.</li><li>🧪 Treat seeds with Trichoderma.</li><li>🟨 Install yellow sticky traps.</li>";
    if (season === 'Kharif') {
      preventiveCareTips += "<li>🌿 Spray Neem Extract against leaf-eaters.</li>";
    } else if (season === 'Rabi') {
      preventiveCareTips += "<li>🦟 Watch out for aphids during warm weeks.</li>";
    }
    preventiveCareTips += "</ul>";

    // 6. Expected Yield
    const expectedYieldInfo = `<ul style='padding-left: 20px; margin: 0;'><li>🌾 <b>Estimated Yield:</b> ${cropData.yieldMinQuintalHec} to ${cropData.yieldMaxQuintalHec} Quintals per Hectare.</li><li>💡 Actual yield depends on weather and care.</li></ul>`;

    // 7. Basic Fertilizer Guide (using cost as a proxy for intensity)
    let basicFertilizerGuide = "";
    if (cropData.costFertilizerHec > 15000) {
      basicFertilizerGuide = "<ul style='padding-left: 20px; margin: 0;'><li>💊 <b>High Nutrient Need:</b> Requires heavy base manure and split doses of NPK.</li><li>Use AI Fertilizer tool for exact limits.</li></ul>";
    } else if (cropData.costFertilizerHec > 8000) {
      basicFertilizerGuide = "<ul style='padding-left: 20px; margin: 0;'><li>💊 <b>Moderate Nutrient Need:</b> Apply standard basal dose before sowing. Top up nitrogen 30 days later.</li></ul>";
    } else {
      basicFertilizerGuide = "<ul style='padding-left: 20px; margin: 0;'><li>💊 <b>Low Nutrient Need:</b> Grows well with minimal inputs. Focus on organic compost.</li></ul>";
    }

    // 8. Farming Difficulty
    const difficultyStars = "⭐".repeat(cropData.difficultyLevel) + "☆".repeat(5 - cropData.difficultyLevel);
    const farmingDifficulty = `<ul style='padding-left: 20px; margin: 0;'><li>💪 <b>Difficulty:</b> ${difficultyStars}</li><li>${cropData.difficultyLevel >= 4 ? "Requires experienced management and high capital." : "Beginner friendly and easy to manage."}</li></ul>`;

    res.json({
      sowingDateRange,
      irrigationTimeline,
      harvestingPeriod,
      weatherRiskAlert,
      cropRotationSuggestion,
      preventiveCareTips,
      expectedYieldInfo,
      basicFertilizerGuide,
      farmingDifficulty
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Seasonal Planning Engine failed' });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}

module.exports = app;
