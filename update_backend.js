const fs = require('fs');
const file = 'backend/src/index.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /let irrigationTimeline = "";[\s\S]*?    }\n/m,
  `let irrigationTimeline = "";
    if (waterAvailability === 'Rainfed') {
      irrigationTimeline = "<ul style='padding-left: 20px; margin: 0;'><li>☁️ <b>Dependent on monsoon.</b></li><li>🚧 Ensure field bunding to retain moisture.</li><li>💧 Give 1 life-saving irrigation at flowering.</li></ul>";
    } else {
      if (cropData.waterReqLitersHec > 8000000) {
        irrigationTimeline = "<ul style='padding-left: 20px; margin: 0;'><li>🌊 <b>High Water Demand.</b></li><li>💧 Pre-sowing irrigation.</li><li>💧 Frequent irrigation every 5-7 days.</li><li>🛑 Drain 10 days before harvest.</li></ul>";
      } else {
        irrigationTimeline = "<ul style='padding-left: 20px; margin: 0;'><li>🌱 <b>Moderate Demand.</b></li><li>💧 Irrigate after sowing.</li><li>⏳ Irrigate every 15-20 days.</li><li>🛑 Avoid water stagnation.</li></ul>";
      }
    }`
);

code = code.replace(
  /let weatherRiskAlert = "<ul style='padding-left: 20px; margin: 0;'><li>✅ <b>Normal conditions expected.<\/b> No major alerts.<\/li><\/ul>";[\s\S]*?Apply fertilizer in split doses as heavy rain causes nutrient leaching.<\/li><\/ul>";\n    }\n/m,
  `let weatherRiskAlert = "<ul style='padding-left: 20px; margin: 0;'><li>✅ <b>Normal weather expected.</b> No major alerts.</li></ul>";
    if (temperature > 40) {
      weatherRiskAlert = "<ul style='padding-left: 20px; margin: 0;'><li>🔥 <b>High Heat Stress.</b></li><li>May cause flower drop.</li><li>Frequent light irrigation and mulching recommended.</li></ul>";
    } else if (temperature < 10 && season === 'Rabi') {
      weatherRiskAlert = "<ul style='padding-left: 20px; margin: 0;'><li>❄️ <b>Frost Risk.</b></li><li>Cold waves may damage leaves.</li><li>Apply evening irrigation to keep soil warm.</li></ul>";
    }
    
    // Assess rainfall matching
    const cropRainNeedsMm = cropData.waterReqLitersHec / 10000;
    if (rainfall < (cropRainNeedsMm * 0.4) && waterAvailability === 'Rainfed') {
      weatherRiskAlert = \`<ul style='padding-left: 20px; margin: 0;'><li>🏜️ <b>Severe Drought Risk.</b></li><li>Forecast (\${rainfall}mm) is far below crop need.</li><li>Consider a drought-resistant variety.</li></ul>\`;
    } else if (rainfall > (cropRainNeedsMm * 1.5)) {
      weatherRiskAlert = "<ul style='padding-left: 20px; margin: 0;'><li>🌧️ <b>Heavy Rainfall Risk.</b></li><li>Ensure deep drainage to prevent waterlogging.</li></ul>";
    }`
);

code = code.replace(
  /const genericRotations: Record<string, string> = {[\s\S]*?const cropRotationSuggestion = `Post-harvest rotate with:<br><div style="margin-top:5px; padding:10px; background:#f3f4f6; border-radius:4px;">\${genericRotations\[cropCat\]}<\/div>`;\n/m,
  `const genericRotations: Record<string, string> = {
      'Cereal': '<b>Legume</b> (e.g., Gram, Moong) 🥜<br><span style="font-size:0.9em; color:#4B5563;">Restores soil nitrogen.</span>',
      'Legume': '<b>Cereal</b> (e.g., Wheat, Maize) 🌾<br><span style="font-size:0.9em; color:#4B5563;">Uses fixed nitrogen perfectly.</span>',
      'Cash Crop': '<b>Cover crops</b> (e.g., Dhaincha) 🌿<br><span style="font-size:0.9em; color:#4B5563;">Restores depleted soil health.</span>'
    };
    
    let cropCat = 'Cereal';
    if (['Gram', 'Moong', 'Groundnut', 'Soybean', 'Tur'].some(c => crop.includes(c))) cropCat = 'Legume';
    if (['Cotton', 'Sugarcane', 'Tobacco', 'Castor'].some(c => crop.includes(c))) cropCat = 'Cash Crop';

    const cropRotationSuggestion = \`Rotate next with:<br><div style="margin-top:8px; padding:10px; background:rgba(0,0,0,0.04); border-radius:6px;">\${genericRotations[cropCat]}</div>\`;`
);

code = code.replace(
  /let preventiveCareTips = "<ul style='padding-left: 20px; margin: 0;'><li>🚜 Deep summer ploughing to expose pupae.[\s\S]*?    }\n    preventiveCareTips \+= "<\/ul>";\n/m,
  `let preventiveCareTips = "<ul style='padding-left: 20px; margin: 0;'><li>🚜 Deep summer ploughing.</li><li>🧪 Treat seeds with Trichoderma.</li><li>🟨 Install yellow sticky traps.</li>";
    if (season === 'Kharif') {
      preventiveCareTips += "<li>🌿 Spray Neem Extract against leaf-eaters.</li>";
    } else if (season === 'Rabi') {
      preventiveCareTips += "<li>🦟 Watch out for aphids during warm weeks.</li>";
    }
    preventiveCareTips += "</ul>";`
);


fs.writeFileSync(file, code, 'utf8');
console.log('Update Complete');
