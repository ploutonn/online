/* -*- tab-width: 4 -*- */

/*
 * Copyright the Collabora Online contributors.
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

abstract class ISlideChangeBase {
	public abstract start(): void;
	public abstract end(): void;
	public abstract perform(nT: number, last: boolean): void;
	public abstract getUnderlyingValue(): number;
}

// we use mixin for simulating multiple inheritance
function SlideChangeTemplate<T extends AGConstructor<any>>(BaseType: T) {
	abstract class SlideChangeBase extends BaseType implements ISlideChangeBase {
		private isFinished: boolean;
		protected requestAnimationFrameId: number;
		protected transitionParameters: TransitionParameters;
		protected leavingSlide: WebGLTexture | ImageBitmap;
		protected enteringSlide: WebGLTexture | ImageBitmap;
		protected time: number;
		protected isLastFrame: boolean;

		constructor(...args: any[]) {
			assert(
				args.length === 1,
				'SlideChangeBase, constructor args length is wrong',
			);

			const transitionParameters: TransitionParameters = args[0];
			super(transitionParameters);
			this.transitionParameters = transitionParameters;
			this.leavingSlide = transitionParameters.current;
			this.enteringSlide = transitionParameters.next;
			this.isFinished = false;
			this.requestAnimationFrameId = null;
			this.time = null;
			this.isLastFrame = false;
		}

		public abstract start(): void;

		public end(): void {
			if (this.isFinished) return;
			// end() can be invoked before last render() execution
			if (this.requestAnimationFrameId !== null) {
				console.debug('SlideChangeBase.end: render() not yet executed');
				this.requestAnimationFrameId = null;
				setTimeout(this.end.bind(this), 100);
				return;
			}
			this.isFinished = true;
			this.endTransition();
		}

		protected abstract endTransition(): void;

		public perform(nT: number, last: boolean = false): void {
			if (this.isFinished) return;
			this.time = nT;
			this.isLastFrame = last;
		}

		public renderFrame(
			nT: number,
			properties?: AnimatedElementRenderProperties,
		) {
			if (nT !== null && nT >= 0.0) {
				this.render(nT, properties);
			}
		}

		fakeRequestAnimationFrame(callback: FrameRequestCallback) {
			if (document.hidden) {
				// main tab was hidden in the browser

				if (this._inFakeFrameRequest) return;
				this._inFakeFrameRequest = true;

				const now = performance.now();
				if (now - this._lastTime > 16) {
					this._lastTime = now;
					callback(now);

					if (this._requestAnimationFrameId)
						cancelAnimationFrame(this._requestAnimationFrameId);

					this._requestAnimationFrameId = requestAnimationFrame(
						(timestamp: number) => {
							console.debug(timestamp + ' dummy requestAnimationFrame');
						},
					);
				} else {
					if (this._fakeRequestAnimationFrameId)
						clearTimeout(this._fakeRequestAnimationFrameId);

					this._fakeRequestAnimationFrameId = setTimeout(() => {
						this.fakeRequestAnimationFrame(callback);
						this._fakeRequestAnimationFrameId = null;
					}, 1);
				}

				this._inFakeFrameRequest = false;
			} else {
				// main tab visible
				return requestAnimationFrame(callback);
			}

			return 0;
		}

		protected animate() {
			if (this.time !== null && this.time > 0.0) {
				this.render(this.time);
			}
			if (!this.isLastFrame)
				this.requestAnimationFrameId = this.fakeRequestAnimationFrame(
					this.animate.bind(this),
				);
		}

		protected abstract render(
			nT: number,
			properties?: AnimatedElementRenderProperties,
		): void;

		public getUnderlyingValue(): number {
			return 0.0;
		}
	}
	return SlideChangeBase;
}

// classes passed to SlideChangeTemplate must have the same number and types of ctor parameters
// expected by SlideChangeBase, so we define the following wrapper class
abstract class TextureRendererCtorForSlideChangeBase extends SimpleTextureRenderer {
	constructor(transitionParameters: TransitionParameters) {
		super(
			transitionParameters.context as RenderContextGl,
			/*create program*/ false,
		);
	}
}

// SlideChangeGl extends SlideChangeBase, SimpleTextureRenderer
const SlideChangeGl = SlideChangeTemplate(
	TextureRendererCtorForSlideChangeBase,
);
