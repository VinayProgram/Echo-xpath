import { Html, useProgress } from "@react-three/drei"

export const Loader = ({ label }: { label: string }) => {
    const { progress } = useProgress()
    return (
        <Html center>
            <div style={{
                background: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px"
            }}>
                Loading {label}... {progress.toFixed(0)}%
            </div>
        </Html>
    )
}