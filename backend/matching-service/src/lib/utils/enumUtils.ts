function enumValues<T>(e: any): T[] {
    return Object.keys(e).map((key) => e[key]);
}

export function encodeEnum<E extends object>(enumObj: E, values: E[]): string {
    if (values.length === 0) {
        return '0'.repeat(Object.keys(enumObj).length / 2);
    }

    let stringValues = values.map(x => (x as String).toUpperCase())

    const binaryCode = enumValues(enumObj)
        .map((enumValue) => (stringValues.includes(enumValue as string) ? '1' : '0'))
        .join('');

    return binaryCode;
}

export function binaryToHex(...input: string[]): string {
    var binaryString = input.join("");
    const decimalValue = parseInt(binaryString, 2); 
    const hexString = decimalValue.toString(16); // Convert decimal to hexadecimal
    return hexString;
}
