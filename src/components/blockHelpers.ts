export type blockData = {
    blockId: number,                  // What is the type of block
    blockInstanceId: number | null;   // What is it's Id in the instance world i.e which block in the world is it
};

class BlockMethods {
    public worldHeight: number;
    public worldWidth: number;
    public blocksDataArray: blockData[][][];

    constructor(
        worldHeight: number,
        worldWidth: number,
        blocksDataArray: blockData[][][],
    ) {
        this.worldHeight = worldHeight;
        this.worldWidth = worldWidth;
        this.blocksDataArray = blocksDataArray;
    }

    getBlock(x: number, y: number, z: number): blockData | null {
        if (this.checkInBounds(x, y, z)) {
            return this.blocksDataArray[x][y][z];
        } else {
            return null;
        }
    }

    checkInBounds(x: number, y: number, z: number): boolean {
        if (x >= 0 && x < this.worldWidth &&
            y >= 0 && y < this.worldHeight &&
            z >= 0 && z < this.worldWidth) {
            return true;
        } else {
            return false;
        }
    }

    setBlockId(x: number, y: number, z: number, id: number): void {
        if (this.checkInBounds(x, y, z)) {
            this.blocksDataArray[x][y][z].blockId = id;
        }
    }

    setInstanceId(x: number, y: number, z: number, instanceId: number): void {
        if (this.checkInBounds(x, y, z)) {
            this.blocksDataArray[x][y][z].blockInstanceId = instanceId;
        }
    }

}

export { BlockMethods };