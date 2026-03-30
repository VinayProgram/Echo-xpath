import { Box, Plane } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber';
import { useParams, useRouter } from '@tanstack/react-router';
import React from 'react';
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib';
import { useAnimations } from '@react-three/drei';
import { mazeData } from './maze';

export interface MazeCell {
    type: {
        type: 'wall' | 'path' | 'prop';
        props?: {
            scale: number,
            positionY: number,
            url: string
        }
    };
    isStart?: boolean;
    isEnd?: boolean;
    isHazard?: boolean;
    isPortal?: boolean;
    id: string;
}


export const Maze = () => {


    const navigate = useRouter()
    const [isLost, setIsLost] = React.useState<'lost' | 'won' | 'idle'>("idle")
    const ghostRef = React.useRef<THREE.Mesh>(null!)
    const winnerRef = React.useRef<THREE.Mesh>(null!)
    const [portalLock, setPortalLock] = React.useState(false)


    useFrame(() => {
        if (isLost === "lost" && ghostRef.current) {
            ghostRef.current.rotation.y += 0.01 // rotate continuously around Y axis
        }
        if (isLost === "won" && winnerRef.current) {
            winnerRef.current.rotation.y += 0.01 // rotate continuously around Y axis
        }
    })


    return (
        <group>
            {mazeData.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    // 3. Render based on the 'type' property
                    if (cell.isStart) {
                        return (
                            <Box
                                name='start'
                                key={`${rowIndex}-${colIndex}-start`}
                                position={[colIndex, 0.01, rowIndex]}
                                args={[1, 0.02, 1]}
                            >
                                <meshStandardMaterial color="limegreen" emissive="green" />
                            </Box>
                        );
                    }

                    if (cell.isEnd) {
                        return (
                            <group key={`${rowIndex}-${colIndex}-end`}>
                                {isLost === "won" ?
                                    <React.Suspense>
                                        <PropLoader url={'/dancer_girl.glb'} position={[colIndex, 0.1, rowIndex]} scale={1} ref={winnerRef}></PropLoader>
                                    </React.Suspense> :
                                    <Box
                                        key={`${rowIndex}-${colIndex}-end`}
                                        position={[colIndex, 0.01, rowIndex]}
                                        args={[1, 0.02, 1]}
                                    >
                                        <meshStandardMaterial color="dodgerblue" emissive="blue" />
                                    </Box>}
                            </group>
                        );
                    }

                    if (cell.isHazard) {
                        return (
                            <group key={`${rowIndex}-${colIndex}-hazard`}>
                                {isLost === "lost" ?
                                    <React.Suspense>
                                        <PropLoader url={'/ghost_kitty.glb'} position={[colIndex, 0.01, rowIndex]} scale={0.3} ref={ghostRef}></PropLoader>
                                    </React.Suspense> :
                                    <TypeRender key={`${rowIndex}-${colIndex}`} rowIndex={rowIndex} colIndex={colIndex} cell={cell} />}
                            </group>
                        );
                    }

                    if (cell.isPortal) {
                        return (
                            <React.Suspense fallback={<Box args={[1, 1, 1]} position={[colIndex, 0.5, rowIndex]}></Box>}>
                                <group key={`${rowIndex}-${colIndex}-portal`}>
                                    <PropLoader url={'/door.glb'} position={[colIndex, 0.01, rowIndex]} scale={20} >
                                    </PropLoader>
                                </group>
                            </React.Suspense>
                        );
                    }

                    return (
                        <TypeRender key={`${rowIndex}-${colIndex}`} rowIndex={rowIndex} colIndex={colIndex} cell={cell} />

                    );
                })
            )}

        </group>
    );
};

