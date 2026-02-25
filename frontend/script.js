const app = {
    apiUrl: 'http://localhost:5000/api',
    currentStep: 1,
    totalSteps: 3,
    currentLang: 'en',
    districtMetadata: [], // Store climate/soil data for all 33 districts

    // Translations Dictionary
    translations: {
        en: {
            navHome: "Home", navRecommend: "Recommend",
            heroTitle: 'Grow Smarter with <span class="highlight">AgroSaathi</span>',
            heroSubtitle: "Get personalized crop recommendations tailored to your district in Gujarat. We analyze soil, water, climate, and market trends to maximize your profit.",
            ctaBtn: "Get Recommendations ➔",
            formTitle: "Farm Profile", formSubtitle: "Tell us about your setup for personalized advice.",
            step1Title: "1. Location & Soil", lblDistrict: "District *", lblTaluka: "Taluka *", talukaSel: "-- Select District First --", lblSoil: "Soil Type *",
            step2Title: "2. Water Availability", watCanal: "Canal (Narmada)", watBore: "Deep Borewell", watRiver: "River/Lake", watRain: "Rain-fed",
            step3Title: "3. Farm Size & Budget", lblFarmSize: "Farm Size (Hectares):", lblBudget: "Investment Budget (₹)",
            lblExp: "Experience Level", expBeg: "Beginner", expInt: "Intermediate", expExp: "Experienced", expCom: "Commercial",
            btnBack: "Back", btnNext: "Next", btnAnalyze: "Analyze", loading: "Generating perfect recommendations...",
            resTitle: "Top Recommendations", resEdit: "Edit Details"
        },
        gu: {
            navHome: "હોમ", navRecommend: "ભલામણ",
            heroTitle: '<span class="highlight">એગ્રોસાથી</span> સાથે વધુ સ્માર્ટ ડેવલપમેન્ટ',
            heroSubtitle: "ગુજરાતમાં તમારા જિલ્લાને અનુરૂપ પાકની ભલામણો મેળવો. અમે તમારો નફો વધારવા માટે માટી, પાણી, આબોહવા અને બજારના વલણોનું વિશ્લેષણ કરીએ છીએ.",
            ctaBtn: "ભલામણો મેળવો ➔",
            formTitle: "ફાર્મ પ્રોફાઇલ", formSubtitle: "વ્યક્તિગત સલાહ માટે અમને તમારા સેટઅપ વિશે જણાવો.",
            step1Title: "1. સ્થાન અને માટી", lblDistrict: "જિલ્લો *", lblTaluka: "તાલુકો *", talukaSel: "-- પ્રથમ જિલ્લો પસંદ કરો --", lblSoil: "જમીનનો પ્રકાર *",
            step2Title: "2. પાણીની ઉપલબ્ધતા", watCanal: "નહેર (નર્મદા)", watBore: "ઊંડા બોરવેલ", watRiver: "નદી/તળાવ", watRain: "વરસાદ આધારિત",
            step3Title: "3. ખેતરનું કદ અને બજેટ", lblFarmSize: "ખેતરનું કદ (હેક્ટર):", lblBudget: "રોકાણ બજેટ (₹)",
            lblExp: "અનુભવ સ્તર", expBeg: "શિખાઉ", expInt: "મધ્યવર્તી", expExp: "અનુભવી", expCom: "વ્યાપારી",
            btnBack: "પાછળ", btnNext: "આગળ", btnAnalyze: "વિશ્લેષણ કરો", loading: "સંપૂર્ણ ભલામણો જનરેટ કરી રહ્યાં છીએ...",
            resTitle: "ટોચની ભલામણો", resEdit: "વિગતો સંપાદિત કરો"
        },
        hi: {
            navHome: "होम", navRecommend: "सिफारिश",
            heroTitle: '<span class="highlight">एग्रोसाथी</span> के साथ स्मार्ट प्रगति',
            heroSubtitle: "गुजरात में अपने जिले के अनुरूप फसल की सिफारिशें प्राप्त करें। हम आपके लाभ को अधिकतम करने के लिए मिट्टी, पानी, जलवायु और बाजार के रुझानों का विश्लेषण करते हैं।",
            ctaBtn: "सिफारिशें प्राप्त करें ➔",
            formTitle: "फार्म प्रोफाइल", formSubtitle: "व्यक्तिगत सलाह के लिए हमें अपने सेटअप के बारे में बताएं।",
            step1Title: "1. स्थान और मिट्टी", lblDistrict: "ज़िला *", lblTaluka: "तालुका *", talukaSel: "-- पहले ज़िला चुनें --", lblSoil: "मिट्टी का प्रकार *",
            step2Title: "2. पानी की उपलब्धता", watCanal: "नहर (नर्मदा)", watBore: "गहरा बोरवेल", watRiver: "नदी/झील", watRain: "वर्षा आधारित",
            step3Title: "3. खेत का आकार और बजट", lblFarmSize: "खेत का आकार (हेक्टेयर):", lblBudget: "निवेश बजट (₹)",
            lblExp: "अनुभव स्तर", expBeg: "शुरुआती", expInt: "मध्यवर्ती", expExp: "अनुभवी", expCom: "व्यावसायिक",
            btnBack: "पीछे", btnNext: "अगला", btnAnalyze: "विश्लेषण करें", loading: "सटीक सिफारिशें उत्पन्न की जा रही हैं...",
            resTitle: "शीर्ष सिफारिशें", resEdit: "विवरण संपादित करें"
        }
    },

    // Taluka Mapping
    talukas: {
        "Ahmedabad": ["Ahmedabad City", "Daskroi", "Sanand", "Bavla", "Dholka", "Viramgam", "Mandal", "Rampur", "Detroj"],
        "Amreli": ["Amreli", "Babra", "Dhari", "Khambhalha", "Jafrabad", "Lilia", "Kunkavav Vadia", "Rajula", "Savarkundla", "Bagasara"],
        "Anand": ["Anand", "Anklav", "Borsad", "Khambhat", "Petlad", "Sojitra", "Tarapur", "Umreth"],
        "Aravalli": ["Modasa", "Bhiloda", "Dhansura", "Malpur", "Meghraj", "Bayad"],
        "Banaskantha": ["Palanpur", "Deesa", "Bhabhar", "Dantiwada", "Danta", "Deodar", "Dhanera", "Kankrej", "Tharad", "Vadgam", "Vav", "Suigam", "Lakhani", "Amirgadh"],
        "Bharuch": ["Bharuch", "Ankleshwar", "Hansot", "Jambusar", "Jhagadia", "Vagra", "Valia", "Netrang", "Amod"],
        "Bhavnagar": ["Bhavnagar", "Gariadhar", "Ghogha", "Jesar", "Mahuva", "Palitana", "Sihor", "Talaja", "Umrala", "Vallabhipur"],
        "Botad": ["Botad", "Barwala", "Gadhada", "Ranpur"],
        "Chhota Udaipur": ["Chhota Udaipur", "Bodeli", "Jetpur Pavi", "Kavant", "Nasvadi", "Sankheda"],
        "Dahod": ["Dahod", "Devgadh Baria", "Fategura", "Garbada", "Limkheda", "Jhalod", "Sanjeli", "Singvad"],
        "Dang": ["Ahwa", "Subir", "Waghai"],
        "Devbhoomi Dwarka": ["Khambhalia", "Bhanvad", "Kalyanpur", "Dwarka"],
        "Gandhinagar": ["Gandhinagar", "Dehgam", "Kalol", "Mansa"],
        "Gir Somnath": ["Veraval", "Gir Gadhada", "Kodinar", "Sutrapada", "Talala", "Una"],
        "Jamnagar": ["Jamnagar", "Dhrol", "Jodiya", "Kalavad", "Lalpur", "Jamjodhpur"],
        "Junagadh": ["Junagadh City", "Bhesan", "Junagadh Rural", "Malia", "Manavadar", "Mangrol", "Mendarda", "Keshod", "Vanthali", "Visavadar"],
        "Kheda": ["Nadiad", "Balasinor", "Dakor", "Kapadvanj", "Kathlal", "Kheda", "Mahudha", "Matar", "Mehmedabad", "Thasra", "Virpur", "Vaso", "Galteshwar"],
        "Kutch": ["Bhuj", "Abdasa", "Anjar", "Bhachau", "Gandhidham", "Lakhpat", "Mandvi", "Mundra", "Nakhatrana", "Rapar"],
        "Mahisagar": ["Lunawada", "Balasinor", "Kadana", "Khanpur", "Santrampur", "Virpur"],
        "Mehsana": ["Mehsana", "Becharaji", "Jotana", "Kadi", "Kheralu", "Satlasana", "Unjha", "Vadnagar", "Vijapur", "Visnagar"],
        "Morbi": ["Morbi", "Halvad", "Maliya", "Tankara", "Wankaner"],
        "Narmada": ["Rajpipla", "Dediapada", "Garudeshwar", "Nandod", "Sagbara", "Tilakwada"],
        "Navsari": ["Navsari", "Chikhli", "Gandevi", "Jalalpore", "Khergam", "Vansda"],
        "Panchmahal": ["Godhra", "Ghoghamba", "Halol", "Jambughoda", "Kalol", "Morwa Hadaf", "Shehera"],
        "Patan": ["Patan", "Chanasma", "Harij", "Radhanpur", "Sami", "Santalpur", "Sidhpur"],
        "Porbandar": ["Porbandar", "Kutiyana", "Ranavav"],
        "Rajkot": ["Rajkot", "Dhoraji", "Gondal", "Jam Kandorna", "Jasdan", "Kotada Sangani", "Lodhika", "Paddhari", "Upleta", "Vinchhiya"],
        "Sabarkantha": ["Himmatnagar", "Idar", "Prantij", "Tlod", "Khedbrahma", "Poshina", "Vadali", "Vijaynagar"],
        "Surat": ["Surat City", "Bardoli", "Choryasi", "Kamrej", "Mahuva", "Mandvi", "Mangrol", "Olpad", "Palsana", "Umarpada"],
        "Surendranagar": ["Surendranagar", "Chotila", "Chuda", "Dasada", "Dhrangadhra", "Lakhtar", "Limbdi", "Muli", "Sayla", "Thangadh", "Wadhwan"],
        "Tapi": ["Vyara", "Nizar", "Songadh", "Uchhal", "Valod", "Kukurmunda", "Dolvan"],
        "Vadodara": ["Vadodara", "Dabhoi", "Desar", "Karjan", "Padra", "Savli", "Sinor", "Vaghodia"],
        "Valsad": ["Valsad", "Dharampur", "Kaprada", "Pardi", "Umbergaon", "Vapi"]
    },

    // DOM Elements
    els: {
        sections: {
            home: document.getElementById('homeSection'),
            form: document.getElementById('formSection'),
            results: document.getElementById('resultsSection'),
            market: document.getElementById('marketSection'),
            fertilizer: document.getElementById('fertilizerSection'),
            seasonal: document.getElementById('seasonalSection')
        },
        form: {
            container: document.getElementById('recommendationForm'),
            step1: document.getElementById('step1'),
            step2: document.getElementById('step2'),
            step3: document.getElementById('step3'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            submitBtn: document.getElementById('submitBtn'),
            districtSelect: document.getElementById('district'),
            talukaSelect: document.getElementById('taluka'),
            soilContainer: document.getElementById('soilTypes'),
        },
        ui: {
            loader: document.getElementById('loader'),
            resultsGrid: document.getElementById('resultsGrid')
        }
    },

    async init() {
        this.bindEvents();
        this.generateSoilTypes();
        this.setupSliders();
        this.loadMarketDropdowns();
        await this.fetchDistrictMetadata();
    },

    async fetchDistrictMetadata() {
        try {
            const res = await fetch(`${this.apiUrl}/districts`);
            this.districtMetadata = await res.json();
            console.log("Loaded metadata for " + this.districtMetadata.length + " districts from API.");
        } catch (error) {
            console.warn("Backend not reachable. Using fallback climate data for auto-population.");
            this.districtMetadata = [
                { name: 'Ahmedabad', region: 'Central Gujarat', minTempC: 15, maxTempC: 45, dominantSoils: 'Sandy, Loamy' },
                { name: 'Amreli', region: 'Saurashtra', minTempC: 12, maxTempC: 42, dominantSoils: 'Black, Medium Black' },
                { name: 'Anand', region: 'Central Gujarat', minTempC: 15, maxTempC: 40, dominantSoils: 'Alluvial, Sandy Loam' },
                { name: 'Aravalli', region: 'North Gujarat', minTempC: 10, maxTempC: 42, dominantSoils: 'Sandy, Rocky' },
                { name: 'Banaskantha', region: 'North Gujarat', minTempC: 5, maxTempC: 45, dominantSoils: 'Sandy' },
                { name: 'Bharuch', region: 'South Gujarat', minTempC: 18, maxTempC: 40, dominantSoils: 'Deep Black' },
                { name: 'Bhavnagar', region: 'Saurashtra', minTempC: 15, maxTempC: 42, dominantSoils: 'Coastal Alluvial, Black' },
                { name: 'Botad', region: 'Saurashtra', minTempC: 12, maxTempC: 43, dominantSoils: 'Black' },
                { name: 'Chhota Udaipur', region: 'Central Gujarat', minTempC: 10, maxTempC: 42, dominantSoils: 'Forest Soil, Loamy' },
                { name: 'Dahod', region: 'Central Gujarat', minTempC: 10, maxTempC: 40, dominantSoils: 'Rocky, Medium Black' },
                { name: 'Dang', region: 'South Gujarat', minTempC: 10, maxTempC: 35, dominantSoils: 'Forest Soil, Red Laterite' },
                { name: 'Devbhoomi Dwarka', region: 'Saurashtra', minTempC: 15, maxTempC: 38, dominantSoils: 'Coastal Saline, Medium Black' },
                { name: 'Gandhinagar', region: 'Central Gujarat', minTempC: 12, maxTempC: 44, dominantSoils: 'Sandy Loam' },
                { name: 'Gir Somnath', region: 'Saurashtra', minTempC: 15, maxTempC: 38, dominantSoils: 'Coastal Alluvial, Calcareous' },
                { name: 'Jamnagar', region: 'Saurashtra', minTempC: 12, maxTempC: 40, dominantSoils: 'Medium Black' },
                { name: 'Junagadh', region: 'Saurashtra', minTempC: 12, maxTempC: 40, dominantSoils: 'Black, Coastal' },
                { name: 'Kheda', region: 'Central Gujarat', minTempC: 15, maxTempC: 42, dominantSoils: 'Deep Alluvial' },
                { name: 'Kutch', region: 'Kutch', minTempC: 8, maxTempC: 45, dominantSoils: 'Sandy, Saline' },
                { name: 'Mahisagar', region: 'Central Gujarat', minTempC: 10, maxTempC: 42, dominantSoils: 'Sandy Loam, Rocky' },
                { name: 'Mehsana', region: 'North Gujarat', minTempC: 10, maxTempC: 44, dominantSoils: 'Sandy Loam' },
                { name: 'Morbi', region: 'Saurashtra', minTempC: 10, maxTempC: 43, dominantSoils: 'Medium Black, Sandy' },
                { name: 'Narmada', region: 'South Gujarat', minTempC: 12, maxTempC: 40, dominantSoils: 'Black, Forest Soil' },
                { name: 'Navsari', region: 'South Gujarat', minTempC: 15, maxTempC: 38, dominantSoils: 'Deep Black, Coastal Alluvial' },
                { name: 'Panchmahal', region: 'Central Gujarat', minTempC: 10, maxTempC: 42, dominantSoils: 'Medium Black, Rocky' },
                { name: 'Patan', region: 'North Gujarat', minTempC: 8, maxTempC: 45, dominantSoils: 'Sandy' },
                { name: 'Porbandar', region: 'Saurashtra', minTempC: 15, maxTempC: 38, dominantSoils: 'Coastal Saline, Medium Black' },
                { name: 'Rajkot', region: 'Saurashtra', minTempC: 10, maxTempC: 42, dominantSoils: 'Black, Sandy' },
                { name: 'Sabarkantha', region: 'North Gujarat', minTempC: 10, maxTempC: 42, dominantSoils: 'Sandy Loam' },
                { name: 'Surat', region: 'South Gujarat', minTempC: 15, maxTempC: 38, dominantSoils: 'Black, Alluvial' },
                { name: 'Surendranagar', region: 'Saurashtra', minTempC: 10, maxTempC: 44, dominantSoils: 'Black, Saline' },
                { name: 'Tapi', region: 'South Gujarat', minTempC: 15, maxTempC: 38, dominantSoils: 'Black, Forest Soil' },
                { name: 'Vadodara', region: 'Central Gujarat', minTempC: 14, maxTempC: 42, dominantSoils: 'Deep Black, Loamy' },
                { name: 'Valsad', region: 'South Gujarat', minTempC: 16, maxTempC: 35, dominantSoils: 'Deep Black, Coastal Alluvial' }
            ];
        }
    },

    bindEvents() {
        // Navigation
        document.getElementById('navHome').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('homeSection');
        });

        document.getElementById('navRecommend').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('formSection');
        });

        document.getElementById('navMarket').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('marketSection');
        });

        document.getElementById('navFertilizer').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('fertilizerSection');
        });

        document.getElementById('navSeasonal').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('seasonalSection');
        });

        // Form stepper
        this.els.form.nextBtn.addEventListener('click', () => this.changeStep(1));
        this.els.form.prevBtn.addEventListener('click', () => this.changeStep(-1));

        // Language toggler
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        // District -> Taluka population & Auto-populate
        this.els.form.districtSelect.addEventListener('change', (e) => {
            const district = e.target.value;
            const talukaSel = this.els.form.talukaSelect;

            if (!district) {
                talukaSel.innerHTML = '<option value="" data-i18n="talukaSel">-- Select District First --</option>';
                talukaSel.disabled = true;
                this.setLanguage(this.currentLang); // Refresh translation
                return;
            }

            talukaSel.disabled = false;
            let options = '<option value="">-- Choose Taluka --</option>';
            const talukas = this.talukas[district] || [];

            talukas.forEach(t => {
                options += `<option value="${t}">${t}</option>`;
            });

            talukaSel.innerHTML = options;

            // Trigger Climate Auto-Population
            this.autoPopulateClimate();
        });

        // Auto-populate when Season changes
        const seasonSelect = document.getElementById('season');
        if (seasonSelect) {
            seasonSelect.addEventListener('change', () => this.autoPopulateClimate());
        }

        // Form submit
        this.els.form.container.addEventListener('submit', (e) => this.handleSubmit(e));

        // Market Predict form submit
        const marketForm = document.getElementById('marketPredictForm');
        if (marketForm) {
            marketForm.addEventListener('submit', (e) => this.handleMarketPredict(e));
        }

        // Market Predict PDF Download
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');
        if (downloadPdfBtn) {
            downloadPdfBtn.addEventListener('click', (e) => this.handleDownloadPdf(e));
        }

        // Recommendation PDF Download
        const downloadRecPdfBtn = document.getElementById('downloadRecPdfBtn');
        if (downloadRecPdfBtn) {
            downloadRecPdfBtn.addEventListener('click', (e) => this.downloadRecommendationPDF(e));
        }

        // Fertilizer Predict form submit
        const fertilizerForm = document.getElementById('fertilizerForm');
        if (fertilizerForm) {
            fertilizerForm.addEventListener('submit', (e) => this.handleFertilizerPredict(e));
        }

        // Seasonal Predict form submit
        const seasonalForm = document.getElementById('seasonalForm');
        if (seasonalForm) {
            seasonalForm.addEventListener('submit', (e) => this.handleSeasonalPredict(e));
        }
    },

    autoPopulateClimate() {
        const districtName = this.els.form.districtSelect.value;
        const season = document.getElementById('season')?.value;

        if (!districtName || this.districtMetadata.length === 0) return;

        const metadata = this.districtMetadata.find(d => d.name === districtName);
        if (!metadata) return;

        // Auto-calculate Temperature based on District Baseline + Season modifier
        // Summer (Zaid) is generally hotter, Winter (Rabi) is cooler
        let calculatedTemp = Math.round((metadata.minTempC + metadata.maxTempC) / 2);

        if (season === 'Kharif') {
            // Monsoon - moderate/warm
            calculatedTemp = Math.min(metadata.maxTempC - 2, 32);
        } else if (season === 'Rabi') {
            // Winter - cool
            calculatedTemp = Math.max(metadata.minTempC + 4, 20);
        } else if (season === 'Summer') {
            // Hot
            calculatedTemp = Math.min(metadata.maxTempC + 2, 42);
        }

        // Update Slider and UI
        const tempCheck = document.getElementById('useCustomTemp');
        const tempInputDiv = document.getElementById('tempInputDiv');
        const tempSlider = document.getElementById('recTemp');
        const tempValue = document.getElementById('recTempValue');

        if (tempCheck && tempSlider && tempValue) {
            tempCheck.checked = true; // Auto-enable
            tempInputDiv.style.display = 'block';
            tempSlider.value = calculatedTemp;
            tempValue.textContent = calculatedTemp;
        }

        // Auto-calculate pH based on region/soil profile
        let defaultPh = 7.0; // neutral default
        if (metadata.region === "Saurashtra" || metadata.region === "Kutch") {
            defaultPh = 7.8; // Calcareous/alkaline
        } else if (metadata.region === "South") {
            defaultPh = 6.8; // Slightly acidic high rainfall
        } else if (metadata.dominantSoils.toLowerCase().includes('black')) {
            defaultPh = 7.5;
        }

        const phSlider = document.getElementById('ph');
        const phValueUI = document.getElementById('phValue');
        if (phSlider && phValueUI) {
            phSlider.value = defaultPh;
            phValueUI.textContent = defaultPh.toFixed(1);
        }

    },

    showSection(sectionId) {
        Object.values(this.els.sections).forEach(sec => sec.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
        window.scrollTo(0, 0);
    },

    changeStep(direction) {
        // Validation before moving next
        if (direction === 1) {
            if (this.currentStep === 1 && !this.els.form.districtSelect.value) {
                alert("Please select a district"); return;
            }
            if (this.currentStep === 1 && !document.querySelector('input[name="soilType"]:checked')) {
                alert("Please select a soil type"); return;
            }
            if (this.currentStep === 2 && !document.querySelector('input[name="water"]:checked')) {
                alert("Please select a water source"); return;
            }
        }

        // Hide current step
        document.getElementById(`step${this.currentStep}`).style.display = 'none';

        // Update step counter
        this.currentStep += direction;

        // Show new step
        document.getElementById(`step${this.currentStep}`).style.display = 'block';

        // Update buttons
        this.els.form.prevBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';

        if (this.currentStep === this.totalSteps) {
            this.els.form.nextBtn.style.display = 'none';
            this.els.form.submitBtn.style.display = 'inline-flex';
        } else {
            this.els.form.nextBtn.style.display = 'inline-flex';
            this.els.form.submitBtn.style.display = 'none';
        }
    },

    setupSliders() {
        const phSlider = document.getElementById('ph');
        const phValue = document.getElementById('phValue');
        phSlider.addEventListener('input', (e) => phValue.textContent = e.target.value);

        const sizeSlider = document.getElementById('farmSize');
        const sizeValue = document.getElementById('sizeValue');
        sizeSlider.addEventListener('input', (e) => sizeValue.textContent = e.target.value);

        // NEW: Temperature Slider Setup
        const tempCheck = document.getElementById('useCustomTemp');
        const tempInputDiv = document.getElementById('tempInputDiv');
        const tempSlider = document.getElementById('recTemp');
        const tempValue = document.getElementById('recTempValue');

        if (tempCheck && tempInputDiv && tempSlider) {
            tempCheck.addEventListener('change', (e) => {
                tempInputDiv.style.display = e.target.checked ? 'block' : 'none';
            });
            tempSlider.addEventListener('input', (e) => {
                if (tempValue) tempValue.textContent = e.target.value;
            });
        }
    },

    async loadMarketDropdowns() {
        // Clone districts from main form
        const mainDistrictSelect = this.els.form.districtSelect;
        const marketDistrictSelect = document.getElementById('marketDistrict');
        const seasonalDistrictSelect = document.getElementById('seasonalLocation');

        if (mainDistrictSelect) {
            if (marketDistrictSelect) {
                marketDistrictSelect.innerHTML = mainDistrictSelect.innerHTML;
                marketDistrictSelect.value = "";
            }
            if (seasonalDistrictSelect) {
                seasonalDistrictSelect.innerHTML = mainDistrictSelect.innerHTML;
                seasonalDistrictSelect.value = "";
            }
        }

        // Fetch crops to populate market form
        try {
            const res = await fetch(`${this.apiUrl}/crops`);
            const crops = await res.json();
            const marketCropSelect = document.getElementById('marketCrop');
            const fertCropSelect = document.getElementById('fertCrop');
            const seasonalCropSelect = document.getElementById('seasonalCrop');

            if (crops.length > 0) {
                // sort crops alphabetically by English name
                crops.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
                let optionsHtml = '<option value="">-- Select Crop --</option>';
                crops.forEach(c => {
                    optionsHtml += `<option value="${c.nameEn}">${c.nameEn} (${c.nameGu})</option>`;
                });

                if (marketCropSelect) marketCropSelect.innerHTML = optionsHtml;
                if (fertCropSelect) fertCropSelect.innerHTML = optionsHtml;
                if (seasonalCropSelect) seasonalCropSelect.innerHTML = optionsHtml;
            }
        } catch (e) {
            console.error("Failed to fetch crops for dropdown");
        }
    },

    setLanguage(lang) {
        if (!this.translations[lang]) return;
        this.currentLang = lang;
        const dict = this.translations[lang];

        // Find all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerHTML = dict[key];
            }
        });

        // Update loaded district text if needed (we'll just reload from API in a real production MVP)
        // For now, static labels are translated.
    },

    generateSoilTypes() {
        const soils = ['Black', 'Alluvial', 'Sandy', 'Clay', 'Loam', 'Saline'];
        let html = '';
        soils.forEach((soil, index) => {
            html += `
                <label class="radio-card">
                    <input type="radio" name="soilType" value="${soil}" ${index === 0 ? 'checked' : ''}>
                    <span class="label-text">${soil} Soil</span>
                </label>
            `;
        });
        this.els.form.soilContainer.innerHTML = html;
    },

    async handleSubmit(e) {
        e.preventDefault();

        // Gather data
        const formData = {
            districtName: this.els.form.districtSelect.value,
            talukaName: this.els.form.talukaSelect.value,
            season: document.getElementById('season').value,
            soilType: document.querySelector('input[name="soilType"]:checked').value,
            ph: parseFloat(document.getElementById('ph').value),
            waterAvailability: document.querySelector('input[name="water"]:checked').value,
            farmSize: parseFloat(document.getElementById('farmSize').value),
            budget: parseInt(document.getElementById('budget').value, 10),
            experienceLevel: document.getElementById('experience').value
        };

        // NEW: Check if custom temperature is provided
        const useTemp = document.getElementById('useCustomTemp')?.checked;
        if (useTemp) {
            formData.temperature = parseInt(document.getElementById('recTemp').value, 10);
        }

        // Show loader
        this.els.form.container.style.display = 'none';
        this.els.ui.loader.style.display = 'block';

        try {
            const res = await fetch(`${this.apiUrl}/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const recommendations = await res.json();

            this.renderResults(recommendations);

            // Hide loader, show results section
            this.els.ui.loader.style.display = 'none';
            this.els.form.container.style.display = 'block'; // reset for later
            this.showSection('resultsSection');

        } catch (error) {
            console.error("API Error", error);
            alert("Failed to get recommendations. Ensure the backend is running on port 5000.");
            this.els.ui.loader.style.display = 'none';
            this.els.form.container.style.display = 'block';
        }
    },

    renderResults(data) {
        if (!data || data.length === 0) {
            this.els.ui.resultsGrid.innerHTML = '<p>No recommendations found for this profile.</p>';
            return;
        }

        let html = '';
        data.forEach((rec, index) => {
            const isTop = index === 0;
            const c = rec.crop;
            const profitStr = rec.estimatedProfit.toLocaleString('en-IN');
            const costStr = rec.estimatedCost.toLocaleString('en-IN');

            html += `
                <div class="result-card" style="${isTop ? 'border: 2px solid var(--primary); transform: scale(1.02);' : ''}">
                    ${isTop ? '<div class="banner" style="background:var(--primary);color:white;text-align:center;padding:4px;margin:-24px -24px 20px -24px;border-radius:14px 14px 0 0;font-size:0.8rem;font-weight:bold;">★ TOP RECOMMENDATION ★</div>' : ''}
                    
                    <div class="result-header">
                        <div class="result-icon">${c.icon}</div>
                        <div class="result-title">
                            <h3>${c.nameEn}</h3>
                            <p>${c.nameGu} • ${c.nameHi}</p>
                        </div>
                        <div class="score-badge">${rec.suitabilityScore}%</div>
                    </div>
                    
                    <div class="result-stats">
                        <div class="stat-box highlight">
                            <div class="stat-label">Est. Profit</div>
                            <div class="stat-val">₹${profitStr}</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Est. Cost</div>
                            <div class="stat-val">₹${costStr}</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Duration</div>
                            <div class="stat-val">${c.growingSeasonDays} Days</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Water Needs</div>
                            <div class="stat-val">${rec.breakdown.water}/5 Score</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 15px; text-align: center;">
                        <button type="button" class="btn btn-outline btn-small" style="width: 100%; border-color: var(--primary); color: var(--primary);" 
                                onclick="app.analyzeProfitForCrop('${c.nameEn.replace(/'/g, "\\'")}')" data-i18n="resAnalyzeProfit">📈 Detailed Profit Analysis</button>
                    </div>
                </div>
            `;
        });

        this.els.ui.resultsGrid.innerHTML = html;
    },

    // --- NEW: Recommendation PDF & Profit Linking --- //
    analyzeProfitForCrop(cropNameEn) {
        // Switch to market section
        this.showSection('marketSection');

        // Auto-fill crop and district
        const marketCrop = document.getElementById('marketCrop');
        if (marketCrop) {
            marketCrop.value = cropNameEn;
        }

        const marketDistrict = document.getElementById('marketDistrict');
        const recommendDistrict = this.els.form.districtSelect.value;
        if (marketDistrict && recommendDistrict) {
            marketDistrict.value = recommendDistrict;
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Auto-trigger prediction
        setTimeout(() => {
            const marketForm = document.getElementById('marketPredictForm');
            if (marketForm) {
                // Pre-fill generic defaults if empty to avoid validation errors
                if (!marketForm.currentPrice.value) marketForm.currentPrice.value = 5000;
                if (!marketForm.expectedYield.value) marketForm.expectedYield.value = 15;
                if (!marketForm.season.value) marketForm.season.value = "Kharif";

                marketForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        }, 400);
    },

    downloadRecommendationPDF(e) {
        if (e) e.preventDefault();
        const element = document.getElementById('resultsSection');
        if (!element || element.style.display === 'none') {
            alert("No recommendations to download!");
            return;
        }

        const btn = document.getElementById('downloadRecPdfBtn');
        const originalText = btn.innerText;
        btn.innerText = "Generating PDF...";
        btn.disabled = true;

        const opt = {
            margin: 0.3,
            filename: 'AgroSaathi_Crop_Recommendations.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Add a slight delay to allow UI to update
        setTimeout(() => {
            html2pdf().set(opt).from(element).save().then(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            }).catch(err => {
                console.error(err);
                btn.innerText = originalText;
                btn.disabled = false;
                alert("Failed to generate PDF.");
            });
        }, 300);
    },

    // --- MARKET PROFIT PREDICTION LOGIC --- //
    chartInstance: null,

    async handleMarketPredict(e) {
        e.preventDefault();
        const form = e.target;

        const payload = {
            crop: form.crop.value,
            district: form.district.value,
            currentPrice: parseFloat(form.currentPrice.value),
            msp: parseFloat(form.msp.value) || 0,
            expectedYield: parseFloat(form.expectedYield.value),
            season: form.season.value
        };

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = "Analyzing Market Trends...";
        btn.disabled = true;

        try {
            let data;
            try {
                const res = await fetch(`${this.apiUrl}/predict-profit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error("API failed");
                data = await res.json();
            } catch (fetchErr) {
                console.warn("Backend not reachable. Using fallback market prediction logic.");
                const base = payload.currentPrice || 5000;
                const expectedYield = payload.expectedYield || 15;
                const hist = [Math.round(base * 0.9), Math.round(base * 1.05), Math.round(base * 0.95)];
                const predicted = Math.round(base * 1.08); // 8% avg growth
                const revenue = predicted * expectedYield;
                const profit = Math.round(revenue * 0.6); // mock 60% margin

                data = {
                    riskLevel: 'Medium',
                    historicalPrices: hist,
                    predictedPrice: predicted,
                    revenuePerAcre: revenue,
                    profitPerAcre: profit
                };
            }

            // Render the results area
            document.getElementById('marketResultsArea').style.display = 'block';

            // Set Metrics
            document.getElementById('resPredictedPrice').innerText = `₹ ${data.predictedPrice.toLocaleString('en-IN')}`;
            document.getElementById('resExpectedRev').innerText = `₹ ${data.revenuePerAcre.toLocaleString('en-IN')}`;
            document.getElementById('resExpectedProfit').innerText = `₹ ${data.profitPerAcre.toLocaleString('en-IN')}`;

            // Style Risk Badge
            const badge = document.getElementById('riskBadge');
            badge.innerText = `Market Risk: ${data.riskLevel}`;
            badge.className = 'risk-badge'; // reset
            if (data.riskLevel === 'High') badge.classList.add('risk-high');
            else if (data.riskLevel === 'Medium') badge.classList.add('risk-medium');
            else badge.classList.add('risk-low');

            // Render Chart
            this.renderMarketChart(data.historicalPrices, data.predictedPrice, data.revenuePerAcre, data.profitPerAcre);

        } catch (err) {
            console.error("Rendering failed:", err);
            alert("Failed to analyze market data.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    },

    renderMarketChart(historicalArr, predicted, revenue, profit) {
        const ctx = document.getElementById('profitChart').getContext('2d');

        // Destroy old chart if it exists
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        // Years assuming current is 2026 for instance
        const labels = ['2023', '2024', '2025', '2026 (Predicted)'];
        const priceData = [...historicalArr, predicted];

        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Market Price (₹ / Quintal)',
                        data: priceData,
                        backgroundColor: [
                            'rgba(148, 163, 184, 0.6)',
                            'rgba(148, 163, 184, 0.6)',
                            'rgba(148, 163, 184, 0.6)',
                            'rgba(5, 150, 105, 0.8)' // Highlight predicted
                        ],
                        borderColor: [
                            'rgb(71, 85, 105)',
                            'rgb(71, 85, 105)',
                            'rgb(71, 85, 105)',
                            'rgb(4, 120, 87)'
                        ],
                        borderWidth: 1,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Crop Price Trend Analysis'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Amount (₹)'
                        }
                    }
                }
            }
        });
    },

    handleDownloadPdf(e) {
        e.preventDefault();

        const element = document.getElementById('marketResultsArea');
        const btn = document.getElementById('downloadPdfBtn');

        // Hide button during capture
        btn.style.visibility = 'hidden';

        const opt = {
            margin: 0.5,
            filename: 'AgroSaathi_Market_Prediction_Report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        // Small timeout to ensure chart is perfectly still
        setTimeout(() => {
            html2pdf().set(opt).from(element).save().then(() => {
                // Restore button
                btn.style.visibility = 'visible';
            });
        }, 500);
    },

    // --- FERTILIZER AI LOGIC --- //
    async handleFertilizerPredict(e) {
        e.preventDefault();
        const form = e.target;

        const payload = {
            crop: form.crop.value,
            nitrogen: parseFloat(form.nitrogen.value),
            phosphorus: parseFloat(form.phosphorus.value),
            potassium: parseFloat(form.potassium.value),
            ph: parseFloat(form.ph.value),
            soilType: form.soilType.value
        };

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = "Analyzing Soil Nutrients...";
        btn.disabled = true;

        try {
            const res = await fetch(`${this.apiUrl}/recommend-fertilizer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            // Render the results area
            document.getElementById('fertilizerResultsArea').style.display = 'block';

            // Set Metrics
            document.getElementById('resFertName').innerText = data.recommendedFertilizer;
            document.getElementById('resFertQuantity').innerText = `${data.requiredQuantityKg} kg / Acre`;
            document.getElementById('resFertCost').innerText = `₹ ${data.estimatedCost.toLocaleString('en-IN')}`;
            document.getElementById('resFertSchedule').innerHTML = data.applicationSchedule.replace(/\n/g, '<br>');
            document.getElementById('resFertAdvice').innerText = data.soilHealthAdvice;

        } catch (err) {
            console.error(err);
            alert("Failed to analyze soil data. Is the backend running?");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    },

    // --- SEASONAL CROP PLAN LOGIC --- //
    async handleSeasonalPredict(e) {
        e.preventDefault();
        const form = e.target;

        const payload = {
            crop: form.crop.value,
            location: form.location.value,
            season: form.season.value,
            waterAvailability: form.waterAvailability.value,
            temperature: parseFloat(form.temperature.value),
            rainfall: parseFloat(form.rainfall.value)
        };

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = "Computing 2026 Timelines...";
        btn.disabled = true;

        try {
            const res = await fetch(`${this.apiUrl}/seasonal-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            // Render the results area
            document.getElementById('seasonalResultsArea').style.display = 'block';

            // Set Metrics
            document.getElementById('resSowingDate').innerHTML = data.sowingDateRange;
            document.getElementById('resHarvestDate').innerHTML = data.harvestingPeriod;
            document.getElementById('resIrrigation').innerHTML = data.irrigationTimeline;
            document.getElementById('resWeatherRisk').innerHTML = data.weatherRiskAlert;
            document.getElementById('resRotation').innerHTML = data.cropRotationSuggestion;
            document.getElementById('resPests').innerHTML = data.preventiveCareTips;
            document.getElementById('resYield').innerHTML = data.expectedYieldInfo;
            document.getElementById('resFertilizerBasic').innerHTML = data.basicFertilizerGuide;
            document.getElementById('resDifficulty').innerHTML = data.farmingDifficulty;

        } catch (err) {
            console.error(err);
            alert("Failed to generate seasonal plan. Is the backend running?");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
};

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
