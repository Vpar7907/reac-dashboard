export function aroundToFive(a: number) {
    const b = a % 5;

    b && (a = a - b + 5);

    return a
};
