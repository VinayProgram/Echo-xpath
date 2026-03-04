import React, { useState, useEffect } from 'react'
import { TransformControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../../store/use-game-store'
import { useYuka } from '@/yuka-manager/yuka-context'


interface TransformControllerProps {
    onSelect?: (object: THREE.Object3D | null) => void;
}


const TransformController: React.FC<TransformControllerProps> = ({ onSelect }) => {
    const { scene, camera, gl } = useThree();
    const isTransforming = useGameStore((state) => state.isTransforming);
    const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
    const [mode, setMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
    const { obstacles } = useYuka()

    // Deselect if transformation mode is turned off
    useEffect(() => {
        if (!isTransforming) {
            setSelectedObject(null);
            if (onSelect) onSelect(null);
        }
    }, [isTransforming, onSelect]);


    // Handle clicks to select objects
    useEffect(() => {
        if (!isTransforming) return;


        const handleClick = (event: MouseEvent) => {
            const rect = gl.domElement.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;


            const clickMouse = new THREE.Vector2(x, y);
            const clickRaycaster = new THREE.Raycaster();
            clickRaycaster.setFromCamera(clickMouse, camera);


            const intersects = clickRaycaster.intersectObjects(obstacles.map((x) => x.mesh), true);


            const validIntersections = intersects.filter(intersect => {
                let obj: THREE.Object3D | null = intersect.object;
                while (obj) {
                    if (obj.name === 'navmesh' || obj.type === 'TransformControls' || obj.type === 'GridHelper') return false;
                    obj = obj.parent;
                }
                return true;
            });




            if (validIntersections.length > 0) {
                let target = validIntersections[0].object;
                while (target.parent && target.parent !== scene && target.parent.type !== 'Scene') {
                    target = target.parent;
                }


                setSelectedObject(target);
                if (onSelect) onSelect(target);
            } else {
                setSelectedObject(null);
                if (onSelect) onSelect(null);
            }
        };


        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key.toLowerCase()) {
                case 'w': setMode('translate'); break;
                case 'e': setMode('rotate'); break;
                case 'r': setMode('scale'); break;
                case 'escape': setSelectedObject(null); break;
            }
        };


        gl.domElement.addEventListener('click', handleClick);
        window.addEventListener('keydown', handleKeyDown);


        return () => {
            gl.domElement.removeEventListener('click', handleClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isTransforming]);


    return (
        <>
            {selectedObject && isTransforming && (
                <TransformControls
                    object={selectedObject}
                    mode={mode}
                />
            )}
        </>
    )
}


export default TransformController;

