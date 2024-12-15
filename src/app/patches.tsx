import { useState } from 'react';
import { Patch } from '@prisma/client';

export default function PatchManagement() {
  const [patches, setPatches] = useState([]);
  const [userId, setUserId] = useState('');
  const [controllerValuesId, setControllerValuesId] = useState('');
  const [frequency, setFrequency] = useState(0.1);
  const [type, setType] = useState('sine');

  const fetchPatches = async () => {
    const response = await fetch('/api/patches');
    const data = await response.json();
    setPatches(data);
  };

  const createPatch = async () => {
    const response = await fetch('/api/patches/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        controllerValuesId,
        lfoSettings: [{ frequency, type }],
      }),
    });
    const data = await response.json();
    console.log(data);
    fetchPatches();
  };

  return (
    <div>
      <h1>Patch Management</h1>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Controller Values ID"
        value={controllerValuesId}
        onChange={(e) => setControllerValuesId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Frequency"
        value={frequency}
        onChange={(e) => setFrequency(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <button onClick={createPatch}>Create Patch</button>
      <button onClick={fetchPatches}>Fetch Patches</button>
      <ul>
        {patches.map((patch: Patch) => (
          <li key={patch.id}>{patch.id}</li>
        ))}
      </ul>
    </div>
  );
}