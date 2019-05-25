import { Context } from "../context/Context";

/**
 *  Wrapper around the OfflineAudioContext
 *  @param  channels  The number of channels to render
 *  @param  duration  The duration to render in samples
 *  @param sampleRate the sample rate to render at
 */
export class OfflineContext extends Context {

	name = "OfflineContext";

	/**
	 *  A private reference to the duration
	 */
	private readonly _duration: Seconds;

	/**
	 *  An artificial clock source
	 */
	private _currentTime: Seconds = 0;

	/**
	 * Private reference to the OfflineAudioContext.
	 */
	protected _context!: OfflineAudioContext;

	constructor(channels: number, duration: Seconds, sampleRate: number) {

		super({
			clockSource: "offline",
			context: new OfflineAudioContext(channels, duration * sampleRate, sampleRate),
			lookAhead: 0,
			updateInterval: 128 / sampleRate,
		});

		this._duration = duration;
	}

	/**
	 *  Override the now method to point to the internal clock time
	 */
	now(): Seconds {
		return this._currentTime;
	}

	/**
	 * Same as this.now()
	 */
	get currentTime(): Seconds {
		return this._currentTime;
	}

	/**
	 *  Overwrite resume, should not do anything in the OfflineAudioContext.
	 */
	resume(): Promise<void> {
		return Promise.resolve();
	}

	/**
	 *  Render the output of the OfflineContext
	 */
	render(): Promise<AudioBuffer> {
		while (this._duration - this._currentTime >= 0) {
			// invoke all the callbacks on that time
			this.emit("tick");
			// increment the clock in 5ms chunks
			this._currentTime += 0.005;
		}

		return this._context.startRendering();
	}

	/**
	 *  Close the context
	 */
	close(): Promise<OfflineContext> {
		return Promise.resolve(this);
	}
}