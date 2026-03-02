/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useRef, useMemo, useState, type ReactNode } from "react";
import * as THREE from "three";
import * as YUKA from "yuka";

interface GameContextType {
  characterRef: React.RefObject<THREE.Group | null>;
  entityManager: YUKA.EntityManager;
  playerVehicle: YUKA.Vehicle;
  obstacles: YUKA.GameEntity[];
  setObstacles: React.Dispatch<React.SetStateAction<YUKA.GameEntity[]>>;
  obstacleMeshRef: React.RefObject<THREE.Group[]>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const characterRef = useRef<THREE.Group>(null);
  const [obstacles, setObstacles] = useState<YUKA.GameEntity[]>([]);
  const obstacleMeshRef = useRef<THREE.Group[]>([]);
  // Initialize YUKA core components
  const entityManager = useMemo(() => new YUKA.EntityManager(), []);
  const playerVehicle = useMemo(() => {
    const vehicle = new YUKA.Vehicle();
    vehicle.maxSpeed = 3;
    vehicle.maxForce = 4;
    vehicle.mass = 1;
    return vehicle;
  }, []);

  // Add vehicle to manager once
  React.useEffect(() => {
    entityManager.add(playerVehicle);
  }, [entityManager, playerVehicle]);

  const value: GameContextType = {
    characterRef,
    entityManager,
    playerVehicle,
    obstacles,
    setObstacles,
    obstacleMeshRef
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider. Wrap your app in <GameProvider />.");
  }
  return context;
};
