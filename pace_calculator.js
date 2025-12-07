document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('paceCalculatorForm');
    const targetTimeInput = document.getElementById('targetTime');
    const raceDistanceSelect = document.getElementById('raceDistance');
    const splitTableBody = document.querySelector('#splitTable tbody');
    const resultsDiv = document.getElementById('results');

    const RACE_DATA = {
        
        'olimpiai': {
            swimDist: 1.5, bikeDist: 40, runDist: 10, 
            avgT1: 180, avgT2: 90,
            ratios: { swim: 0.17, bike: 0.50, run: 0.33 }
        },
        
        'halfiron': {
            swimDist: 1.9, bikeDist: 90, runDist: 21.1, 
            avgT1: 300, avgT2: 120, 
            ratios: { swim: 0.12, bike: 0.50, run: 0.38 }
        },
        
        'fulliron': {
            swimDist: 3.8, bikeDist: 180, runDist: 42.2, 
            avgT1: 600, avgT2: 240, 
            ratios: { swim: 0.10, bike: 0.50, run: 0.40 }
        },
    };

    /**
     * ÓÓ:PP:MM időt másodpercekké konvertálja.
     * @param {string} timeStr
     * @returns {number}
     */
    function timeToSeconds(timeStr) {
        if (!timeStr || !timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) return 0;
        const parts = timeStr.split(':');
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }

    /**
     * Másodpercet ÓÓ:PP:MM formátumú stringgé konvertálja.
     * @param {number} totalSeconds
     * @returns {string}
     */
    function secondsToTimeStr(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00:00';
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.round(totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
    
    /**
     * Másodpercet PP:MM formátumú stringgé konvertálja (tempóhoz).
     * @param {number} totalSeconds
     * @returns {string}
     */
    function secondsToMinSecStr(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds <= 0) return 'N/A';
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.round(totalSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }




    /*Úszótempó számítása*/
    function calculateSwimPace(timeSec, distanceKm) {
        if (distanceKm === 0 || timeSec === 0) return 'N/A';
        const total100mSegments = distanceKm * 10;
        const paceSecPer100m = timeSec / total100mSegments;
        return `${secondsToMinSecStr(paceSecPer100m)} / 100m`;
    }

    /*Kerékpáros sebesség*/
    function calculateBikeSpeed(timeSec, distanceKm) {
        if (timeSec === 0) return 'N/A';
        const timeHours = timeSec / 3600;
        const speed = distanceKm / timeHours;
        return `${speed.toFixed(1)} km/h`;
    }

    /*Futótempó számítása*/
    function calculateRunPace(timeSec, distanceKm) {
        if (distanceKm === 0 || timeSec === 0) return 'N/A';
        const paceSecPerKm = timeSec / distanceKm;
        return `${secondsToMinSecStr(paceSecPerKm)} / km`;
    }


    //KALKULÁTOR

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const targetTimeSec = timeToSeconds(targetTimeInput.value);
        const distanceKey = raceDistanceSelect.value;
        const data = RACE_DATA[distanceKey];

        //minimum célidő
        if (targetTimeSec === 0 || targetTimeSec < (data.avgT1 + data.avgT2 + 3600)) { 
             alert("Érvénytelen célidő. Kérlek, adj meg egy realisztikus időt (pl. Full Ironman esetén legalább 10 óra).");
             return;
        }

        const totalTransitionTime = data.avgT1 + data.avgT2;
        const totalMovingTime = targetTimeSec - totalTransitionTime;

        
        const swimTimeSec = totalMovingTime * data.ratios.swim;
        const bikeTimeSec = totalMovingTime * data.ratios.bike;
        const runTimeSec = totalMovingTime * data.ratios.run;
        
        
        const swimPace = calculateSwimPace(swimTimeSec, data.swimDist);
        const bikeSpeed = calculateBikeSpeed(bikeTimeSec, data.bikeDist);
        const runPace = calculateRunPace(runTimeSec, data.runDist);

        // Eredmény
        splitTableBody.innerHTML = `
            <tr><td>Úszás (${data.swimDist} km)</td><td>${secondsToTimeStr(swimTimeSec)}</td><td>${swimPace}</td></tr>
            <tr><td>T1 (Depó)</td><td>${secondsToTimeStr(data.avgT1)}</td><td>---</td></tr>
            <tr><td>Kerékpár (${data.bikeDist} km)</td><td>${secondsToTimeStr(bikeTimeSec)}</td><td>${bikeSpeed}</td></tr>
            <tr><td>T2 (Depó)</td><td>${secondsToTimeStr(data.avgT2)}</td><td>---</td></tr>
            <tr><td>Futás (${data.runDist} km)</td><td>${secondsToTimeStr(runTimeSec)}</td><td>${runPace}</td></tr>
            <tr class="total-row"><td>**ÖSSZESEN**</td><td>**${secondsToTimeStr(targetTimeSec)}**</td><td></td></tr>
        `;
        
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    });
});