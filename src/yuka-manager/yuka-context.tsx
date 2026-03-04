/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useRef, useMemo, useState, type ReactNode } from "react";
import * as THREE from "three";
import * as YUKA from "yuka";


interface YukaContextType {
    characterRef: React.RefObject<THREE.Group | null>;
    entityManager: YUKA.EntityManager;
    playerVehicle: YUKA.Vehicle;
    obstacles: {
        entity: YUKA.GameEntity,
        mesh: THREE.Object3D
    }[];
    setObstacles: React.Dispatch<React.SetStateAction<{
        entity: YUKA.GameEntity,
        mesh: THREE.Object3D
    }[]>>;
    obstacleMeshRef: React.RefObject<THREE.Group[]>;
}


const YukaContext = createContext<YukaContextType | undefined>(undefined);


export const YukaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const characterRef = useRef<THREE.Group>(null);
    const [obstacles, setObstacles] = useState<{
        entity: YUKA.GameEntity,
        mesh: THREE.Object3D
    }[]>([]);
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


    const value: YukaContextType = {
        characterRef,
        entityManager,
        playerVehicle,
        obstacles,
        setObstacles,
        obstacleMeshRef
    };


    return (
        <YukaContext.Provider value={value}>
            {children}
        </YukaContext.Provider>
    );
};


export const useYuka = () => {
    const context = useContext(YukaContext);
    if (context === undefined) {
        throw new Error("useYuka must be used within a YukaProvider. Wrap your app in <YukaProvider />.");
    }
    return context;
};



