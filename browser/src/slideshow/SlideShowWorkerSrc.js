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

function _createCanvas(parent /*, width, height*/) {
	const canvas = create('canvas', 'leaflet-slideshow2', parent);

	canvas.id = 'slideshow-canvas';
	// set canvas styles
	canvas.style.margin = 0;
	canvas.style.position = 'absolute';

	return canvas;
}

function _createPresenterHTML(parent, width, height) {
	const presenterContainer = create('div', 'leaflet-slideshow2', parent);
	presenterContainer.id = 'presenter-container';
	const slideshowContainer = create(
		'div',
		'leaflet-slideshow2',
		presenterContainer,
	);
	slideshowContainer.id = 'slideshow-container';
	/*const _slideShowCanvas = */ _createCanvas(
		slideshowContainer,
		width,
		height,
	);
	return presenterContainer;
}

console.info('SlideShowWorker add nodes');
const body = document.querySelector('#root-in-window');

const _presenterContainer = _createPresenterHTML(
	body,
	window.screen.width,
	window.screen.height,
);

setInterval(() => {
	const logRefresh = function () {
		console.debug('_requestPauseFrame: after onTabSwitch pause was activated');
	};
	requestAnimationFrame(logRefresh);
}, 100);

function slideshowworker() {
	if ('undefined' === typeof window) {
		self.L = {};

		addEventListener('message', onMessage);

		console.info('SlideShowWorker initialised');

		function onMessage(e) {
			switch (e.data.message) {
				case 'slideshowmsg':
					console.error('SlideShowWorker message');
					console.error(_presenterContainer);

					postMessage({
						message: e.data.message,
					});
					break;

				default:
					console.error('Unrecognised worker message');
			}
		}
	}
}
slideshowworker();
