
export default function SkiaRoot() {
    const image = useImage('https://images.pexels.com/photos/261152/pexels-photo-261152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
    const path = makeHexagonPath(50, [50, 50]);
    return (
        <Canvas style={{ width : 100, height : 100 }}>
            <Group clip={path}>
                {(image)  ? (
                    <Image
                        image={image}
                        fit="cover"
                        x={0}
                        y={0}
                        width={100}
                        height={100}
                    />
                ):(
                    <Path path={path} color="lightblue" />
                )}
            </Group>
        </Canvas>
    );
}
