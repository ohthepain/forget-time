"use client";
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useStore } from '@/store';
import { ControlPanel } from '@/components/ControlPanel';
import { LfoPanel } from '@/components/LfoPanel';
import { ControlSettings } from '@/store';
import { useSession } from 'next-auth/react';

const DynamicEffectsView = dynamic<{ controlSettingsParm: ControlSettings }>(
  () => import('@/components/EffectsView').then((mod) => mod.EffectsView),
  {
    ssr: false,
  }
);

const Home = () => {
    console.log(`ar ar ar mother ararar`);
  const { showControls, toggleShowControls, patch } = useStore();
  const { data: session, status } = useSession();

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
  }, [toggleShowControls]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not logged in. Please sign in.</p>;
  }

  return (
    <div className="flex-col w-full h-full">
      <div className="relative flex items-center justify-center w-full h-full">
        <DynamicEffectsView controlSettingsParm={patch.controllerValues} />
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

export default dynamic(() => Promise.resolve(Home), { ssr: false });
