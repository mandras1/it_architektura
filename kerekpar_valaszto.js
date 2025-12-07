document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bikeCalcForm');
    const heightInput = document.getElementById('height');
    const inseamInput = document.getElementById('inseam');
    const budgetInput = document.getElementById('budget');
    const budgetValueSpan = document.getElementById('budgetValue');
    const resultContainer = document.getElementById('resultContainer');
    const bikeTypeResult = document.getElementById('bikeTypeResult');
    const bikeSizeResult = document.getElementById('bikeSizeResult');
    const recommendationText = document.getElementById('recommendationText');
    

    budgetInput.addEventListener('input', function() {
        budgetValueSpan.textContent = budgetInput.value;
    });

    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        //validációk
        if (document.getElementById('userName').value.trim() === "") {
            alert("Kérlek, add meg a neved!");
            return;
        }

        const height = parseInt(heightInput.value);
        if (isNaN(height) || height < 140 || height > 210) {
            alert("Kérlek, valós testmagasságot (140-210 cm között) adj meg!");
            return;
        }

        const inseam = parseInt(inseamInput.value);
        if (isNaN(inseam) || inseam < 60 || inseam > 100) {
            alert("Kérlek, valós belső lábhosszt (60-100 cm között) adj meg!");
            return;
        }

        const distanceType = document.querySelector('input[name="distanceType"]:checked');
        if (!distanceType) {
            alert("Kérlek, válassz egy céltávot!");
            return;
        }
        
        const experience = document.getElementById('experience').value;
        if (experience === "") {
            alert("Kérlek, add meg a tapasztalatodat!");
            return;
        }


        
        let calculatedSize = 0;
        let bikeType = "";
        let recommendation = "";
        
        //Ideális Vázméret Kiszámítása (Általános képlet: Lábhossz * 0.67)
        calculatedSize = Math.round(inseam * 0.67);
        
        //Ajánlás
        if (distanceType.value === 'olimpiai' && experience === 'kezdo') {
            bikeType = "Hagyományos Országúti Kerékpár (kezdő)";
            recommendation = "Kezdőként egy kényelmes, hagyományos országúti bringa tökéletes, később kiegészíthető aerobárral.";
        } else if (distanceType.value === 'olimpiai' || distanceType.value === 'halfiron') {
            bikeType = "Időfutam/Triatlon Kerékpár VAGY Országúti + Aerobár";
            recommendation = "Ezen a távon már érdemes megfontolni az aerodinamikai előnyöket. A triatlon bringa ideális, de magasabb költségvetés esetén egy aerobárral kiegészített országúti kerékpár is jó lehet.";
        } else if (distanceType.value === 'fulliron') {
            bikeType = "Professzionális Időfutam/Triatlon Kerékpár";
            recommendation = "Az Ironman távon az aerodinamika (és a kényelmes aeropozíció) kulcsfontosságú. Egy dedikált triatlon/időfutam kerékpár elengedhetetlen a jó teljesítményhez és az energiatakarékossághoz.";
        } else {
             bikeType = "Országúti Kerékpár";
             recommendation = "Válassz egy megbízható országúti modellt.";
        }


        //Eredmény
        bikeTypeResult.textContent = `Ajánlott Kerékpár Típus: ${bikeType}`;
        bikeSizeResult.textContent = `Becsült Vázméret: ${calculatedSize} cm (${getFrameSizeLabel(calculatedSize)})`;
        recommendationText.textContent = `Megjegyzés: ${recommendation}`;

        resultContainer.style.display = 'block';
        
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    
    function getFrameSizeLabel(size) {
        if (size < 49) return "XS";
        if (size >= 49 && size < 52) return "S";
        if (size >= 52 && size < 56) return "M";
        if (size >= 56 && size < 60) return "L";
        return "XL";
    }

});