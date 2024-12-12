"use client";
// pages/_app.tsx or pages/_app.js
import '@/index.css';
import { useEffect } from 'react';
import { useStore } from '@/store';
import { EffectsView } from '@/components/EffectsView';
import { ControlPanel } from '@/components/ControlPanel';
import { LfoPanel } from '@/components/LfoPanel';

export default function Home() {
	const { showControls, toggleShowControls, patch } = useStore();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.repeat) {
				return; // Ignore repeated keydown events in React STRICT MODE
			}
			if (event.key === ' ') {
				event.preventDefault();
				toggleShowControls();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<div className="flex-col w-full h-full">
			<div className="relative flex items-center justify-center w-full h-full">
				<EffectsView controlSettingsParm={patch.controllerValues} />
				{showControls && (
					<>
						<ControlPanel />
						<LfoPanel />
					</>
				)}
			</div>
		</div>
	);
}
