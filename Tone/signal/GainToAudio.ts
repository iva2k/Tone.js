import { ToneAudioNodeOptions } from "../core/context/ToneAudioNode";
import { SignalOperator } from "./SignalOperator";
import { WaveShaper } from "./WaveShaper";

/**
 * GainToAudio converts an input in NormalRange [0,1] to AudioRange [-1,1].
 * See {@link AudioToGain}.
 *
 * @example
 * var a2g = new GainToAudio();
 */
export class GainToAudio extends SignalOperator<ToneAudioNodeOptions> {

	name = "GainToAudio";

	/**
	 * The node which converts the audio ranges
	 */
	private _norm = new WaveShaper({
		context: this.context,
		mapping: x => Math.abs(x) * 2 - 1,
	});
	protected _internalChannels = [this._norm];

	/**
	 * The NormalRange input [0, 1]
	 */
	input = this._norm;

	/**
	 * The AudioRange output [-1, 1]
	 */
	output = this._norm;

	/**
	 *  clean up
	 */
	dispose(): this {
		super.dispose();
		this._norm.dispose();
		return this;
	}
}