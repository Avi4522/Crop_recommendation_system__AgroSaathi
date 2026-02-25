import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Gujarat Districts...');

    // Clean up existing
    await prisma.cropScheme.deleteMany();
    await prisma.recommendation.deleteMany();
    await prisma.apmcPrice.deleteMany();
    await prisma.apmcCenter.deleteMany();
    await prisma.governmentScheme.deleteMany();
    await prisma.crop.deleteMany();
    await prisma.user.deleteMany();
    await prisma.district.deleteMany();

    const districtsData = [
        { name: 'Ahmedabad', region: 'Central Gujarat', primaryCities: 'Ahmedabad, Sanand, Dholka', avgRainfallMm: 800, minTempC: 15, maxTempC: 45, dominantSoils: 'Sandy, Loamy', description: 'Commercial hub with mixed agriculture.' },
        { name: 'Amreli', region: 'Saurashtra', primaryCities: 'Amreli, Savarkundla, Rajula', avgRainfallMm: 600, minTempC: 12, maxTempC: 42, dominantSoils: 'Black, Medium Black', description: 'Famous for cotton and groundnut cultivation.' },
        { name: 'Anand', region: 'Central Gujarat', primaryCities: 'Anand, Khambhat, Petlad', avgRainfallMm: 850, minTempC: 15, maxTempC: 40, dominantSoils: 'Alluvial, Sandy Loam', description: 'Known for tobacco and banana cultivation, dairy hub.' },
        { name: 'Aravalli', region: 'North Gujarat', primaryCities: 'Modasa, Bhiloda, Bayad', avgRainfallMm: 700, minTempC: 10, maxTempC: 42, dominantSoils: 'Sandy, Rocky', description: 'Hilly terrain, suitable for maize and wheat.' },
        { name: 'Banaskantha', region: 'North Gujarat', primaryCities: 'Palanpur, Deesa, Tharad', avgRainfallMm: 500, minTempC: 5, maxTempC: 45, dominantSoils: 'Sandy', description: 'Leading producer of potatoes and castor.' },
        { name: 'Bharuch', region: 'South Gujarat', primaryCities: 'Bharuch, Ankleshwar, Jambusar', avgRainfallMm: 1000, minTempC: 18, maxTempC: 40, dominantSoils: 'Deep Black', description: 'Rich black soil, excellent for cotton and pigeon pea.' },
        { name: 'Bhavnagar', region: 'Saurashtra', primaryCities: 'Bhavnagar, Palitana, Mahuva', avgRainfallMm: 650, minTempC: 15, maxTempC: 42, dominantSoils: 'Coastal Alluvial, Black', description: 'Known for onions and groundnut.' },
        { name: 'Botad', region: 'Saurashtra', primaryCities: 'Botad, Gadhada, Barvala', avgRainfallMm: 600, minTempC: 12, maxTempC: 43, dominantSoils: 'Black', description: 'Major hub for cotton.' },
        { name: 'Chhota Udaipur', region: 'Central Gujarat', primaryCities: 'Chhota Udaipur, Bodeli, Jetpur Pavi', avgRainfallMm: 1000, minTempC: 10, maxTempC: 42, dominantSoils: 'Forest Soil, Loamy', description: 'Tribal belt, maize and pulses are common.' },
        { name: 'Dahod', region: 'Central Gujarat', primaryCities: 'Dahod, Devgadh Baria, Zalod', avgRainfallMm: 900, minTempC: 10, maxTempC: 40, dominantSoils: 'Rocky, Medium Black', description: 'Hilly region, maize and soybean cultivated.' },
        { name: 'Dang', region: 'South Gujarat', primaryCities: 'Ahwa, Waghai, Saputara', avgRainfallMm: 2500, minTempC: 10, maxTempC: 35, dominantSoils: 'Forest Soil, Red Laterite', description: 'Heavy rainfall, forest area, ragi and organic farming.' },
        { name: 'Devbhoomi Dwarka', region: 'Saurashtra', primaryCities: 'Khambhalia, Dwarka, Okha', avgRainfallMm: 500, minTempC: 15, maxTempC: 38, dominantSoils: 'Coastal Saline, Medium Black', description: 'Coastal agriculture, groundnut and cotton.' },
        { name: 'Gandhinagar', region: 'Central Gujarat', primaryCities: 'Gandhinagar, Kalol, Dehgam', avgRainfallMm: 800, minTempC: 12, maxTempC: 44, dominantSoils: 'Sandy Loam', description: 'Capital region, vegetables and wheat are prominent.' },
        { name: 'Gir Somnath', region: 'Saurashtra', primaryCities: 'Veraval, Una, Kodinar', avgRainfallMm: 800, minTempC: 15, maxTempC: 38, dominantSoils: 'Coastal Alluvial, Calcareous', description: 'Famous for mangoes and coconut.' },
        { name: 'Jamnagar', region: 'Saurashtra', primaryCities: 'Jamnagar, Dhrol, Lalpur', avgRainfallMm: 550, minTempC: 12, maxTempC: 40, dominantSoils: 'Medium Black', description: 'Groundnut and cumin region.' },
        { name: 'Junagadh', region: 'Saurashtra', primaryCities: 'Junagadh, Keshod, Mangrol', avgRainfallMm: 800, minTempC: 12, maxTempC: 40, dominantSoils: 'Black, Coastal', description: 'Famous for Kesar Mango and groundnut.' },
        { name: 'Kheda', region: 'Central Gujarat', primaryCities: 'Nadiad, Kapadvanj, Dakor', avgRainfallMm: 850, minTempC: 15, maxTempC: 42, dominantSoils: 'Deep Alluvial', description: 'Tobacco, paddy, and wheat.' },
        { name: 'Kutch', region: 'Kutch', primaryCities: 'Bhuj, Gandhidham, Anjar, Mandvi', avgRainfallMm: 350, minTempC: 8, maxTempC: 45, dominantSoils: 'Sandy, Saline', description: 'Largest district, arid climate. Suitable for drought-resistant crops, date palms.' },
        { name: 'Mahisagar', region: 'Central Gujarat', primaryCities: 'Lunawada, Balasinor, Santrampur', avgRainfallMm: 800, minTempC: 10, maxTempC: 42, dominantSoils: 'Sandy Loam, Rocky', description: 'Maize and pulses.' },
        { name: 'Mehsana', region: 'North Gujarat', primaryCities: 'Mehsana, Visnagar, Unjha', avgRainfallMm: 600, minTempC: 10, maxTempC: 44, dominantSoils: 'Sandy Loam', description: 'Major hub for cumin, fennel, and castor.' },
        { name: 'Morbi', region: 'Saurashtra', primaryCities: 'Morbi, Wankaner, Halvad', avgRainfallMm: 500, minTempC: 10, maxTempC: 43, dominantSoils: 'Medium Black, Sandy', description: 'Cotton and groundnut.' },
        { name: 'Narmada', region: 'South Gujarat', primaryCities: 'Rajpipla, Dediapada, Garudeshwar', avgRainfallMm: 1100, minTempC: 12, maxTempC: 40, dominantSoils: 'Black, Forest Soil', description: 'Banana, sugarcane, and cotton.' },
        { name: 'Navsari', region: 'South Gujarat', primaryCities: 'Navsari, Bilimora, Vansda', avgRainfallMm: 1500, minTempC: 15, maxTempC: 38, dominantSoils: 'Deep Black, Coastal Alluvial', description: 'Highly fertile, famous for chiku, mango, and sugarcane.' },
        { name: 'Panchmahal', region: 'Central Gujarat', primaryCities: 'Godhra, Halol, Kalol', avgRainfallMm: 900, minTempC: 10, maxTempC: 42, dominantSoils: 'Medium Black, Rocky', description: 'Maize, paddy, and pulses.' },
        { name: 'Patan', region: 'North Gujarat', primaryCities: 'Patan, Siddhpur, Radhanpur', avgRainfallMm: 500, minTempC: 8, maxTempC: 45, dominantSoils: 'Sandy', description: 'Castor, cumin, and mustard.' },
        { name: 'Porbandar', region: 'Saurashtra', primaryCities: 'Porbandar, Ranavav, Kutiyana', avgRainfallMm: 600, minTempC: 15, maxTempC: 38, dominantSoils: 'Coastal Saline, Medium Black', description: 'Groundnut and cotton.' },
        { name: 'Rajkot', region: 'Saurashtra', primaryCities: 'Rajkot City, Gondal, Jasdan', avgRainfallMm: 600, minTempC: 10, maxTempC: 42, dominantSoils: 'Black, Sandy', description: 'Major market hub in Saurashtra, known for groundnut, cumin, and cotton.' },
        { name: 'Sabarkantha', region: 'North Gujarat', primaryCities: 'Himmatnagar, Idar, Prantij', avgRainfallMm: 750, minTempC: 10, maxTempC: 42, dominantSoils: 'Sandy Loam', description: 'Cotton, wheat, and groundnut.' },
        { name: 'Surat', region: 'South Gujarat', primaryCities: 'Surat city, Mandvi, Olpad', avgRainfallMm: 1200, minTempC: 15, maxTempC: 38, dominantSoils: 'Black, Alluvial', description: 'High rainfall region suitable for water-intensive crops like sugarcane and vegetables.' },
        { name: 'Surendranagar', region: 'Saurashtra', primaryCities: 'Surendranagar, Wadhwan, Dhrangadhra', avgRainfallMm: 500, minTempC: 10, maxTempC: 44, dominantSoils: 'Black, Saline', description: 'Major cotton producing region.' },
        { name: 'Tapi', region: 'South Gujarat', primaryCities: 'Vyara, Songadh, Valod', avgRainfallMm: 1300, minTempC: 15, maxTempC: 38, dominantSoils: 'Black, Forest Soil', description: 'Sugarcane and paddy.' },
        { name: 'Vadodara', region: 'Central Gujarat', primaryCities: 'Vadodara, Karjan, Padra', avgRainfallMm: 900, minTempC: 14, maxTempC: 42, dominantSoils: 'Deep Black, Loamy', description: 'Cotton, tuver, and vegetables.' },
        { name: 'Valsad', region: 'South Gujarat', primaryCities: 'Valsad, Vapi, Pardi', avgRainfallMm: 2000, minTempC: 16, maxTempC: 35, dominantSoils: 'Deep Black, Coastal Alluvial', description: 'Heavy rainfall, famous for Alphonso mangoes and chikoo.' }
    ];

    for (const d of districtsData) {
        await prisma.district.create({ data: d });
    }

    console.log('Seeding major crops...');

    const cropsData = [
        {
            nameEn: 'Groundnut', nameGu: 'મગફળી (Mungphali)', nameHi: 'मूंगफली',
            category: 'Oil Seed', icon: '🥜',
            optimalRainfallMin: 500, optimalRainfallMax: 1000, optimalTempMin: 22, optimalTempMax: 35,
            suitableSoilTypes: 'Sandy, Loam, Black', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 400000,
            growingSeasonDays: 110, suitableSeasons: 'Kharif',
            suitableTalukas: 'Amreli, Savarkundla, Rajula, Babra, Dhari, Kunkavav Vadia, Lilia, Khambhalha, Jafrabad, Bagasara, Rajkot, Gondal, Jasdan, Dhoraji, Jam Kandorna, Kotada Sangani, Lodhika, Paddhari, Upleta, Vinchhiya, Jamnagar, Lalpur, Kalavad, Jamjodhpur, Khambhalia, Bhanvad, Kalyanpur, Dwarka, Junagadh City, Bhesan, Junagadh Rural, Malia, Manavadar, Mangrol, Mendarda, Keshod, Vanthali, Visavadar',
            yieldMinQuintalHec: 15, yieldMaxQuintalHec: 30, costSeedHec: 12000, costFertilizerHec: 5000, costLaborHec: 10000, costOtherHec: 3000, laborDaysHec: 45, difficultyLevel: 2,
        },
        {
            nameEn: 'Cotton', nameGu: 'કપાસ (Kapas)', nameHi: 'कपास',
            category: 'Cash Crop', icon: '☁️',
            optimalRainfallMin: 500, optimalRainfallMax: 1200, optimalTempMin: 21, optimalTempMax: 37,
            suitableSoilTypes: 'Black, Clay, Loam', minPh: 5.8, maxPh: 8.0, waterReqLitersHec: 700000,
            growingSeasonDays: 160, suitableSeasons: 'Kharif',
            suitableTalukas: 'Surendranagar, Wadhwan, Dhrangadhra, Sayla, Chotila, Limbdi, Lakhtar, Muli, Thangadh, Chuda, Dasada, Morbi, Halvad, Wankaner, Tankara, Maliya, Botad, Gadhada, Barwala, Ranpur, Amreli, Rajkot, Gondal, Jasdan, Vadodara, Karjan, Padra, Bharuch, Ankleshwar',
            yieldMinQuintalHec: 20, yieldMaxQuintalHec: 40, costSeedHec: 4000, costFertilizerHec: 12000, costLaborHec: 25000, costOtherHec: 8000, laborDaysHec: 80, difficultyLevel: 3,
        },
        {
            nameEn: 'Cumin', nameGu: 'જીરું (Jeeru)', nameHi: 'जीरा',
            category: 'Spice', icon: '🌿',
            optimalRainfallMin: 200, optimalRainfallMax: 400, optimalTempMin: 10, optimalTempMax: 30,
            suitableSoilTypes: 'Sandy, Loam', minPh: 6.5, maxPh: 8.0, waterReqLitersHec: 250000,
            growingSeasonDays: 110, suitableSeasons: 'Rabi',
            suitableTalukas: 'Mehsana, Unjha, Kadi, Visnagar, Vijapur, Vadnagar, Kheralu, Becharaji, Satlasana, Jotana, Patan, Sidhpur, Harij, Chanasma, Radhanpur, Sami, Santalpur, Banaskantha, Palanpur, Deesa, Bhabhar, Dantiwada, Danta, Deodar, Dhanera, Kankrej, Tharad, Vadgam, Vav, Suigam, Lakhani, Amirgadh, Surendranagar, Dasada, Lakhtar, Jamnagar',
            yieldMinQuintalHec: 5, yieldMaxQuintalHec: 12, costSeedHec: 3000, costFertilizerHec: 4000, costLaborHec: 15000, costOtherHec: 5000, laborDaysHec: 40, difficultyLevel: 4,
        },
        {
            nameEn: 'Wheat', nameGu: 'ઘઉં (Ghau)', nameHi: 'गेहूं',
            category: 'Cereal', icon: '🌾',
            optimalRainfallMin: 300, optimalRainfallMax: 800, optimalTempMin: 10, optimalTempMax: 25,
            suitableSoilTypes: 'Loam, Clay, Alluvial', minPh: 6.0, maxPh: 8.5, waterReqLitersHec: 500000,
            growingSeasonDays: 120, suitableSeasons: 'Rabi',
            suitableTalukas: 'Ahmedabad City, Daskroi, Sanand, Bavla, Dholka, Viramgam, Mandal, Rampur, Detroj, Kheda, Nadiad, Mehmedabad, Matar, Mahudha, Kathlal, Kapadvanj, Dakor, Thasra, Balasinor, Virpur, Vaso, Galteshwar, Rajkot, Gondal, Jasdan, Mehsana, Vijapur, Kadi, Sabarkantha, Himmatnagar',
            yieldMinQuintalHec: 30, yieldMaxQuintalHec: 50, costSeedHec: 4500, costFertilizerHec: 6000, costLaborHec: 12000, costOtherHec: 4000, laborDaysHec: 30, difficultyLevel: 2,
        },
        {
            nameEn: 'Mango', nameGu: 'કેરી (Keri)', nameHi: 'आम',
            category: 'Fruit', icon: '🥭',
            optimalRainfallMin: 800, optimalRainfallMax: 2500, optimalTempMin: 22, optimalTempMax: 40,
            suitableSoilTypes: 'Alluvial, Deep Black, Coastal Alluvial', minPh: 5.5, maxPh: 7.5, waterReqLitersHec: 800000,
            growingSeasonDays: 365, suitableSeasons: 'Kharif, Summer',
            suitableTalukas: 'Valsad, Pardi, Umbergaon, Dharampur, Kaprada, Vapi, Navsari, Gandevi, Chikhli, Jalalpore, Vansda, Khergam, Gir Somnath, Talala, Veraval, Una, Kodinar, Sutrapada, Gir Gadhada, Junagadh City, Mendarda, Vanthali, Surat City, Olpad',
            yieldMinQuintalHec: 50, yieldMaxQuintalHec: 150, costSeedHec: 20000, costFertilizerHec: 15000, costLaborHec: 30000, costOtherHec: 10000, laborDaysHec: 90, difficultyLevel: 4,
        },
        {
            nameEn: 'Banana', nameGu: 'કેળા (Kela)', nameHi: 'केला',
            category: 'Fruit', icon: '🍌',
            optimalRainfallMin: 1200, optimalRainfallMax: 2500, optimalTempMin: 15, optimalTempMax: 35,
            suitableSoilTypes: 'Alluvial, Loam, Deep Black', minPh: 6.5, maxPh: 7.5, waterReqLitersHec: 1500000,
            growingSeasonDays: 300, suitableSeasons: 'Kharif',
            suitableTalukas: 'Anand, Petlad, Khambhat, Borsad, Anklav, Umreth, Sojitra, Tarapur, Narmada, Rajpipla, Nandod, Dediapada, Sagbara, Garudeshwar, Tilakwada, Bharuch, Jhagadia, Surat City, Kamrej, Bardoli, Navsari',
            yieldMinQuintalHec: 300, yieldMaxQuintalHec: 600, costSeedHec: 40000, costFertilizerHec: 30000, costLaborHec: 50000, costOtherHec: 15000, laborDaysHec: 120, difficultyLevel: 5,
        },
        {
            nameEn: 'Potato', nameGu: 'બટાકા (Batata)', nameHi: 'आलू',
            category: 'Vegetable', icon: '🥔',
            optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 12, optimalTempMax: 25,
            suitableSoilTypes: 'Sandy, Loam', minPh: 5.5, maxPh: 7.0, waterReqLitersHec: 500000,
            growingSeasonDays: 90, suitableSeasons: 'Rabi',
            suitableTalukas: 'Deesa, Palanpur, Dantiwada, Vadgam, Khedbrahma, Idar, Sabarkantha, Himmatnagar, Prantij, Banaskantha, Tharad, Bhabhar, Kheda, Nadiad',
            yieldMinQuintalHec: 150, yieldMaxQuintalHec: 300, costSeedHec: 35000, costFertilizerHec: 20000, costLaborHec: 25000, costOtherHec: 8000, laborDaysHec: 60, difficultyLevel: 3,
        },
        {
            nameEn: 'Castor', nameGu: 'એરંડા (Eranda)', nameHi: 'अरंडी',
            category: 'Oil Seed', icon: '🌱',
            optimalRainfallMin: 300, optimalRainfallMax: 700, optimalTempMin: 15, optimalTempMax: 40,
            suitableSoilTypes: 'Sandy, Saline, Loam', minPh: 6.0, maxPh: 8.5, waterReqLitersHec: 350000,
            growingSeasonDays: 140, suitableSeasons: 'Kharif, Rabi',
            suitableTalukas: 'Patan, Chanasma, Radhanpur, Banaskantha, Palanpur, Deesa, Tharad, Kutch, Bhuj, Anjar, Mandvi, Sabarkantha, Himmatnagar, Idar, Prantij, Mehsana, Kadi, Becharaji',
            yieldMinQuintalHec: 15, yieldMaxQuintalHec: 25, costSeedHec: 3000, costFertilizerHec: 6000, costLaborHec: 12000, costOtherHec: 3000, laborDaysHec: 40, difficultyLevel: 2,
        },
        {
            nameEn: 'Sugarcane', nameGu: 'શેરડી (Sherdi)', nameHi: 'गन्ना',
            category: 'Cash Crop', icon: '🎋',
            optimalRainfallMin: 1100, optimalRainfallMax: 2500, optimalTempMin: 20, optimalTempMax: 35,
            suitableSoilTypes: 'Deep Black, Alluvial, Forest Soil', minPh: 6.5, maxPh: 8.0, waterReqLitersHec: 2000000,
            growingSeasonDays: 365, suitableSeasons: 'Kharif',
            suitableTalukas: 'Surat City, Bardoli, Kamrej, Mandvi, Mangrol, Navsari, Gandevi, Chikhli, Tapi, Vyara, Songadh, Valod, Narmada, Rajpipla, Bharuch, Ankleshwar',
            yieldMinQuintalHec: 600, yieldMaxQuintalHec: 1200, costSeedHec: 25000, costFertilizerHec: 35000, costLaborHec: 45000, costOtherHec: 15000, laborDaysHec: 150, difficultyLevel: 4,
        },
        {
            nameEn: 'Pearl Millet', nameGu: 'બાજરી (Bajri)', nameHi: 'बाजरा',
            category: 'Cereal', icon: '🌾',
            optimalRainfallMin: 200, optimalRainfallMax: 500, optimalTempMin: 20, optimalTempMax: 45,
            suitableSoilTypes: 'Sandy, Arid, Saline', minPh: 6.0, maxPh: 8.5, waterReqLitersHec: 200000,
            growingSeasonDays: 80, suitableSeasons: 'Kharif, Summer',
            suitableTalukas: 'Kutch, Bhuj, Anjar, Nakhatrana, Rapar, Banaskantha, Vav, Tharad, Deodar, Patan, Radhanpur, Sami, Surendranagar, Dasada, Dhrangadhra',
            yieldMinQuintalHec: 10, yieldMaxQuintalHec: 25, costSeedHec: 1500, costFertilizerHec: 3000, costLaborHec: 8000, costOtherHec: 2000, laborDaysHec: 20, difficultyLevel: 1,
        },
        {
            nameEn: 'Onion', nameGu: 'ડુંગળી (Dungri)', nameHi: 'प्याज',
            category: 'Vegetable', icon: '🧅',
            optimalRainfallMin: 300, optimalRainfallMax: 700, optimalTempMin: 15, optimalTempMax: 30,
            suitableSoilTypes: 'Sandy, Loam, Alluvial', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 350000,
            growingSeasonDays: 120, suitableSeasons: 'Rabi',
            suitableTalukas: 'Bhavnagar, Mahuva, Talaja, Palitana, Gariadhar, Amreli, Rajula, Savarkundla, Rajkot, Gondal, Jasdan, Jamnagar, Lalpur, Junagadh City, Keshod',
            yieldMinQuintalHec: 200, yieldMaxQuintalHec: 350, costSeedHec: 15000, costFertilizerHec: 10000, costLaborHec: 20000, costOtherHec: 5000, laborDaysHec: 70, difficultyLevel: 3,
        },
        {
            nameEn: 'Garlic', nameGu: 'લસણ (Lasan)', nameHi: 'लहसुन',
            category: 'Spice', icon: '🧄',
            optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 12, optimalTempMax: 28,
            suitableSoilTypes: 'Loam, Sandy', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 300000,
            growingSeasonDays: 130, suitableSeasons: 'Rabi',
            suitableTalukas: 'Jamnagar, Lalpur, Kalavad, Rajkot, Gondal, Jasdan, Junagadh City, Keshod, Amreli, Bhavnagar',
            yieldMinQuintalHec: 40, yieldMaxQuintalHec: 80, costSeedHec: 25000, costFertilizerHec: 12000, costLaborHec: 18000, costOtherHec: 5000, laborDaysHec: 65, difficultyLevel: 4,
        },
        {
            nameEn: 'Mustard', nameGu: 'રાઈ (Rai)', nameHi: 'सरसों',
            category: 'Oil Seed', icon: '🌼',
            optimalRainfallMin: 200, optimalRainfallMax: 500, optimalTempMin: 10, optimalTempMax: 25,
            suitableSoilTypes: 'Sandy, Loam', minPh: 5.5, maxPh: 7.5, waterReqLitersHec: 250000,
            growingSeasonDays: 110, suitableSeasons: 'Rabi',
            suitableTalukas: 'Banaskantha, Palanpur, Deesa, Tharad, Bhabhar, Patan, Radhanpur, Sami, Mehsana, Kadi, Becharaji, Sabarkantha, Himmatnagar',
            yieldMinQuintalHec: 15, yieldMaxQuintalHec: 25, costSeedHec: 2000, costFertilizerHec: 5000, costLaborHec: 8000, costOtherHec: 2000, laborDaysHec: 25, difficultyLevel: 2,
        },
        {
            nameEn: 'Sesame', nameGu: 'તલ (Tal)', nameHi: 'तिल',
            category: 'Oil Seed', icon: '🌱',
            optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 25, optimalTempMax: 35,
            suitableSoilTypes: 'Sandy, Loam, Well-drained', minPh: 5.5, maxPh: 8.0, waterReqLitersHec: 200000,
            growingSeasonDays: 90, suitableSeasons: 'Kharif, Summer',
            suitableTalukas: 'Surendranagar, Wadhwan, Dhrangadhra, Chotila, Amreli, Babra, Dhari, Bhavnagar, Mahuva, Rajkot, Jasdan, Kutch, Bhuj, Anjar, Mandvi',
            yieldMinQuintalHec: 5, yieldMaxQuintalHec: 10, costSeedHec: 3000, costFertilizerHec: 4000, costLaborHec: 10000, costOtherHec: 2000, laborDaysHec: 35, difficultyLevel: 2,
        },
        {
            nameEn: 'Pigeon Pea', nameGu: 'તુવેર (Tuver)', nameHi: 'अरहर',
            category: 'Pulse', icon: '🌿',
            optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 20, optimalTempMax: 35,
            suitableSoilTypes: 'Deep Black, Loam', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 400000,
            growingSeasonDays: 150, suitableSeasons: 'Kharif',
            suitableTalukas: 'Vadodara, Karjan, Padra, Savli, Bharuch, Ankleshwar, Jambusar, Panchmahal, Godhra, Halol, Dahod, Devgadh Baria, Surat City, Bardoli, Kamrej, Narmada, Rajpipla',
            yieldMinQuintalHec: 12, yieldMaxQuintalHec: 25, costSeedHec: 5000, costFertilizerHec: 6000, costLaborHec: 12000, costOtherHec: 3000, laborDaysHec: 45, difficultyLevel: 3,
        },
        // NEW CEREALS
        { nameEn: 'Rice', nameGu: 'ચોખા (Chokha)', nameHi: 'चावल', category: 'Cereal', icon: '🌾', optimalRainfallMin: 1200, optimalRainfallMax: 2500, optimalTempMin: 22, optimalTempMax: 32, suitableSoilTypes: 'Clay, Loam', minPh: 6.0, maxPh: 7.0, waterReqLitersHec: 1500000, growingSeasonDays: 130, suitableSeasons: 'Kharif', suitableTalukas: 'Surat City, Bardoli, Navsari, Chikhli, Valsad, Pardi', yieldMinQuintalHec: 40, yieldMaxQuintalHec: 60, costSeedHec: 5000, costFertilizerHec: 8000, costLaborHec: 20000, costOtherHec: 5000, laborDaysHec: 60, difficultyLevel: 3 },
        { nameEn: 'Maize', nameGu: 'મકાઈ (Makai)', nameHi: 'मक्का', category: 'Cereal', icon: '🌽', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 18, optimalTempMax: 27, suitableSoilTypes: 'Sandy Loam, Black', minPh: 5.5, maxPh: 7.5, waterReqLitersHec: 500000, growingSeasonDays: 100, suitableSeasons: 'Kharif', suitableTalukas: 'Godhra, Halol, Dahod, Devgadh Baria', yieldMinQuintalHec: 25, yieldMaxQuintalHec: 40, costSeedHec: 2000, costFertilizerHec: 5000, costLaborHec: 10000, costOtherHec: 3000, laborDaysHec: 35, difficultyLevel: 2 },
        { nameEn: 'Jowar', nameGu: 'જુવાર (Juvar)', nameHi: 'ज्वार', category: 'Cereal', icon: '🌾', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Sandy, Loam, Black', minPh: 6.0, maxPh: 8.0, waterReqLitersHec: 300000, growingSeasonDays: 110, suitableSeasons: 'Kharif, Rabi', suitableTalukas: 'Surendranagar, Wadhwan, Dhrangadhra', yieldMinQuintalHec: 15, yieldMaxQuintalHec: 25, costSeedHec: 1500, costFertilizerHec: 3000, costLaborHec: 8000, costOtherHec: 2000, laborDaysHec: 30, difficultyLevel: 1 },
        { nameEn: 'Barley', nameGu: 'જવ (Jav)', nameHi: 'जौ', category: 'Cereal', icon: '🌾', optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 12, optimalTempMax: 25, suitableSoilTypes: 'Sandy, Loam', minPh: 6.0, maxPh: 8.0, waterReqLitersHec: 300000, growingSeasonDays: 100, suitableSeasons: 'Rabi', suitableTalukas: 'Palanpur, Deesa, Patan, Mehsana', yieldMinQuintalHec: 20, yieldMaxQuintalHec: 35, costSeedHec: 2000, costFertilizerHec: 4000, costLaborHec: 8000, costOtherHec: 2000, laborDaysHec: 25, difficultyLevel: 2 },
        { nameEn: 'Ragi', nameGu: 'રાગી (Ragi)', nameHi: 'रागी', category: 'Cereal', icon: '🌾', optimalRainfallMin: 700, optimalRainfallMax: 1200, optimalTempMin: 20, optimalTempMax: 30, suitableSoilTypes: 'Red, Laterite, Loam', minPh: 5.5, maxPh: 7.0, waterReqLitersHec: 400000, growingSeasonDays: 120, suitableSeasons: 'Kharif', suitableTalukas: 'Dahod, Devgadh Baria, Chhota Udaipur, Bodeli', yieldMinQuintalHec: 15, yieldMaxQuintalHec: 25, costSeedHec: 1500, costFertilizerHec: 3000, costLaborHec: 8000, costOtherHec: 2000, laborDaysHec: 30, difficultyLevel: 2 },
        // NEW PULSES
        { nameEn: 'Gram (Chana)', nameGu: 'ચણા (Chana)', nameHi: 'चना', category: 'Pulse', icon: '🌿', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 15, optimalTempMax: 25, suitableSoilTypes: 'Loam, Clay', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 250000, growingSeasonDays: 110, suitableSeasons: 'Rabi', suitableTalukas: 'Mehsana, Kadi, Patan, Radhanpur', yieldMinQuintalHec: 15, yieldMaxQuintalHec: 25, costSeedHec: 4000, costFertilizerHec: 3000, costLaborHec: 10000, costOtherHec: 2000, laborDaysHec: 30, difficultyLevel: 2 },
        { nameEn: 'Moong', nameGu: 'મગ (Mag)', nameHi: 'मूंग', category: 'Pulse', icon: '🌿', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 25, optimalTempMax: 35, suitableSoilTypes: 'Sandy, Loam', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 200000, growingSeasonDays: 70, suitableSeasons: 'Kharif, Summer', suitableTalukas: 'Rajkot, Gondal, Amreli, Savarkundla', yieldMinQuintalHec: 10, yieldMaxQuintalHec: 15, costSeedHec: 3000, costFertilizerHec: 2000, costLaborHec: 8000, costOtherHec: 1500, laborDaysHec: 20, difficultyLevel: 1 },
        { nameEn: 'Urad', nameGu: 'અડદ (Adad)', nameHi: 'उड़द', category: 'Pulse', icon: '🌿', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 25, optimalTempMax: 35, suitableSoilTypes: 'Black, Loam', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 200000, growingSeasonDays: 80, suitableSeasons: 'Kharif', suitableTalukas: 'Junagadh City, Keshod', yieldMinQuintalHec: 10, yieldMaxQuintalHec: 15, costSeedHec: 3000, costFertilizerHec: 2000, costLaborHec: 8000, costOtherHec: 1500, laborDaysHec: 25, difficultyLevel: 1 },
        { nameEn: 'Masoor', nameGu: 'મસૂર (Masoor)', nameHi: 'मसूर', category: 'Pulse', icon: '🌿', optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 15, optimalTempMax: 25, suitableSoilTypes: 'Loam, Clay', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 200000, growingSeasonDays: 110, suitableSeasons: 'Rabi', suitableTalukas: 'Palanpur, Patan', yieldMinQuintalHec: 12, yieldMaxQuintalHec: 18, costSeedHec: 3000, costFertilizerHec: 2000, costLaborHec: 8000, costOtherHec: 1500, laborDaysHec: 25, difficultyLevel: 2 },
        { nameEn: 'Peas', nameGu: 'વટાણા (Vatana)', nameHi: 'मटर', category: 'Pulse', icon: '🌿', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 10, optimalTempMax: 20, suitableSoilTypes: 'Loam, Clay', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 250000, growingSeasonDays: 100, suitableSeasons: 'Rabi', suitableTalukas: 'Deesa, Palanpur', yieldMinQuintalHec: 15, yieldMaxQuintalHec: 25, costSeedHec: 4000, costFertilizerHec: 3000, costLaborHec: 10000, costOtherHec: 2000, laborDaysHec: 35, difficultyLevel: 2 },
        { nameEn: 'Cowpea', nameGu: 'ચોળી (Choli)', nameHi: 'लोबिया', category: 'Pulse', icon: '🌿', optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Sandy, Loam', minPh: 5.5, maxPh: 7.5, waterReqLitersHec: 200000, growingSeasonDays: 90, suitableSeasons: 'Kharif, Summer', suitableTalukas: 'Bhuj, Mandvi', yieldMinQuintalHec: 12, yieldMaxQuintalHec: 20, costSeedHec: 2500, costFertilizerHec: 2000, costLaborHec: 8000, costOtherHec: 1500, laborDaysHec: 25, difficultyLevel: 1 },
        // NEW OILSEEDS
        { nameEn: 'Soybean', nameGu: 'સોયાબીન (Soyabean)', nameHi: 'सोयाबीन', category: 'Oil Seed', icon: '🌱', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Black, Loam', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 350000, growingSeasonDays: 100, suitableSeasons: 'Kharif', suitableTalukas: 'Dahod, Devgadh Baria', yieldMinQuintalHec: 15, yieldMaxQuintalHec: 25, costSeedHec: 4000, costFertilizerHec: 5000, costLaborHec: 10000, costOtherHec: 2500, laborDaysHec: 30, difficultyLevel: 2 },
        { nameEn: 'Sunflower', nameGu: 'સૂર્યમુખી (Suryamukhi)', nameHi: 'सूरजमुखी', category: 'Oil Seed', icon: '🌻', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 20, optimalTempMax: 30, suitableSoilTypes: 'Sandy, Loam', minPh: 6.5, maxPh: 8.0, waterReqLitersHec: 300000, growingSeasonDays: 100, suitableSeasons: 'Rabi, Summer', suitableTalukas: 'Anand, Borsad', yieldMinQuintalHec: 12, yieldMaxQuintalHec: 20, costSeedHec: 3000, costFertilizerHec: 4000, costLaborHec: 8000, costOtherHec: 2000, laborDaysHec: 25, difficultyLevel: 2 },
        { nameEn: 'Linseed', nameGu: 'અળસી (Alsi)', nameHi: 'अलसी', category: 'Oil Seed', icon: '🌱', optimalRainfallMin: 500, optimalRainfallMax: 800, optimalTempMin: 15, optimalTempMax: 25, suitableSoilTypes: 'Clay, Loam', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 250000, growingSeasonDays: 120, suitableSeasons: 'Rabi', suitableTalukas: 'Patan, Mehsana', yieldMinQuintalHec: 10, yieldMaxQuintalHec: 15, costSeedHec: 2000, costFertilizerHec: 3000, costLaborHec: 8000, costOtherHec: 1500, laborDaysHec: 25, difficultyLevel: 2 },
        { nameEn: 'Niger', nameGu: 'ખુરાસાની (Khurasani)', nameHi: 'रामतिल', category: 'Oil Seed', icon: '🌱', optimalRainfallMin: 800, optimalRainfallMax: 1500, optimalTempMin: 18, optimalTempMax: 30, suitableSoilTypes: 'Red, Loam', minPh: 5.5, maxPh: 7.0, waterReqLitersHec: 300000, growingSeasonDays: 100, suitableSeasons: 'Kharif', suitableTalukas: 'Ahwa, Chhota Udaipur', yieldMinQuintalHec: 5, yieldMaxQuintalHec: 10, costSeedHec: 1500, costFertilizerHec: 2000, costLaborHec: 8000, costOtherHec: 1500, laborDaysHec: 25, difficultyLevel: 1 },
        // NEW CASH CROPS
        { nameEn: 'Tobacco', nameGu: 'તમાકુ (Tamaku)', nameHi: 'तंबाकू', category: 'Cash Crop', icon: '🚬', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 15, optimalTempMax: 35, suitableSoilTypes: 'Sandy Loam', minPh: 5.5, maxPh: 6.5, waterReqLitersHec: 400000, growingSeasonDays: 150, suitableSeasons: 'Rabi', suitableTalukas: 'Anand, Petlad, Nadiad, Kheda', yieldMinQuintalHec: 15, yieldMaxQuintalHec: 25, costSeedHec: 2000, costFertilizerHec: 6000, costLaborHec: 20000, costOtherHec: 5000, laborDaysHec: 80, difficultyLevel: 3 },
        { nameEn: 'Isabgol', nameGu: 'ઇસબગુલ (Isabgul)', nameHi: 'ईसबगोल', category: 'Cash Crop', icon: '🌾', optimalRainfallMin: 300, optimalRainfallMax: 500, optimalTempMin: 15, optimalTempMax: 30, suitableSoilTypes: 'Sandy', minPh: 7.0, maxPh: 8.5, waterReqLitersHec: 200000, growingSeasonDays: 120, suitableSeasons: 'Rabi', suitableTalukas: 'Palanpur, Deesa', yieldMinQuintalHec: 8, yieldMaxQuintalHec: 12, costSeedHec: 1500, costFertilizerHec: 3000, costLaborHec: 10000, costOtherHec: 2000, laborDaysHec: 35, difficultyLevel: 2 },
        { nameEn: 'Coriander', nameGu: 'ધાણા (Dhana)', nameHi: 'धनिया', category: 'Spice', icon: '🌿', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 15, optimalTempMax: 25, suitableSoilTypes: 'Clay, Loam, Black', minPh: 6.5, maxPh: 8.0, waterReqLitersHec: 250000, growingSeasonDays: 110, suitableSeasons: 'Rabi', suitableTalukas: 'Rajkot, Gondal', yieldMinQuintalHec: 10, yieldMaxQuintalHec: 18, costSeedHec: 2500, costFertilizerHec: 3000, costLaborHec: 12000, costOtherHec: 3000, laborDaysHec: 35, difficultyLevel: 2 },
        { nameEn: 'Fennel', nameGu: 'વરિયાળી (Variyali)', nameHi: 'सौंफ', category: 'Spice', icon: '🌿', optimalRainfallMin: 500, optimalRainfallMax: 800, optimalTempMin: 15, optimalTempMax: 30, suitableSoilTypes: 'Loam, Black', minPh: 6.5, maxPh: 8.0, waterReqLitersHec: 250000, growingSeasonDays: 160, suitableSeasons: 'Rabi', suitableTalukas: 'Surendranagar, Wadhwan', yieldMinQuintalHec: 15, yieldMaxQuintalHec: 25, costSeedHec: 2500, costFertilizerHec: 4000, costLaborHec: 15000, costOtherHec: 3000, laborDaysHec: 40, difficultyLevel: 3 },
        { nameEn: 'Fenugreek (Methi)', nameGu: 'મેથી (Methi)', nameHi: 'मेथी', category: 'Spice', icon: '🌿', optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 10, optimalTempMax: 25, suitableSoilTypes: 'Loam, Sandy', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 200000, growingSeasonDays: 100, suitableSeasons: 'Rabi', suitableTalukas: 'Mehsana, Patan', yieldMinQuintalHec: 10, yieldMaxQuintalHec: 15, costSeedHec: 1500, costFertilizerHec: 2500, costLaborHec: 8000, costOtherHec: 2000, laborDaysHec: 25, difficultyLevel: 1 },
        // NEW FRUITS
        { nameEn: 'Chikoo (Sapota)', nameGu: 'ચીકુ (Chiku)', nameHi: 'चीकू', category: 'Fruit', icon: '🥝', optimalRainfallMin: 1500, optimalRainfallMax: 2500, optimalTempMin: 15, optimalTempMax: 35, suitableSoilTypes: 'Deep Alluvial, Coastal', minPh: 6.0, maxPh: 8.0, waterReqLitersHec: 1000000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Valsad, Pardi, Umbergaon, Navsari, Gandevi', yieldMinQuintalHec: 100, yieldMaxQuintalHec: 200, costSeedHec: 20000, costFertilizerHec: 15000, costLaborHec: 30000, costOtherHec: 10000, laborDaysHec: 80, difficultyLevel: 3 },
        { nameEn: 'Pomegranate', nameGu: 'દાડમ (Dadam)', nameHi: 'अनार', category: 'Fruit', icon: '🍎', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 15, optimalTempMax: 35, suitableSoilTypes: 'Sandy, Loam, Arid', minPh: 6.5, maxPh: 8.0, waterReqLitersHec: 600000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Banaskantha, Deesa, Palanpur', yieldMinQuintalHec: 100, yieldMaxQuintalHec: 150, costSeedHec: 30000, costFertilizerHec: 25000, costLaborHec: 40000, costOtherHec: 15000, laborDaysHec: 100, difficultyLevel: 4 },
        { nameEn: 'Papaya', nameGu: 'પપૈયા (Papaiya)', nameHi: 'पपीता', category: 'Fruit', icon: '🍈', optimalRainfallMin: 800, optimalRainfallMax: 1500, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Loam, Light Black', minPh: 6.5, maxPh: 7.5, waterReqLitersHec: 1200000, growingSeasonDays: 300, suitableSeasons: 'Kharif', suitableTalukas: 'Anand, Borsad, Petlad', yieldMinQuintalHec: 300, yieldMaxQuintalHec: 600, costSeedHec: 15000, costFertilizerHec: 20000, costLaborHec: 40000, costOtherHec: 10000, laborDaysHec: 90, difficultyLevel: 3 },
        { nameEn: 'Guava', nameGu: 'જામફળ (Jamfal)', nameHi: 'अमरूद', category: 'Fruit', icon: '🍐', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 15, optimalTempMax: 35, suitableSoilTypes: 'Loam, Light Calcareous', minPh: 6.5, maxPh: 8.0, waterReqLitersHec: 800000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Mehsana, Kadi, Visnagar, Bhavnagar', yieldMinQuintalHec: 150, yieldMaxQuintalHec: 250, costSeedHec: 10000, costFertilizerHec: 15000, costLaborHec: 25000, costOtherHec: 8000, laborDaysHec: 60, difficultyLevel: 2 },
        { nameEn: 'Lemon', nameGu: 'લીંબુ (Limbu)', nameHi: 'नींबू', category: 'Fruit', icon: '🍋', optimalRainfallMin: 600, optimalRainfallMax: 1500, optimalTempMin: 15, optimalTempMax: 35, suitableSoilTypes: 'Loam, Medium Black', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 800000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Surat City, Mangrol, Mandvi', yieldMinQuintalHec: 100, yieldMaxQuintalHec: 180, costSeedHec: 12000, costFertilizerHec: 18000, costLaborHec: 30000, costOtherHec: 8000, laborDaysHec: 80, difficultyLevel: 3 },
        { nameEn: 'Date Palm', nameGu: 'ખજૂર (Khajur)', nameHi: 'खजूर', category: 'Fruit', icon: '🌴', optimalRainfallMin: 200, optimalRainfallMax: 500, optimalTempMin: 10, optimalTempMax: 45, suitableSoilTypes: 'Sandy, Saline', minPh: 7.0, maxPh: 8.5, waterReqLitersHec: 500000, growingSeasonDays: 365, suitableSeasons: 'Summer', suitableTalukas: 'Bhuj, Mandvi, Mundra, Anjar', yieldMinQuintalHec: 50, yieldMaxQuintalHec: 100, costSeedHec: 40000, costFertilizerHec: 20000, costLaborHec: 50000, costOtherHec: 15000, laborDaysHec: 120, difficultyLevel: 4 },
        { nameEn: 'Watermelon', nameGu: 'તરબૂચ (Tarbuch)', nameHi: 'तरबूज', category: 'Fruit', icon: '🍉', optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 25, optimalTempMax: 40, suitableSoilTypes: 'Sandy, Riverbed Loam', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 400000, growingSeasonDays: 80, suitableSeasons: 'Summer', suitableTalukas: 'Bhuj, Rapar, Banaskantha', yieldMinQuintalHec: 250, yieldMaxQuintalHec: 400, costSeedHec: 15000, costFertilizerHec: 20000, costLaborHec: 30000, costOtherHec: 10000, laborDaysHec: 50, difficultyLevel: 2 },
        { nameEn: 'Muskmelon', nameGu: 'ટેટી (Teti)', nameHi: 'खरबूजा', category: 'Fruit', icon: '🍈', optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 22, optimalTempMax: 38, suitableSoilTypes: 'Sandy, Loam', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 350000, growingSeasonDays: 90, suitableSeasons: 'Summer', suitableTalukas: 'Banaskantha, Patan, Mehsana', yieldMinQuintalHec: 150, yieldMaxQuintalHec: 250, costSeedHec: 12000, costFertilizerHec: 15000, costLaborHec: 25000, costOtherHec: 8000, laborDaysHec: 45, difficultyLevel: 2 },
        { nameEn: 'Dragon Fruit (Kamalam)', nameGu: 'કમલમ (Kamalam)', nameHi: 'ड्रैगन फ्रूट', category: 'Fruit', icon: '🐲', optimalRainfallMin: 300, optimalRainfallMax: 800, optimalTempMin: 20, optimalTempMax: 40, suitableSoilTypes: 'Sandy, Arid, Rocky', minPh: 5.5, maxPh: 7.5, waterReqLitersHec: 200000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Bhuj, Anjar, Palanpur, Deesa', yieldMinQuintalHec: 50, yieldMaxQuintalHec: 100, costSeedHec: 80000, costFertilizerHec: 30000, costLaborHec: 40000, costOtherHec: 20000, laborDaysHec: 100, difficultyLevel: 4 },
        { nameEn: 'Coconut', nameGu: 'નાળિયેર (Naliyer)', nameHi: 'नारियल', category: 'Fruit', icon: '🥥', optimalRainfallMin: 1000, optimalRainfallMax: 2500, optimalTempMin: 22, optimalTempMax: 35, suitableSoilTypes: 'Coastal Saline, Sandy', minPh: 6.0, maxPh: 8.0, waterReqLitersHec: 1500000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Veraval, Una, Kodinar, Mangrol, Navsari, Valsad', yieldMinQuintalHec: 80, yieldMaxQuintalHec: 150, costSeedHec: 25000, costFertilizerHec: 20000, costLaborHec: 35000, costOtherHec: 10000, laborDaysHec: 90, difficultyLevel: 3 },
        // NEW VEGETABLES
        { nameEn: 'Tomato', nameGu: 'ટામેટા (Tameta)', nameHi: 'टमाटर', category: 'Vegetable', icon: '🍅', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 18, optimalTempMax: 30, suitableSoilTypes: 'Loam, Sandy Loam', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 500000, growingSeasonDays: 100, suitableSeasons: 'Rabi, Summer', suitableTalukas: 'Anand, Petlad, Borsad', yieldMinQuintalHec: 250, yieldMaxQuintalHec: 450, costSeedHec: 20000, costFertilizerHec: 15000, costLaborHec: 40000, costOtherHec: 10000, laborDaysHec: 80, difficultyLevel: 3 },
        { nameEn: 'Brinjal', nameGu: 'રીંગણ (Ringan)', nameHi: 'बैंगन', category: 'Vegetable', icon: '🍆', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Loam, Black', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 400000, growingSeasonDays: 120, suitableSeasons: 'Kharif, Rabi', suitableTalukas: 'Ahmedabad City, Daskroi, Sanand', yieldMinQuintalHec: 200, yieldMaxQuintalHec: 350, costSeedHec: 12000, costFertilizerHec: 15000, costLaborHec: 30000, costOtherHec: 8000, laborDaysHec: 70, difficultyLevel: 2 },
        { nameEn: 'Cabbage', nameGu: 'કોબીજ (Kobij)', nameHi: 'पत्ता गोभी', category: 'Vegetable', icon: '🥬', optimalRainfallMin: 500, optimalRainfallMax: 800, optimalTempMin: 12, optimalTempMax: 25, suitableSoilTypes: 'Loam, Clay', minPh: 6.0, maxPh: 7.0, waterReqLitersHec: 350000, growingSeasonDays: 90, suitableSeasons: 'Rabi', suitableTalukas: 'Nadiad, Kapadvanj, Mehmedabad', yieldMinQuintalHec: 300, yieldMaxQuintalHec: 500, costSeedHec: 15000, costFertilizerHec: 25000, costLaborHec: 35000, costOtherHec: 10000, laborDaysHec: 60, difficultyLevel: 3 },
        { nameEn: 'Cauliflower', nameGu: 'ફુલાવર (Fulavar)', nameHi: 'फूलगोभी', category: 'Vegetable', icon: '🥦', optimalRainfallMin: 500, optimalRainfallMax: 800, optimalTempMin: 12, optimalTempMax: 25, suitableSoilTypes: 'Loam, Clay', minPh: 6.0, maxPh: 7.0, waterReqLitersHec: 350000, growingSeasonDays: 100, suitableSeasons: 'Rabi', suitableTalukas: 'Mehsana, Kadi, Visnagar', yieldMinQuintalHec: 250, yieldMaxQuintalHec: 400, costSeedHec: 18000, costFertilizerHec: 25000, costLaborHec: 35000, costOtherHec: 10000, laborDaysHec: 65, difficultyLevel: 3 },
        { nameEn: 'Okra (Bhindi)', nameGu: 'ભીંડા (Bhinda)', nameHi: 'भिंडी', category: 'Vegetable', icon: '🥒', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 22, optimalTempMax: 35, suitableSoilTypes: 'Loam, Sandy Loam', minPh: 6.0, maxPh: 7.0, waterReqLitersHec: 300000, growingSeasonDays: 90, suitableSeasons: 'Kharif, Summer', suitableTalukas: 'Vadodara, Karjan, Padra', yieldMinQuintalHec: 100, yieldMaxQuintalHec: 150, costSeedHec: 10000, costFertilizerHec: 12000, costLaborHec: 35000, costOtherHec: 5000, laborDaysHec: 80, difficultyLevel: 2 },
        { nameEn: 'Chilli', nameGu: 'મરચું (Marchu)', nameHi: 'मिर्च', category: 'Vegetable', icon: '🌶️', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Loam, Medium Black', minPh: 6.5, maxPh: 8.0, waterReqLitersHec: 400000, growingSeasonDays: 180, suitableSeasons: 'Kharif, Rabi', suitableTalukas: 'Rajkot, Gondal, Jasdan', yieldMinQuintalHec: 80, yieldMaxQuintalHec: 140, costSeedHec: 15000, costFertilizerHec: 20000, costLaborHec: 45000, costOtherHec: 10000, laborDaysHec: 100, difficultyLevel: 3 },
        { nameEn: 'Ginger', nameGu: 'આદુ (Aadu)', nameHi: 'अदरक', category: 'Spice', icon: '🫚', optimalRainfallMin: 1200, optimalRainfallMax: 2000, optimalTempMin: 20, optimalTempMax: 32, suitableSoilTypes: 'Loam, Rich Organic', minPh: 6.0, maxPh: 7.0, waterReqLitersHec: 600000, growingSeasonDays: 240, suitableSeasons: 'Kharif', suitableTalukas: 'Navsari, Vansda, Dang, Ahwa', yieldMinQuintalHec: 150, yieldMaxQuintalHec: 250, costSeedHec: 40000, costFertilizerHec: 25000, costLaborHec: 40000, costOtherHec: 15000, laborDaysHec: 110, difficultyLevel: 4 },
        { nameEn: 'Turmeric', nameGu: 'હળદર (Haldar)', nameHi: 'हल्दी', category: 'Spice', icon: '🫚', optimalRainfallMin: 1200, optimalRainfallMax: 2000, optimalTempMin: 20, optimalTempMax: 32, suitableSoilTypes: 'Loam, Rich Organic', minPh: 5.5, maxPh: 7.5, waterReqLitersHec: 600000, growingSeasonDays: 240, suitableSeasons: 'Kharif', suitableTalukas: 'Navsari, Chikhli, Vansda', yieldMinQuintalHec: 200, yieldMaxQuintalHec: 300, costSeedHec: 35000, costFertilizerHec: 20000, costLaborHec: 35000, costOtherHec: 12000, laborDaysHec: 100, difficultyLevel: 3 },
        { nameEn: 'Spinach', nameGu: 'પાલક (Palak)', nameHi: 'पालक', category: 'Vegetable', icon: '🥬', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 10, optimalTempMax: 25, suitableSoilTypes: 'Loam, Sandy', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 200000, growingSeasonDays: 45, suitableSeasons: 'Rabi', suitableTalukas: 'Ahmedabad City, Gandhinagar, Rajkot, Surat City, Vadodara', yieldMinQuintalHec: 100, yieldMaxQuintalHec: 150, costSeedHec: 3000, costFertilizerHec: 5000, costLaborHec: 20000, costOtherHec: 3000, laborDaysHec: 40, difficultyLevel: 1 },
        { nameEn: 'Cucumber', nameGu: 'કાકડી (Kakdi)', nameHi: 'खीरा', category: 'Vegetable', icon: '🥒', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Sandy, Riverbed', minPh: 6.0, maxPh: 7.0, waterReqLitersHec: 250000, growingSeasonDays: 70, suitableSeasons: 'Summer', suitableTalukas: 'Bhuj, Mandvi, Deesa', yieldMinQuintalHec: 150, yieldMaxQuintalHec: 250, costSeedHec: 5000, costFertilizerHec: 8000, costLaborHec: 25000, costOtherHec: 4000, laborDaysHec: 50, difficultyLevel: 2 },
        { nameEn: 'Radish', nameGu: 'મૂળો (Mulo)', nameHi: 'मूली', category: 'Vegetable', icon: '🥕', optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 10, optimalTempMax: 25, suitableSoilTypes: 'Sandy Loam', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 200000, growingSeasonDays: 60, suitableSeasons: 'Rabi', suitableTalukas: 'Palanpur, Mehsana, Patan', yieldMinQuintalHec: 200, yieldMaxQuintalHec: 300, costSeedHec: 4000, costFertilizerHec: 6000, costLaborHec: 20000, costOtherHec: 4000, laborDaysHec: 45, difficultyLevel: 1 },
        // MORE FRUITS
        { nameEn: 'Custard Apple', nameGu: 'સીતાફળ (Sitafal)', nameHi: 'सीताफल', category: 'Fruit', icon: '🍏', optimalRainfallMin: 500, optimalRainfallMax: 800, optimalTempMin: 15, optimalTempMax: 35, suitableSoilTypes: 'Sandy Loam, Poor Soils', minPh: 6.0, maxPh: 8.0, waterReqLitersHec: 400000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Dahod, Devgadh Baria, Bhavnagar', yieldMinQuintalHec: 50, yieldMaxQuintalHec: 100, costSeedHec: 10000, costFertilizerHec: 12000, costLaborHec: 20000, costOtherHec: 5000, laborDaysHec: 60, difficultyLevel: 2 },
        { nameEn: 'Jackfruit', nameGu: 'ફણસ (Fanas)', nameHi: 'कटहल', category: 'Fruit', icon: '🍈', optimalRainfallMin: 1500, optimalRainfallMax: 2500, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Deep Alluvial, Laterite', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 1200000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Ahwa, Waghai, Saputara, Navsari', yieldMinQuintalHec: 200, yieldMaxQuintalHec: 400, costSeedHec: 15000, costFertilizerHec: 15000, costLaborHec: 30000, costOtherHec: 8000, laborDaysHec: 80, difficultyLevel: 3 },
        { nameEn: 'Amla', nameGu: 'આમળા (Amla)', nameHi: 'आंवला', category: 'Fruit', icon: '🍏', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 15, optimalTempMax: 40, suitableSoilTypes: 'Sandy, Light Black', minPh: 6.5, maxPh: 8.5, waterReqLitersHec: 500000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Dahod, Panchmahal, Mehsana', yieldMinQuintalHec: 100, yieldMaxQuintalHec: 200, costSeedHec: 12000, costFertilizerHec: 15000, costLaborHec: 25000, costOtherHec: 6000, laborDaysHec: 70, difficultyLevel: 2 },
        { nameEn: 'Ber (Jujube)', nameGu: 'બોર (Bor)', nameHi: 'बेर', category: 'Fruit', icon: '🍒', optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 15, optimalTempMax: 45, suitableSoilTypes: 'Sandy, Saline, Arid', minPh: 7.0, maxPh: 8.5, waterReqLitersHec: 300000, growingSeasonDays: 365, suitableSeasons: 'Summer, Kharif', suitableTalukas: 'Bhuj, Anjar, Rapar, Mandvi', yieldMinQuintalHec: 80, yieldMaxQuintalHec: 150, costSeedHec: 10000, costFertilizerHec: 12000, costLaborHec: 25000, costOtherHec: 5000, laborDaysHec: 60, difficultyLevel: 2 },
        { nameEn: 'Pineapple', nameGu: 'અનાનસ (Ananas)', nameHi: 'अनानास', category: 'Fruit', icon: '🍍', optimalRainfallMin: 1500, optimalRainfallMax: 2500, optimalTempMin: 20, optimalTempMax: 32, suitableSoilTypes: 'Laterite, Sandy Loam', minPh: 5.5, maxPh: 6.5, waterReqLitersHec: 1000000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Ahwa, Waghai, Dang, Navsari', yieldMinQuintalHec: 200, yieldMaxQuintalHec: 350, costSeedHec: 30000, costFertilizerHec: 25000, costLaborHec: 40000, costOtherHec: 10000, laborDaysHec: 90, difficultyLevel: 4 },
        { nameEn: 'Grapes', nameGu: 'દ્રાક્ષ (Draksh)', nameHi: 'अंगूर', category: 'Fruit', icon: '🍇', optimalRainfallMin: 500, optimalRainfallMax: 800, optimalTempMin: 15, optimalTempMax: 35, suitableSoilTypes: 'Well-drained Loam, Sandy', minPh: 6.5, maxPh: 7.5, waterReqLitersHec: 800000, growingSeasonDays: 365, suitableSeasons: 'Rabi, Summer', suitableTalukas: 'Deesa, Palanpur, Banaskantha', yieldMinQuintalHec: 150, yieldMaxQuintalHec: 250, costSeedHec: 50000, costFertilizerHec: 30000, costLaborHec: 50000, costOtherHec: 20000, laborDaysHec: 120, difficultyLevel: 5 },
        // MORE VEGETABLES
        { nameEn: 'Bottle Gourd', nameGu: 'દૂધી (Dudhi)', nameHi: 'लौकी', category: 'Vegetable', icon: '🥒', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Sandy Loam, Alluvial', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 400000, growingSeasonDays: 120, suitableSeasons: 'Kharif, Summer', suitableTalukas: 'Vadodara, Anand, Nadiad, Surat City', yieldMinQuintalHec: 200, yieldMaxQuintalHec: 350, costSeedHec: 8000, costFertilizerHec: 12000, costLaborHec: 25000, costOtherHec: 5000, laborDaysHec: 70, difficultyLevel: 2 },
        { nameEn: 'Ridge Gourd', nameGu: 'તુરીયા (Turiya)', nameHi: 'तोरई', category: 'Vegetable', icon: '🥒', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 22, optimalTempMax: 35, suitableSoilTypes: 'Loam, Sandy Loam', minPh: 6.5, maxPh: 7.5, waterReqLitersHec: 350000, growingSeasonDays: 110, suitableSeasons: 'Kharif, Summer', suitableTalukas: 'Vadodara, Anand, Kheda', yieldMinQuintalHec: 150, yieldMaxQuintalHec: 250, costSeedHec: 8000, costFertilizerHec: 10000, costLaborHec: 25000, costOtherHec: 5000, laborDaysHec: 65, difficultyLevel: 2 },
        { nameEn: 'Bitter Gourd', nameGu: 'કારેલા (Karela)', nameHi: 'करेला', category: 'Vegetable', icon: '🥒', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 25, optimalTempMax: 35, suitableSoilTypes: 'Loam, Sandy Loam', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 350000, growingSeasonDays: 100, suitableSeasons: 'Kharif, Summer', suitableTalukas: 'Surat City, Navsari, Valsad', yieldMinQuintalHec: 120, yieldMaxQuintalHec: 200, costSeedHec: 10000, costFertilizerHec: 12000, costLaborHec: 30000, costOtherHec: 8000, laborDaysHec: 75, difficultyLevel: 3 },
        { nameEn: 'Carrot', nameGu: 'ગાજર (Gajar)', nameHi: 'गाजर', category: 'Vegetable', icon: '🥕', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 12, optimalTempMax: 25, suitableSoilTypes: 'Deep Sandy Loam', minPh: 6.0, maxPh: 7.0, waterReqLitersHec: 300000, growingSeasonDays: 90, suitableSeasons: 'Rabi', suitableTalukas: 'Palanpur, Deesa, Tharad', yieldMinQuintalHec: 200, yieldMaxQuintalHec: 300, costSeedHec: 12000, costFertilizerHec: 15000, costLaborHec: 25000, costOtherHec: 8000, laborDaysHec: 60, difficultyLevel: 2 },
        { nameEn: 'Beans (Cluster)', nameGu: 'ગુવાર (Guvar)', nameHi: 'ग्वार फली', category: 'Vegetable', icon: '🫘', optimalRainfallMin: 300, optimalRainfallMax: 600, optimalTempMin: 22, optimalTempMax: 38, suitableSoilTypes: 'Sandy, Light Loam', minPh: 7.0, maxPh: 8.5, waterReqLitersHec: 200000, growingSeasonDays: 90, suitableSeasons: 'Kharif, Summer', suitableTalukas: 'Dahod, Panchmahal, Banaskantha', yieldMinQuintalHec: 50, yieldMaxQuintalHec: 100, costSeedHec: 5000, costFertilizerHec: 8000, costLaborHec: 20000, costOtherHec: 4000, laborDaysHec: 50, difficultyLevel: 2 },
        { nameEn: 'Drumstick', nameGu: 'સરગવો (Saragvo)', nameHi: 'सहजन', category: 'Vegetable', icon: '🎋', optimalRainfallMin: 400, optimalRainfallMax: 1000, optimalTempMin: 20, optimalTempMax: 40, suitableSoilTypes: 'Sandy Loam, Well-drained', minPh: 6.5, maxPh: 8.0, waterReqLitersHec: 300000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Vadodara, Anand, Surat City', yieldMinQuintalHec: 100, yieldMaxQuintalHec: 200, costSeedHec: 8000, costFertilizerHec: 10000, costLaborHec: 20000, costOtherHec: 5000, laborDaysHec: 60, difficultyLevel: 2 },
        // COMMERICAL FLOWERS
        { nameEn: 'Marigold', nameGu: 'ગલગોટો (Galgoto)', nameHi: 'गेंदा', category: 'Cash Crop', icon: '🌼', optimalRainfallMin: 500, optimalRainfallMax: 1000, optimalTempMin: 18, optimalTempMax: 32, suitableSoilTypes: 'Loam, Sandy Loam', minPh: 6.5, maxPh: 7.5, waterReqLitersHec: 400000, growingSeasonDays: 120, suitableSeasons: 'Rabi, Kharif', suitableTalukas: 'Ahmedabad City, Anand, Vadodara', yieldMinQuintalHec: 100, yieldMaxQuintalHec: 200, costSeedHec: 10000, costFertilizerHec: 15000, costLaborHec: 30000, costOtherHec: 8000, laborDaysHec: 80, difficultyLevel: 3 },
        { nameEn: 'Rose', nameGu: 'ગુલાબ (Gulab)', nameHi: 'गुलाब', category: 'Cash Crop', icon: '🌹', optimalRainfallMin: 800, optimalRainfallMax: 1500, optimalTempMin: 15, optimalTempMax: 30, suitableSoilTypes: 'Loam, Well-drained', minPh: 6.0, maxPh: 7.5, waterReqLitersHec: 600000, growingSeasonDays: 365, suitableSeasons: 'Rabi, Kharif', suitableTalukas: 'Navsari, Surat City, Valsad', yieldMinQuintalHec: 50, yieldMaxQuintalHec: 100, costSeedHec: 25000, costFertilizerHec: 20000, costLaborHec: 45000, costOtherHec: 15000, laborDaysHec: 110, difficultyLevel: 4 },
        { nameEn: 'Jasmine', nameGu: 'મોગરો (Mogro)', nameHi: 'मोगरा', category: 'Cash Crop', icon: '🌸', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 22, optimalTempMax: 35, suitableSoilTypes: 'Sandy Loam, Black', minPh: 6.5, maxPh: 8.0, waterReqLitersHec: 500000, growingSeasonDays: 365, suitableSeasons: 'Summer, Kharif', suitableTalukas: 'Bhavnagar, Amreli', yieldMinQuintalHec: 40, yieldMaxQuintalHec: 80, costSeedHec: 20000, costFertilizerHec: 18000, costLaborHec: 40000, costOtherHec: 12000, laborDaysHec: 100, difficultyLevel: 3 },
        { nameEn: 'Tuberose', nameGu: 'રજનીગંધા (Rajnigandha)', nameHi: 'रजनीगंधा', category: 'Cash Crop', icon: '💮', optimalRainfallMin: 800, optimalRainfallMax: 1200, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Loam, Sandy Loam', minPh: 6.5, maxPh: 7.5, waterReqLitersHec: 600000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Navsari, Valsad, Surat City', yieldMinQuintalHec: 60, yieldMaxQuintalHec: 120, costSeedHec: 35000, costFertilizerHec: 25000, costLaborHec: 50000, costOtherHec: 15000, laborDaysHec: 120, difficultyLevel: 4 },
        { nameEn: 'Chrysanthemum', nameGu: 'સેવંતી (Sevanti)', nameHi: 'गुलदाउदी', category: 'Cash Crop', icon: '🏵️', optimalRainfallMin: 600, optimalRainfallMax: 1000, optimalTempMin: 15, optimalTempMax: 25, suitableSoilTypes: 'Loam, Well-drained', minPh: 6.0, maxPh: 7.0, waterReqLitersHec: 500000, growingSeasonDays: 140, suitableSeasons: 'Rabi', suitableTalukas: 'Ahmedabad City, Gandhinagar', yieldMinQuintalHec: 80, yieldMaxQuintalHec: 150, costSeedHec: 15000, costFertilizerHec: 20000, costLaborHec: 35000, costOtherHec: 10000, laborDaysHec: 90, difficultyLevel: 3 },
        // MEDICINAL & AROMATIC
        { nameEn: 'Ashwagandha', nameGu: 'અશ્વગંધા (Ashwagandha)', nameHi: 'अश्वगंधा', category: 'Cash Crop', icon: '🌾', optimalRainfallMin: 400, optimalRainfallMax: 800, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Sandy, Light Loam', minPh: 7.0, maxPh: 8.5, waterReqLitersHec: 250000, growingSeasonDays: 160, suitableSeasons: 'Rabi, Kharif', suitableTalukas: 'Banaskantha, Patan, Mehsana', yieldMinQuintalHec: 5, yieldMaxQuintalHec: 10, costSeedHec: 5000, costFertilizerHec: 8000, costLaborHec: 20000, costOtherHec: 5000, laborDaysHec: 60, difficultyLevel: 3 },
        { nameEn: 'Aloe Vera', nameGu: 'કુંવારપાઠું (Kunwarpathu)', nameHi: 'घृतकुमारी', category: 'Cash Crop', icon: '🌵', optimalRainfallMin: 200, optimalRainfallMax: 600, optimalTempMin: 15, optimalTempMax: 45, suitableSoilTypes: 'Sandy, Arid, Gravel', minPh: 7.0, maxPh: 8.5, waterReqLitersHec: 200000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Kutch, Surendranagar, Banaskantha', yieldMinQuintalHec: 200, yieldMaxQuintalHec: 400, costSeedHec: 25000, costFertilizerHec: 10000, costLaborHec: 30000, costOtherHec: 8000, laborDaysHec: 80, difficultyLevel: 2 },
        { nameEn: 'Lemongrass', nameGu: 'લીલી ચા (Lili Cha)', nameHi: 'लेमनग्रास', category: 'Cash Crop', icon: '🌿', optimalRainfallMin: 800, optimalRainfallMax: 1500, optimalTempMin: 20, optimalTempMax: 35, suitableSoilTypes: 'Loam, Light Black', minPh: 5.5, maxPh: 7.5, waterReqLitersHec: 600000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Panchmahal, Dahod, Mahisagar', yieldMinQuintalHec: 150, yieldMaxQuintalHec: 250, costSeedHec: 10000, costFertilizerHec: 12000, costLaborHec: 25000, costOtherHec: 6000, laborDaysHec: 70, difficultyLevel: 2 },
        { nameEn: 'Neem', nameGu: 'લીમડો (Limdo)', nameHi: 'नीम', category: 'Cash Crop', icon: '🌳', optimalRainfallMin: 400, optimalRainfallMax: 1200, optimalTempMin: 10, optimalTempMax: 45, suitableSoilTypes: 'All types, Arid, Saline', minPh: 6.0, maxPh: 8.5, waterReqLitersHec: 250000, growingSeasonDays: 365, suitableSeasons: 'Kharif', suitableTalukas: 'Ahmedabad City, Gandhinagar, Rajkot, Surat City, Vadodara, Bhuj', yieldMinQuintalHec: 10, yieldMaxQuintalHec: 30, costSeedHec: 2000, costFertilizerHec: 5000, costLaborHec: 15000, costOtherHec: 4000, laborDaysHec: 40, difficultyLevel: 1 },
        { nameEn: 'Tulsi', nameGu: 'તુલસી (Tulsi)', nameHi: 'तुलसी', category: 'Spice', icon: '🌿', optimalRainfallMin: 600, optimalRainfallMax: 1200, optimalTempMin: 15, optimalTempMax: 35, suitableSoilTypes: 'Loam, Well-drained', minPh: 5.5, maxPh: 7.5, waterReqLitersHec: 350000, growingSeasonDays: 120, suitableSeasons: 'Kharif, Summer', suitableTalukas: 'Anand, Nadiad, Vadodara, Surat City', yieldMinQuintalHec: 20, yieldMaxQuintalHec: 40, costSeedHec: 5000, costFertilizerHec: 8000, costLaborHec: 18000, costOtherHec: 4000, laborDaysHec: 50, difficultyLevel: 2 }
    ];

    for (const crop of cropsData) {
        await prisma.crop.create({ data: crop });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
