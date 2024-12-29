"use client";
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react';
import { useStore } from '../../store';
import { EffectsView } from '../../components/EffectsView';
import { ControlPanel } from '../../components/ControlPanel';
import { LfoPanel } from '../../components/LfoPanel';
import { ThreeScene } from '../../components/ThreeScene';
import { RawWebGLCanvas } from '../../components/RawWebGlCanvas';

export const App = () => {
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
		<div className="flex-col w-screen h-screen bg-pink-50">
			<div className="relative flex items-center justify-center w-full h-full bg-blue-200 ">
				{/* <EffectsView controlSettingsParm={patch.controllerValues} /> */}
        <RawWebGLCanvas />
				{showControls && (
					<>
						<ControlPanel />
						<LfoPanel />
					</>
				)}
			</div>
		</div>
	);
};

export const Route = createFileRoute('/main/')({
  component: App,
});
