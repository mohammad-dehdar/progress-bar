const nextBtn = document.getElementById("nextButton");
const progress = document.getElementById("progress");
const percentage = document.getElementById("percentage");

let currentPercentage = parseInt(localStorage.getItem('gaugeProgress')) || 0;
const increment = 10;
const maxPercentage = 100;

const circumference = 2 * Math.PI * 16; 
progress.style.strokeDasharray = `${circumference} ${circumference}`;

function updateGauge(animate = true) {
    const dashOffset = circumference - (currentPercentage / 100) * circumference;
    if (animate) {
        progress.style.transition = 'stroke-dashoffset 0.3s ease-in-out, stroke 0.3s ease-in-out';
    } else {
        progress.style.transition = 'none';
    }
    progress.style.strokeDashoffset = dashOffset;
    
    const red = Math.floor(255 * (1 - currentPercentage / 100));
    const green = Math.floor(255 * (currentPercentage / 100));
    progress.style.stroke = `rgb(${red}, ${green}, 0)`;
    
    if (animate) {
        animatePercentage(parseInt(percentage.textContent) || 0, currentPercentage, 300);
    } else {
        percentage.textContent = `${currentPercentage}%`;
    }

    if (currentPercentage === maxPercentage) {
        nextBtn.textContent = "finish";
    } else {
        nextBtn.textContent = "Next";
    }
}

nextBtn.addEventListener('click', () => {
    if (currentPercentage < maxPercentage) {
        currentPercentage += increment;
        if (currentPercentage > maxPercentage) {
            currentPercentage = maxPercentage;
        }
        updateGauge();
        localStorage.setItem('gaugeProgress', currentPercentage);
    } else if (currentPercentage === maxPercentage) {
       
        currentPercentage = 0;
        localStorage.setItem('gaugeProgress', currentPercentage);
        updateGauge();
    }
});

function animatePercentage(start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        percentage.textContent = `${currentValue}%`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}


updateGauge(false);