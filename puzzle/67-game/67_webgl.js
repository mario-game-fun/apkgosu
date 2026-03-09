var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = `
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

let _vertical = true; // true = portrait, false = landscape

function updateOrientationFlag() {
  _vertical = window.innerHeight > window.innerWidth;
  
  // пробуем получить SWF только если он уже создан
  const ruffleContainer = document.getElementById('ruffle');
  if (!ruffleContainer || !ruffleContainer.firstChild) return;

  const swfObject1 = ruffleContainer.firstChild;

  // защита на случай, если методы ещё не готовы
  if (_vertical) {
    if (typeof swfObject1.ToVertical === "function") {
      swfObject1.ToVertical();
    }
  } else {
    if (typeof swfObject1.ToHorisontal === "function") {
      swfObject1.ToHorisontal();
    }
  }
  updatePreloadImage();
  
}

// первый расчёт до выбора preload-картинки
updateOrientationFlag();

// обновляем при изменении размеров/повороте
window.addEventListener("resize", updateOrientationFlag);




 setupPreloadImage();

var koleso = document.createElement("div");

function setupPreloadImage() {
  const preloadImage = document.getElementById("preloadImage");
  if (!preloadImage) return;

  // твой выбор картинки (как ты поменял)
  preloadImage.src = isMobileOrTablet()
        ? "preloader_67_ver.jpg"
        : "preloader_67_hor.jpg";
 
  preloadImage.style.width = "100vw";
  preloadImage.style.height = "100vh";
  preloadImage.style.objectFit = "cover";
  preloadImage.style.objectPosition = "center center";	

  preloadImage.style.visibility = "visible";
}

function updatePreloadImage(){
	const preloadImage = document.getElementById("preloadImage");
  if (!preloadImage) return;

  // твой выбор картинки (как ты поменял)
  preloadImage.src = _vertical
        ? "preloader_67_ver.jpg"
        : "preloader_67_hor.jpg";
		
	
  preloadImage.style.width = "100vw";
  preloadImage.style.height = "100vh";
  preloadImage.style.objectFit = "cover";
  preloadImage.style.objectPosition = "center center";

  preloadImage.style.visibility = "visible";
}


var checkInterval = setInterval(function() {
    var preloadImage = document.getElementById('preloadImage');
    if (preloadImage && preloadImage.complete){
		var style = window.getComputedStyle(preloadImage);
		if (!(style.display === 'none' || style.visibility === 'hidden')) {
		    var rect = preloadImage.getBoundingClientRect();
			if (!(rect.width === 0 || rect.height === 0)){
			    clearInterval(checkInterval); // Останавливаем интервал
				SOZDANIE_KOLESA();
			}
		}
	}
}, 100); // 50 раз в секунду (1000 мс / 50 = 20 мс)*/

PokiSDK.init().then(() => {
	start_SWF();
});

function isMobileOrTablet() {
  const hasTouch = navigator.maxTouchPoints > 0;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return hasTouch && coarse;
}
	
function start_SWF(){
    var swfobject = {};
    var ruffleConfig = {
        playButton : "none"
    };
    swfobject.embedSWF = function(url, cont, width, height){
        var ruffle = window.RufflePlayer.newest(),
            player = Object.assign(document.getElementById(cont).appendChild(ruffle.createPlayer()), {
                width: 580,
                height: 1031,
            	style: 'width: ' + width + 'px; height: ' + height + 'px',
            });   
        window.RufflePlayer.config = {"autoplay": "on", "preferredRenderer" : "webgl", "unmuteOverlay": "hidden", "splashScreen": false,  "contextMenu": "off", "backgroundColor": "#000000",
        };
        
        player.load({ url: url , allowScriptAccess: true});
    }

    swfobject.embedSWF('67.swf', 'ruffle');
    //swfobject.firstChild.focus();
}

// Прогресс-бар
let totalLoadedData = 0;
let progress = 0;
const progressBar = document.getElementById("progress-bar");
let hasReached30 = false; // Флаг для отслеживания достижения 30%
let hasReached60 = false; // Флаг для отслеживания, достигнут ли 60%

// Функция для обновления прогресс-бара
function updateProgressBar(targetPercentage, duration, callback) {
    const startProgress = progress;
    const increment = ((targetPercentage - startProgress) / (duration / 100));

    const interval = setInterval(() => {
        if (progress >= targetPercentage) {
            clearInterval(interval);
            if (callback) callback(); // Вызываем колбэк, если указан
        } else {
            progress += increment;
            progressBar.style.width = progress + "%";
        }
    }, 100);
}

// Настраиваем PerformanceObserver для отслеживания загрузки ресурсов
const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();

    entries.forEach((entry) => {
        if (entry.transferSize) {
            totalLoadedData += entry.transferSize;
        }
    });

    // Ускоряем прогресс-бар, если загружено более 4 МБ
    if (totalLoadedData >= 2 * 1024 * 1024 && progress < 60 && !hasReached60) {
        hasReached60 = true;
        updateProgressBar(60, 1500, () => updateProgressBar(95, 90000)); // Переход к 95% после 60%
    }
});

// Наблюдаем за всеми загружаемыми ресурсами
observer.observe({ entryTypes: ['resource'] });


// Сначала доходим до 30% за 3 секунды, затем до 60% за 2 минуты
updateProgressBar(20, 10000, () => {
    hasReached30 = true;
    updateProgressBar(60, 60000, () => {
        hasReached60 = true;
        updateProgressBar(95, 90000); // Переход к 95% после 60%
    });
});


function myJavaScriptFunction(data) {
    if (data === 'gameLoadingFinished') {
		PokiSDK.gameLoadingFinished();
		
		const ruffleContainer = document.getElementById('ruffle');
        if (!ruffleContainer || !ruffleContainer.firstChild) return;
        const swfObject67 = ruffleContainer.firstChild;
		if (_vertical) {
            if (typeof swfObject67.ToVertical === "function") {
                swfObject67.ToVertical();
            }
        } else {
            if (typeof swfObject67.ToHorisontal === "function") {
                swfObject67.ToHorisontal();
            }
        }
    }
	
	if (data === 'gameplayStart') {
		PokiSDK.gameplayStart();
    }
	
	if (data === 'gameplayStop') {
		PokiSDK.gameplayStop();
    }
	
	if (data === 'preloadervisiable') {
        // Ускорить прогресс до 60%, если еще не достигнут
        if (progress < 60 && !hasReached60) {
            updateProgressBar(60, 1500);
        }
    }
	
    if (data === 'preloadercomplete') {
		if (progress > 60) {
            hasReached60 = true; // Устанавливаем флаг
        }
		
		const screenDim = document.getElementById('screen-dim'); // Определяем screenDim
		// Плавное затемнение экрана
        
		updateProgressBar(100, 200, () => {
            setTimeout(() => {
                if (screenDim) {
                    screenDim.style.display = 'block'; // Включаем затемнение
                    screenDim.style.opacity = '1';
                }
            }, 300); // Задержка в 0.2 секунды
        });
		
    }
	
	if (data === 'perekl2frame'){
		var preloaderImage = document.getElementById('preloadImage');
        if (preloaderImage) {
            preloaderImage.style.display = 'none'; // Скрываем изображение
        }
		
		clearInterval(checkInterval);
		
		if (koleso) {
            koleso.style.display = 'none'; // Скрываем изображение
        }
		
		const progressBarContainer = document.getElementById("progress-bar-container");
        if (progressBarContainer) {
            progressBarContainer.style.display = 'none';
        }
		if (progressBar){
			progressBar.style.display = 'none';
		}
		
		const screenDim = document.getElementById('screen-dim'); // Определяем screenDim
		// Мгновенно убираем затемнение
        if (screenDim) {
            screenDim.style.display = 'none'; // Скрываем затемнение немедленно
        }
	}
	
    if (data === 'comercial') {
        PokiSDK.commercialBreak().then(function(){
            const swfObject1 = document.getElementById('ruffle').firstChild;
            swfObject1.receiveCommercialBreakFinished();
        });
    }

	if (data === 'rewarded') {
        PokiSDK.rewardedBreak().then((success) => {
			const swfObject1 = document.getElementById('ruffle').firstChild;
			if (success){
                swfObject1.rewardedBreakFinished();
			} else {
				swfObject1.rewardedBreakAdblocked();
				PokiSDK.IsAdBlocked();
			}	
        });		
    }
	
}

function SOZDANIE_KOLESA(){
    var preloaderImage = document.getElementById('preloadImage');
    
	let baseSize;
	/*if (isMobileOrTablet()) {
        // ВЕРТИКАЛЬ — считаем от ширины
        baseSize = preloadImage.offsetWidth;
    } else {
        // ГОРИЗОНТАЛЬ — считаем от высоты (как раньше)
        baseSize = preloadImage.offsetHeight;
    }*/
	baseSize = Math.min(
      preloadImage.offsetWidth,
      preloadImage.offsetHeight
    );
	
	

    var newW = baseSize * 0.2;
	
    //var newW = preloadImage.offsetHeight * 0.2;
	
	koleso.style.width = newW + 'px'; // 32% от ширины preloadImage
    koleso.style.height = newW + 'px'; // 74% от вычисленной ширины
	var borderWidth = newW * 0.2; // 20% от ширины koleso
    
    koleso.style.position = "absolute";
    koleso.style.top = "50%";
    koleso.style.left = "50%";
    koleso.style.transform = "translate(-50%, -50%)";
    koleso.style.zIndex = "11";
    koleso.style.borderRadius = "50%";
    koleso.style.background = "transparent";
    koleso.style.border = borderWidth + 'px solid #fe930e'; //темная часть
	koleso.style.borderTopColor = "#2a97e1";
    koleso.style.animation = "spin 1s linear infinite";
    document.body.appendChild(koleso);
}