const TypeRender = ({ rowIndex, colIndex, cell }: { rowIndex: number, colIndex: number, cell: MazeCell }) => {
    // const { diffuse2, normal2, rough2, rockDiffuse, rockNormal, rockRough } = useCustomMaterialHook()

    switch (cell.type.type) {
        case 'wall':
            {
                const props = cell.type.props
                if (props) {
                    return (
                        <group key={`${rowIndex}-${colIndex}-wall`}>
                            <PropLoader url={props.url} position={[colIndex, props.positionY, rowIndex]} scale={props.scale} />
                        </group>
                    )
                } else {
                    return (
                        <group key={`${rowIndex}-${colIndex}-wall`}>
                            <Box
                                onClick={() => {
                                    console.log(cell.id)
                                }}
                                position={[colIndex, 0.5, rowIndex]} // Standard 1x1x1 cube
                                args={[1, 1, 1]}
                            >
                                <meshPhysicalMaterial color={"brown"} />
                            </Box>
                        </group>
                    )
                }
            }
        case 'path': {
            return (
                <Box
                    key={`${rowIndex}-${colIndex}-path`}
                    position={[colIndex, 0.01, rowIndex]}
                    args={[1, 0.02, 1]}
                >
                    <meshPhysicalMaterial emissiveIntensity={0.1} emissive={'green'}
                        roughness={1} sheenRoughness={0.5} />
                </Box>
            )
        }
        case 'prop': {
            if (cell.type.props) {
                return (
                    <React.Fragment key={`${rowIndex}-${colIndex}-prop`}>
                        <PropLoader url={cell.type.props.url} position={[colIndex, cell.type.props.positionY, rowIndex]} scale={cell.type.props.scale} key={`${rowIndex}-${colIndex}-prop`} />
                    </React.Fragment>
                )
            }
            return null
        }
        default:
            return <Plane
                args={[1, 1]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[colIndex, 0.01, rowIndex]}
            >
                <meshPhysicalMaterial emissiveIntensity={0.1} emissive={'green'}
                    roughness={1} sheenRoughness={0.5} />
            </Plane>
    }
}

export const PropLoader = ({
    url,
    position,
    scale = 0.1,
    ref: externalRef
}: {
    url: string
    position: [number, number, number]
    scale?: number
    ref?: React.RefObject<THREE.Object3D>
}) => {
    const model = useLoader(GLTFLoader, url)
    const clonedScene = React.useMemo(() => model.scene.clone(true), [model.scene])
    const groupRef = React.useRef<THREE.Group>(null)
    // const { diffuse2, normal2, rough2 } = useCustomMaterialHook()
    // Combine internal and external refs
    React.useEffect(() => {
        if (externalRef && groupRef.current) {
            (externalRef as React.RefObject<THREE.Object3D>).current = groupRef.current
        }
    }, [externalRef])

    const { actions, mixer } = useAnimations(model.animations, groupRef)

    React.useEffect(() => {
        const action = actions[model.animations[0]?.name]
        action?.play()
    }, [actions, model.animations])

    // Update mixer (advance animation)
    useFrame((_, delta) => {
        mixer?.update(delta)
    })

    return (
        <>

            <Plane
                args={[1, 1]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[position[0], 0.02, position[2]]}
            >

                <meshPhysicalMaterial emissiveIntensity={0.1} emissive={'green'}
                    roughness={1} sheenRoughness={0.5} />
            </Plane>
            <primitive
                ref={groupRef}
                object={clonedScene}
                position={position}
                scale={scale}
            />
        </>

    )
}


const useCustomMaterialHook = () => {
    const [diffuse2, normal2, rough2] = useLoader(THREE.TextureLoader, [
        '/textures/aerial_grass_rock_diff_1k.jpg',
        '/textures/aerial_grass_rock_nor_gl_1k.jpg',
        '/textures/aerial_grass_rock_rough_1k.jpg',
    ]);
    [diffuse2, normal2].forEach((tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
    });

    const [rockDiffuse, rockNormal, rockRough] = useLoader(THREE.TextureLoader, [
        '/textures/rock_wall_13_diff_1k.jpg',
        '/textures/rock_wall_13_nor_gl_1k.jpg',
    ]);
    [rockDiffuse, rockNormal].forEach((tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
    });
    return { diffuse2, normal2, rough2, rockDiffuse, rockNormal, rockRough }
}