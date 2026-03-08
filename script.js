const ctx = canvas.getContext('2d');
ctx.font = '18px xkcd-script';
ctx.textBaseline ='top';

document.querySelectorAll('input').forEach(input => {
	input.addEventListener('input', update);
})

buttonSave.addEventListener('click', function saveImage() {
	let data = canvas.toDataURL('image/png');
	let dummyLink = document.createElement('a');
	dummyLink.href = data;
	dummyLink.download = 'comic.png';
	dummyLink.click();
	dummyLink.remove();
})

buttonCopy.addEventListener('click', async function copyImage() {
	const data = canvas.toBlob(async (blob) => {
		await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
	});
	window.alert('Copied the comic to your clipboard!');
})

function update() {
	if (inputAdvancedMode.checked) {
		document.querySelectorAll('.advancedSettings').forEach(input => {
			input.removeAttribute('hidden');
		})
		document.querySelectorAll('.simpleSettings').forEach(input => {
			input.setAttribute('hidden', true);
		})
	}
	else {
		document.querySelectorAll('.advancedSettings').forEach(input => {
			input.setAttribute('hidden', true);
		})
		document.querySelectorAll('.simpleSettings').forEach(input => {
			input.removeAttribute('hidden');
		})
	}

	draw();
}

function draw() {
	let line1;
	let line2;
	let line3;
	let bottomText;

	if (inputAdvancedMode.checked) {
		line1 = inputLine1.value || "Silicate Chemistry is second nature to us geochemists, so it's easy to forget that the average person probably only knows the formulas for olivine and one or two feldspars.";
		line2 = inputLine2.value || "And Quartz, of course.";
		line3 = inputLine3.value || "Of course.";
	}
	else {
		let topic = inputTopic.value || 'Silicate Chemistry';
		let plural_topic = inputPluralTopic.checked;
		let experts = inputExperts.value || 'Geochemists';
		let example = inputExample.value || 'The formulas for olivine and one or two feldspars';
		let response = inputResponse.value || 'Quartz';
		
		let topic_verb = plural_topic ? 'are' : 'is'; 
	
		line1 = `${topic} ${topic_verb} second nature to us ${experts}, so it's easy to forget that the average person probably only knows ${example}.`
		line2 = `And ${response}, of course.`
		line3 = 'Of course.'
	}

	bottomText = inputBottomText.value || "Even when they're trying to compensate for it, experts in anything wildly overestimate the average person's familiarity with their field.";

	const width = canvas.width;
	const height = canvas.height;
	
	// Copy the original image to the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	
	// Clear the areas where the text will be placed
	ctx.fillStyle = '#FFF';
	ctx.fillRect(0.088 * width, 0.043 * height, 0.817 * width, 0.238 * height);
	ctx.fillRect(0.298 * width, 0.312 * height, 0.613 * width, 0.033 * height);
	ctx.fillRect(0.095 * width, 0.366 * height, 0.273 * width, 0.033 * height);
	ctx.fillRect(0.012 * width, 0.832 * height, 0.977 * width, 0.155 * height);

	// Line 1
	ctx.fillStyle = '#000';
	ctx.textAlign = 'left';
	ctx.letterSpacing = '-0.06em';
	textWrap(line1.toUpperCase(), 0.090 * width, 0.03 * height, 0.820 * width, 0.255 * height);

	// Line 2
	ctx.font = '36px xkcd-script';
	ctx.textAlign = 'right';
	ctx.fillText(line2.toUpperCase(), 0.910 * width, 0.312 * height, 0.645 * width);

	// Line 3
	ctx.textAlign = 'left';
	ctx.fillText(line3.toUpperCase(), 0.100 * width, 0.367 * height, 0.645 * width);

	// Bottom Text
	ctx.textAlign = 'center';
	textWrap(bottomText.toUpperCase(), 0.5 * width, 0.832 * height, 0.999 * width, 0.180 * height, false);
}

function textWrap(text, x, y, width, height, alignBottom = true) {
	ctx.font = '36px xkcd-script';

	let words = text.split(/\s+/);
	let currentLine = '';
	let wrappedText = [];
	let fontSize = 36;
	for(let i = 0; i < words.length; i++) {
		let testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
		if (ctx.measureText(testLine).width > width && currentLine) {
			wrappedText.push(currentLine);
			currentLine = words[i];
		} else {
			currentLine = testLine
		}
	}
	if (currentLine) wrappedText.push(currentLine);
	
	if (wrappedText.length * fontSize > height) {
		fontSize = height / wrappedText.length;
		ctx.font = `${fontSize}px xkcd-script`;
	}

	if (alignBottom) {
		let blockHeight = fontSize * wrappedText.length
		if (blockHeight < height) {
			y = y + height - blockHeight;
		}
	}
	
	for (let i = 0; i < wrappedText.length; i++) {
		ctx.fillText(wrappedText[i], x, y + fontSize * i)
	}
}

function init() {
	img = new Image();
	img.crossOrigin = 'anonymous';
	img.src = 'assets/comic.png';
	img.onload = () => {update(); document.querySelector('fieldset').removeAttribute('hidden')}
	
	let params = new URLSearchParams(document.location.search);

	inputAdvancedMode.checked = params.get('advanced_mode');
	inputLine1.value = params.get('line1');
	inputLine2.value = params.get('line2');
	inputLine3.value = params.get('line3');
	inputTopic.value = params.get('topic');
	inputPluralTopic.checked = params.get('plural_topic');
	inputExperts.value = params.get('experts');
	inputExample.value = params.get('example');
	inputResponse.value = params.get('response');
	inputBottomText.value = params.get('bottom_text');
}

init();
