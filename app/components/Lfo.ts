import { useStore, LfoSettings } from '../store';
import { LfoType } from '@prisma/client';

const computeLfoValue = (lfoSettings: LfoSettings, time: number): number => {
	switch (lfoSettings.type) {
		case LfoType.SINE:
			// console.log(`computeLfoValue: sine ${lfoSettings.id}`);
			return Math.sin(
				2 *
					Math.PI *
					lfoSettings.frequency *
					lfoSettings.frequency *
					time,
			);
		case LfoType.SQUARE:
			// console.log('square ' + Math.sign(Math.sin(2 * Math.PI * lfoSettings.frequency * lfoSettings.frequency * time)))
			return Math.sign(
				Math.sin(
					2 *
						Math.PI *
						lfoSettings.frequency *
						lfoSettings.frequency *
						time,
				),
			);
		case LfoType.TRIANGLE:
			return (
				Math.asin(
					Math.sin(
						2 *
							Math.PI *
							lfoSettings.frequency *
							lfoSettings.frequency *
							time,
					),
				) /
				(Math.PI / 2)
			);
		case LfoType.SAWTOOTH:
			return (
				((2 * lfoSettings.frequency * lfoSettings.frequency * time) %
					2) -
				1
			);
		default:
			return 0;
	}
};

export const cacheLfoValues = (time: number): number[] => {
	const lfoSettings = useStore.getState().patch.lfoSettings;
	// console.log(`cacheLfoValues: ${lfoSettings[0].type}`);
	const values: number[] = new Array(lfoSettings.length);
	for (let i = 0; i < lfoSettings.length; i++) {
		values[i] = computeLfoValue(lfoSettings[i], time);
	}
	return values;
};
