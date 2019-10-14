
/**
 * Returns the number of bit 0 before the rightmost bit set to 1.
 * @param {*} v
 */
export function getRightShift(v) {
    if (!v) return -1;  //means there isn't any 1-bit
    let i = 0;
    while ((v & 1) === 0) {
        i++;
        v = v>>1;
    }
    return i;
}
