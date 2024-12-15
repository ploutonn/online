/* -*- js-indent-level: 8; fill-column: 100 -*- */
/*
 * Copyright the Collabora Online contributors.
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint-disable no-inner-declarations */
/* eslint no-unused-vars: ["warn", { "argsIgnorePattern": "^_" }] */
/* global importScripts Uint8Array */

function create(tagName, className, container) {
	var el = document.createElement(tagName);
	el.className = className;

	if (container) {
		container.appendChild(el);
	}

	return el;
}

let canvas = null;

window.offscreenC = new OffscreenCanvas(
	800,
	600,
);

console.error('window.offscreenC = ' + !!window.offscreenC);

// function _createCanvas(parent /*, width, height*/) {
// 	canvas = create('canvas', 'leaflet-slideshow2', parent);

// 	canvas.id = 'slideshow-canvas';
// 	// set canvas styles
// 	canvas.style.margin = 0;
// 	canvas.style.position = 'absolute';

// 	return canvas;
// }

// function _createPresenterHTML(parent, width, height) {
// 	// const presenterContainer = create('div', 'leaflet-slideshow2', parent);
// 	// presenterContainer.id = 'presenter-container';
// 	// const slideshowContainer = create(
// 	// 	'div',
// 	// 	'leaflet-slideshow2',
// 	// 	presenterContainer,
// 	// );
// 	// slideshowContainer.id = 'slideshow-container';
// 	/*const _slideShowCanvas = */ _createCanvas(
// 		slideshowContainer,
// 		width,
// 		height,
// 	);
// 	return presenterContainer;
// }

console.info('SlideShowWorker add nodes');
const body = document.querySelector('#root-in-window');

// const _presenterContainer = _createPresenterHTML(
// 	body,
// 	window.screen.width,
// 	window.screen.height,
// );

document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.height = '100%';
document.body.style.overflow = 'hidden';

canvas = document.body.querySelector('cavas');
canvas.height = '600';
canvas.width = '800';

function onMessage(e) {
	console.error('onmesg from: ' + e.origin);
	// const ctx = canvas.getContext('2d');
	// const img = new Image();

	// img.addEventListener('load', () => {
	// 	ctx.drawImage(img, 0, 0);
	// });

	// img.src = e.data.message;
}
window.addEventListener('message', onMessage);

function onClick() {
	console.error('click event');
	opener.postMessage({
		message: 'click',
	});
}

document.body.onclick = onClick;
